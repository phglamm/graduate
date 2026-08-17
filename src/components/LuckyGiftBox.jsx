import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Gift, Sparkles, RefreshCw, Star } from "lucide-react";
import ShinyText from "./reactbits/ShinyText";

const FORTUNES = [
  {
    title: "Tấm Vé VIP Danh Dự",
    desc: "Đặc quyền chụp 100 kiểu ảnh góc nghiêng thần thánh cùng Tân Cử nhân!",
    badge: "VIP Ticket",
  },
  {
    title: "Lời Chúc Triệu Đô",
    desc: "Chúc bạn sự nghiệp thăng tiến vèo vèo, lương nghìn đô, vạn sự hanh thông!",
    badge: "Fortune Blessing",
  },
  {
    title: "Phần Thưởng Ngọt Ngào",
    desc: "1 nụ cười rạng rỡ từ Mỹ Vy & 1 lời cảm ơn sâu sắc nhất vì đã đến chung vui!",
    badge: "Sweet Gift",
  },
  {
    title: "Gói Kỉ Niệm Vô Giá",
    desc: "Lưu giữ khoảnh khắc thanh xuân rực rỡ nhất cùng Mỹ Vy trong ngày trọng đại!",
    badge: "Golden Memory",
  },
];

export default function LuckyGiftBox() {
  const [opened, setOpened] = useState(false);
  const [fortuneIndex, setFortuneIndex] = useState(0);

  const handleOpen = () => {
    const nextIdx = Math.floor(Math.random() * FORTUNES.length);
    setFortuneIndex(nextIdx);
    setOpened(true);

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#ff3b81", "#ffd166", "#c084fc", "#ffffff"],
    });
  };

  return (
    <section className="section">
      <div className="card text-center p-5 relative overflow-hidden bg-gradient-to-br from-white/95 to-[#fff0f6]/90 border-2 border-[#ff65a3]/40">
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <Sparkles size={14} color="#ff3b81" />
          <h3 className="section-heading tracking-wider uppercase text-sm font-extrabold text-[#300b1d] text-center">
            <ShinyText text="LUCKY FORTUNES" speed={3} />
          </h3>
        </div>

        {!opened ? (
          <div className="py-3 flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.9 }}
              animate={{
                y: [0, -6, 0],
                boxShadow: [
                  "0 4px 15px rgba(255,59,129,0.3)",
                  "0 10px 30px rgba(255,59,129,0.5)",
                  "0 4px 15px rgba(255,59,129,0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={handleOpen}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff3b81] to-[#ffd166] text-white flex items-center justify-center border-2 border-white cursor-pointer"
              aria-label="Mở hộp quà"
            >
              <Gift size={28} strokeWidth={2.4} />
            </motion.button>
            <p className="text-xs font-semibold text-[#803358] mt-3">
              Chạm vào hộp quà để mở thông điệp bất ngờ!
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="py-2 flex flex-col items-center"
            >
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-[#ff3b81]/15 text-[#ff3b81] border border-[#ff3b81]/30 mb-2">
                {FORTUNES[fortuneIndex].badge}
              </span>
              <h4 className="font-extrabold text-[15.5px] text-[#e61f65] mb-1">
                {FORTUNES[fortuneIndex].title}
              </h4>
              <p className="text-xs text-[#4a1830] font-medium max-w-[280px] leading-relaxed mb-3">
                {FORTUNES[fortuneIndex].desc}
              </p>

              <button
                onClick={handleOpen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#ff3b81] text-xs font-bold border border-[#ff3b81]/30 shadow-sm hover:bg-[#fff0f6] transition-all"
              >
                <RefreshCw size={12} strokeWidth={2.4} />
                <span>Rút quẻ khác</span>
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
