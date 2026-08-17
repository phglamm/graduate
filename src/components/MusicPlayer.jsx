import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music } from "lucide-react";

/**
 * MUSIC PLAYER
 * - Hỗ trợ phát file MP3 (mặc định tìm file `/music.mp3` trong thư mục public)
 * - Tự động phát khi tải trang (kèm fallback tương tác chạm đầu tiên)
 * - Nếu chưa có file MP3, tự động chuyển sang chế độ chuông gió Web Audio du dương
 */
export default function MusicPlayer({ src = "/music.mp3" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const synthAudioCtxRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const isUsingSynth = useRef(false);

  // 1. Chế độ dự phòng: Chuông gió Web Audio (nếu không tìm thấy file mp3)
  const startSynthFallback = () => {
    try {
      if (!synthAudioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        synthAudioCtxRef.current = new AudioContext();
      }

      if (synthAudioCtxRef.current.state === "suspended") {
        synthAudioCtxRef.current.resume();
      }

      const notes = [
        261.63, 329.63, 392.0, 523.25, // C4, E4, G4, C5
        293.66, 349.23, 440.0, 587.33, // D4, F4, A4, D5
        329.63, 392.0, 493.88, 659.25, // E4, G4, B4, E5
        392.0, 493.88, 587.33, 783.99, // G4, B4, D5, G5
      ];
      let step = 0;

      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);

      const playTone = () => {
        if (!synthAudioCtxRef.current || synthAudioCtxRef.current.state !== "running") return;
        const freq = notes[step % notes.length];
        step++;

        const osc = synthAudioCtxRef.current.createOscillator();
        const gain = synthAudioCtxRef.current.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, synthAudioCtxRef.current.currentTime);

        gain.gain.setValueAtTime(0.0001, synthAudioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.07, synthAudioCtxRef.current.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, synthAudioCtxRef.current.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(synthAudioCtxRef.current.destination);

        osc.start();
        osc.stop(synthAudioCtxRef.current.currentTime + 1.25);
      };

      playTone();
      synthIntervalRef.current = setInterval(playTone, 430);
      isUsingSynth.current = true;
      setIsPlaying(true);
    } catch (e) {
      console.warn("Synth fallback error:", e);
    }
  };

  const stopSynthFallback = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    isUsingSynth.current = false;
  };

  // 2. Chế độ phát chính: File MP3
  const startMusic = async () => {
    if (src) {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.65;

        // Nếu file MP3 không tồn tại (404) -> chuyển sang synth
        audioRef.current.onerror = () => {
          console.log("Không tìm thấy file MP3, chuyển sang chuông gió synth...");
          startSynthFallback();
        };
      }

      try {
        await audioRef.current.play();
        setIsPlaying(true);
        isUsingSynth.current = false;
        return;
      } catch (err) {
        // Nếu bị chặn autoplay -> đợi tương tác hoặc thử synth
        console.log("Chờ người dùng tương tác để mở nhạc MP3...");
      }
    } else {
      startSynthFallback();
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSynthFallback();
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      if (isUsingSynth.current) {
        startSynthFallback();
      } else {
        startMusic();
      }
    }
  };

  // 3. Tự động phát khi vào web + lắng nghe tương tác đầu tiên
  useEffect(() => {
    startMusic();

    const handleFirstInteraction = () => {
      if (!isPlaying) {
        startMusic();
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
    window.addEventListener("scroll", handleFirstInteraction, { once: true });

    return () => {
      if (audioRef.current) audioRef.current.pause();
      stopSynthFallback();
      if (synthAudioCtxRef.current) synthAudioCtxRef.current.close();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };
  }, [src]);

  return (
    <div className="vinyl-player-wrap">
      {/* Chiếc Đĩa Than Vinyl Phát Nhạc */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        className="vinyl-disc"
        aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc nền"}
        title={isPlaying ? "Tạm dừng nhạc nền" : "Bật nhạc nền"}
      >
        {/* Vòng quay của đĩa khi đang phát nhạc */}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={{
            duration: 3,
            repeat: isPlaying ? Infinity : 0,
            ease: "linear",
          }}
          className="w-full h-full flex items-center justify-center relative"
        >
          {/* Rãnh đĩa đồng tâm */}
          <div className="vinyl-disc-grooves" />
          <div className="absolute inset-[8px] rounded-full border border-white/10 pointer-events-none" />

          {/* Nhãn tâm đĩa chuyển sắc hồng vàng */}
          <div className="vinyl-center-label">
            <Music size={9} strokeWidth={2.6} />
          </div>
        </motion.div>

        {/* Cần kim đĩa than */}
        <div
          className="vinyl-tonearm"
          style={{
            transform: isPlaying ? "rotate(24deg)" : "rotate(0deg)",
          }}
        >
          <div className="w-[2px] h-[16px] bg-white rounded-full shadow-sm ml-auto mr-[3px]" />
          <div className="w-[5px] h-[5px] rounded-full bg-[#ffcf56] ml-auto mr-[1.5px] -mt-[2px]" />
        </div>
      </motion.button>

      {/* Cột sóng âm thanh & Nhãn phụ khi phát nhạc */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.85 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-[#ff2a75]/35 shadow-md backdrop-blur-md"
          >
            <div className="flex items-end gap-[2px] h-3">
              {[0.6, 1.2, 0.5, 1.0].map((dur, i) => (
                <motion.span
                  key={i}
                  animate={{ height: ["3px", "12px", "3px"] }}
                  transition={{
                    duration: dur,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-[2px] bg-[#ff2a75] rounded-full"
                />
              ))}
            </div>
            <span className="text-[10.5px] font-extrabold text-[#e01058] tracking-wide">
              Đang phát
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
