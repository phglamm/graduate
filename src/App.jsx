import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Crown,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Heart,
  Sparkles,
  Send,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Phone,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  Users,
  RefreshCw,
  Share2,
  CalendarPlus,
  Compass,
  Mail,
  MailOpen,
} from "lucide-react";

// ReactBits animated components
import ShinyText from "./components/reactbits/ShinyText";
import SpotlightCard from "./components/reactbits/SpotlightCard";
import StarBorder from "./components/reactbits/StarBorder";
import BlurText from "./components/reactbits/BlurText";
import ClickSpark from "./components/reactbits/ClickSpark";

// Trình phát nhạc chuông chúc mừng
import MusicPlayer from "./components/MusicPlayer";

import "./index.css";

/* ═══════════════════════════════════════════════════════════════
   CẤU HÌNH THÔNG TIN THIỆP MỜI (100% TIẾNG VIỆT)
   ═══════════════════════════════════════════════════════════════ */
const CONFIG = {
  graduateName: "Trịnh Thị Mỹ Vy",
  major: "Logistics & Quản lý Chuỗi cung ứng",
  university: "Trường Đại học Kinh Tế - Tài Chính TP.HCM (UEF)",
  ceremonyDate: new Date(2026, 7, 27, 13, 0, 0), // 27/08/2026 lúc 13:00
  ceremonyTime: "16:00 - 17:30 (4 giờ đến 5 giờ 30 chiều)",
  ceremonyDayText: "Thứ Năm, 27 tháng 8 năm 2026",
  venue: "Nhà hát Hoà Bình",
  venueSub: "Trường ĐH Kinh Tế - Tài Chính TP.HCM",
  venueAddress:
    "Nhà hát Hòa Bình, 240 3 Tháng 2, Hòa Hưng, Hồ Chí Minh, Việt Nam",
  contact: "0973957488 - Mỹ Vy",
  photoUrl: "/portrait.png",
  defaultGuestName: "Quý khách",
  GOOGLE_SCRIPT_URL: import.meta.env.VITE_GOOGLE_SCRIPT_URL,
};

function getGuestName() {
  const p = new URLSearchParams(window.location.search);
  return p.get("to") || CONFIG.defaultGuestName;
}

function generateToken(name) {
  return btoa(encodeURIComponent(name)).slice(0, 10);
}

/* ── Tính toán thời gian đếm ngược ────────────────────────────── */
function calcDiff(target) {
  const d = Math.max(0, target - Date.now());
  return {
    days: Math.floor(d / 864e5),
    hours: Math.floor((d / 36e5) % 24),
    minutes: Math.floor((d / 6e4) % 60),
    seconds: Math.floor((d / 1e3) % 60),
  };
}

/* ── Hiệu ứng Bắn Pháo Hoa Công Chúa ─────────────────────────── */
function firePrincessConfetti() {
  confetti({
    particleCount: 85,
    spread: 75,
    origin: { y: 0.6 },
    colors: ["#ff2a75", "#ff609f", "#ffcf56", "#c084fc", "#ffffff"],
    shapes: ["circle", "square"],
    ticks: 220,
  });

  setTimeout(() => {
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: ["#ff2a75", "#ff609f", "#ffd8eb", "#ffcf56"],
    });
    confetti({
      particleCount: 55,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: ["#ff2a75", "#ff609f", "#ffd8eb", "#ffcf56"],
    });
  }, 250);
}

/* ══════════════════════════════════════════════════════════════
   BONG BÓNG NGŨ SẮC BAY LƠ LỬNG
   ══════════════════════════════════════════════════════════════ */
const BUBBLE_PRESETS = [
  { id: 1, left: "8%", size: 26, dur: "11s", delay: "0s" },
  { id: 2, left: "22%", size: 42, dur: "14s", delay: "2.5s" },
  { id: 3, left: "48%", size: 20, dur: "9s", delay: "1s" },
  { id: 4, left: "68%", size: 36, dur: "13s", delay: "4s" },
  { id: 5, left: "85%", size: 28, dur: "10s", delay: "1.5s" },
  { id: 6, left: "35%", size: 32, dur: "15s", delay: "6s" },
  { id: 7, left: "75%", size: 48, dur: "16s", delay: "8s" },
];

function PrincessBubbles() {
  const popBubble = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 16,
      spread: 360,
      startVelocity: 8,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ["#ff2a75", "#ff82b6", "#ffcf56", "#ffffff"],
      ticks: 80,
    });
  };

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {BUBBLE_PRESETS.map((b) => (
        <div
          key={b.id}
          className="iridescent-bubble"
          onClick={popBubble}
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            "--rise-dur": b.dur,
            "--rise-delay": b.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TIÊU ĐỀ PHÂN MỤC NGHỆ THUẬT (100% TIẾNG VIỆT)
   ══════════════════════════════════════════════════════════════ */
function SectionTitle({ title }) {
  return (
    <div className="section-art-title">
      <div className="section-title-badge">
        <Sparkles size={14} color="#ff2a75" strokeWidth={2.4} />
        <span>{title}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ĐƯỜNG PHÂN CÁCH ÁNH HỒNG
   ══════════════════════════════════════════════════════════════ */
function Divider() {
  return <div className="art-divider" />;
}

/* ══════════════════════════════════════════════════════════════
   HIỆU ỨNG CUỘN TRANG MƯỢT MÀ
   ══════════════════════════════════════════════════════════════ */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   KHOẢNH KHẮC KỶ NIỆM (Photo Carousel)
   ══════════════════════════════════════════════════════════════ */
const PHOTOS = [
  { src: "/portrait.png", caption: "Trịnh Thị Mỹ Vy" },
  { src: "/graduate-photo.png", caption: "Lễ Tốt Nghiệp 2026" },
];

function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const count = PHOTOS.length;

  const next = () => setCurrent((c) => (c + 1) % count);
  const prev = () => setCurrent((c) => (c - 1 + count) % count);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      next();
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, current]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -35) next();
              else if (info.offset.x > 35) prev();
            }}
            className="absolute inset-0 w-full h-full touch-pan-y"
            style={{ cursor: "grab" }}
          >
            <img
              src={PHOTOS[current].src}
              alt={PHOTOS[current].caption}
              className="carousel-slide-img"
              draggable={false}
            />
            <div className="carousel-caption-pill flex items-center gap-1.5">
              <Sparkles size={13} color="#ff2a75" />
              <span>
                {PHOTOS[current].caption} · {current + 1}/{count}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nút lật ảnh trái / phải */}
        <button
          className="carousel-nav-btn left-3"
          onClick={prev}
          aria-label="Ảnh trước"
        >
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>
        <button
          className="carousel-nav-btn right-3"
          onClick={next}
          aria-label="Ảnh sau"
        >
          <ChevronRight size={20} strokeWidth={2.4} />
        </button>
      </div>

      {/* Dải chấm tròn chỉ vị trí ảnh */}
      <div className="flex justify-center items-center gap-1.5 !py-3">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-200 ${
              i === current
                ? "w-6 h-2 rounded-full bg-gradient-to-r from-[#ff2a75] to-[#ff609f]"
                : "w-2 h-2 rounded-full bg-[#ffb0d1]"
            }`}
            aria-label={`Xem ảnh ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HỘP ĐẾM NGƯỢC (Countdown)
   ══════════════════════════════════════════════════════════════ */
function Countdown({ target }) {
  const [t, setT] = useState(calcDiff(target));
  useEffect(() => {
    const id = setInterval(() => setT(calcDiff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items = [
    { v: t.days, l: "Ngày" },
    { v: t.hours, l: "Giờ" },
    { v: t.minutes, l: "Phút" },
    { v: t.seconds, l: "Giây" },
  ];

  return (
    <div className="flex justify-center gap-2.5">
      {items.map((it, idx) => (
        <motion.div
          key={it.l}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: idx * 0.06,
            ease: [0.22, 1, 0.36, 1],
            duration: 0.4,
          }}
          className="countdown-box"
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={it.v}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 6, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="countdown-number"
            >
              {String(it.v).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="countdown-unit">{it.l}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LỊCH SỰ KIỆN THÁNG 8 NĂM 2026 (Mini Calendar)
   ══════════════════════════════════════════════════════════════ */
function MiniCalendar({ date }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  return (
    <div className="calendar-card">
      <div className="calendar-header-title">
        <CalendarIcon size={15} strokeWidth={2.4} color="#ff2a75" />
        <span>
          {months[month]} Năm {year}
        </span>
      </div>

      <div className="calendar-grid-row !mb-1.5">
        {labels.map((l, i) => (
          <div
            key={l}
            className={`calendar-weekday-cell ${i === 0 ? "calendar-weekday-sun" : ""}`}
          >
            {l}
          </div>
        ))}
      </div>

      <div className="calendar-grid-row">
        {cells.map((c, i) => (
          <div
            key={i}
            className={`flex items-center justify-center ${c === null ? "invisible" : ""}`}
          >
            {c !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.006 }}
                className={`calendar-day-cell ${c === day ? "calendar-active-day" : ""}`}
              >
                {c}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div className="calendar-footer-note flex items-center justify-center gap-1.5">
        <Sparkles size={13} color="#ff2a75" />
        <span>Ngày 27/08/2026 — Lễ trao bằng tốt nghiệp Tân Cử nhân</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   THANH TIỆN ÍCH TƯƠNG TÁC (Gửi Tim · Lịch · Pháo Hoa · Chia Sẻ)
   ══════════════════════════════════════════════════════════════ */
function InteractiveActions() {
  const [likes, setLikes] = useState(() => {
    const saved = localStorage.getItem("myvy_grad_likes");
    return saved ? parseInt(saved, 10) : 99;
  });
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleSendHeart = (e) => {
    const nextCount = likes + 1;
    setLikes(nextCount);
    localStorage.setItem("myvy_grad_likes", nextCount.toString());

    // Sinh hạt tim bay
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const heart = {
      id,
      x: rect.left + rect.width / 2 - 10 + (Math.random() * 26 - 13),
      y: rect.top,
    };
    setFloatingHearts((prev) => [...prev, heart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1300);

    if (nextCount % 5 === 0) {
      firePrincessConfetti();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Thư mời Lễ tốt nghiệp — Trịnh Thị Mỹ Vy",
      text: "Trân trọng kính mời bạn đến tham dự Lễ tốt nghiệp cử nhân của Trịnh Thị Mỹ Vy vào ngày 27/08/2026 lúc 13:00!",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Đã sao chép liên kết thư mời!");
      } catch {
        showToast("Không thể sao chép liên kết.");
      }
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Lễ Tốt Nghiệp — Trịnh Thị Mỹ Vy");
    const details = encodeURIComponent(
      "Lễ Trao Bằng Tốt Nghiệp Cử nhân Logistics & Quản lý Chuỗi cung ứng — Trịnh Thị Mỹ Vy tại Hội trường lớn UEF.",
    );
    const location = encodeURIComponent(CONFIG.venueAddress);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260827T060000Z/20260827T090000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, "_blank");
  };

  return (
    <>
      <div className="quick-action-grid">
        <button onClick={handleSendHeart} className="action-pill-btn">
          <Heart size={16} color="#ff2a75" fill="#ff2a75" strokeWidth={0} />
          <span>Gửi tim ({likes})</span>
        </button>

        <button onClick={handleAddToCalendar} className="action-pill-btn">
          <CalendarPlus size={16} color="#ff2a75" strokeWidth={2.2} />
          <span>Lưu vào Lịch</span>
        </button>

        <button
          onClick={() => {
            firePrincessConfetti();
            showToast("Chúc mừng Tân Cử Nhân Trịnh Thị Mỹ Vy!");
          }}
          className="action-pill-btn action-pill-highlight"
        >
          <PartyPopper size={16} color="#ff2a75" strokeWidth={2.2} />
          <span>Bắn pháo hoa</span>
        </button>

        <button onClick={handleShare} className="action-pill-btn">
          <Share2 size={16} color="#ff2a75" strokeWidth={2.2} />
          <span>Chia sẻ thiệp</span>
        </button>
      </div>

      {/* Hạt tim bay lên màn hình */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart-anim"
          style={{ left: h.x, top: h.y }}
        >
          <Heart size={22} fill="#ff2a75" color="#ff2a75" strokeWidth={0} />
        </div>
      ))}

      {/* Thông báo Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="toast-notice"
          >
            <Sparkles size={16} color="#ffcf56" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   XÁC NHẬN THAM DỰ (RSVP — 100% Tiếng Việt)
   ══════════════════════════════════════════════════════════════ */
function RSVPSection({ guestName }) {
  const [name, setName] = useState(
    guestName === CONFIG.defaultGuestName ? "" : guestName,
  );
  const [status, setStatus] = useState(null);
  const [wishes, setWishes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetch_ = async () => {
      if (!CONFIG.GOOGLE_SCRIPT_URL) return;
      try {
        const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL);
        const json = await res.json();
        if (json.status === "success") {
          setAttendees(json.data);
          const init = guestName === CONFIG.defaultGuestName ? "" : guestName;
          if (init) {
            const ex = json.data.find(
              (d) => d.name.toLowerCase() === init.toLowerCase(),
            );
            if (ex) {
              setSubmitted(true);
              setStatus(ex.status);
            }
          }
        }
      } catch {}
    };
    fetch_();
  }, [guestName]);

  const isNameExist = useMemo(
    () =>
      !!name.trim() &&
      attendees.some((d) => d.name.toLowerCase() === name.trim().toLowerCase()),
    [name, attendees],
  );

  const handleSubmit = async () => {
    if (!name.trim() || !status) return;
    if (!CONFIG.GOOGLE_SCRIPT_URL) {
      alert("Chưa cấu hình liên kết nhận dữ liệu!");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: generateToken(name),
          name,
          status,
          wishes: wishes.trim(),
        }),
      });
      setAttendees([
        ...attendees,
        {
          name: name.trim(),
          status,
          wishes: wishes.trim(),
          timestamp: new Date().toISOString(),
        },
      ]);
      setSubmitted(true);
      firePrincessConfetti();
    } catch {
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="art-section">
        <Reveal>
          <div className="guest-invitation-card !py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.55 }}
              className="w-14 h-14 rounded-full bg-[#fff0f6] border-2 border-[#ff2a75] !flex !items-center !justify-center !mx-auto !!mb-3 text-[#ff2a75] shadow-md"
            >
              <CheckCircle2 size={30} strokeWidth={2.4} />
            </motion.div>
            <h3 className="font-extrabold text-xl text-[#e01058] !!mb-1">
              Đã Nhận Phản Hồi!
            </h3>
            <p className="text-xs text-[#521d37] font-medium max-w-[280px] !mx-auto leading-relaxed">
              Cảm ơn <strong>{name || guestName}</strong> đã gửi phản hồi. Rất
              mong được đón tiếp bạn trong ngày lễ tốt nghiệp!
            </p>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="art-section">
      <Reveal>
        <SectionTitle title="XÁC NHẬN THAM DỰ" />
      </Reveal>
      <Reveal delay={0.06}>
        <StarBorder color="#ff2a75" speed="4.5s">
          {/* Ô nhập tên */}
          <div className="!mb-4">
            <label className="block text-[10px] font-extrabold tracking-wider uppercase text-[#b86f94] !mb-1.5">
              Tên của bạn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên của bạn..."
              className="modern-input"
            />
            {isNameExist && (
              <p className="text-[11px] font-bold text-[#ff2a75] !mt-1.5">
                Tên này đã có trong danh sách xác nhận.
              </p>
            )}
          </div>

          {/* Ô ghi lời chúc */}
          <div className="!mb-4">
            <label className="block text-[10px] font-extrabold tracking-wider uppercase text-[#b86f94] !!mb-1.5">
              Lời chúc đến tân cử nhân
            </label>
            <textarea
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="Gửi lời chúc mừng tốt nghiệp..."
              className="modern-input rsvp-wishes-textarea"
              rows={3}
            />
          </div>

          {/* Nút chọn tham dự */}
          <div className="flex gap-2.5 !mb-5">
            <button
              onClick={() => setStatus("Tham dự")}
              className={`rsvp-option-btn ${
                status === "Tham dự" ? "rsvp-option-yes" : "rsvp-option-idle"
              }`}
            >
              <CheckCircle2 size={16} strokeWidth={2.2} />
              <span>Chắc chắn sẽ tham dự</span>
            </button>
            <button
              onClick={() => setStatus("Không tham dự")}
              className={`rsvp-option-btn ${
                status === "Không tham dự"
                  ? "rsvp-option-no"
                  : "rsvp-option-idle"
              }`}
            >
              <XCircle size={16} strokeWidth={2.2} />
              <span>Tiếc quá, bận mất rùiii</span>
            </button>
          </div>

          {/* Nút gửi */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !status || isSubmitting || isNameExist}
            className="rsvp-submit-btn"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} strokeWidth={2.2} />
            )}
            <span>
              {isSubmitting ? "Đang gửi phản hồi..." : "Gửi xác nhận tham dự"}
            </span>
          </button>
        </StarBorder>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRANG QUẢN TRỊ ADMIN (100% Tiếng Việt)
   ══════════════════════════════════════════════════════════════ */
function AdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!CONFIG.GOOGLE_SCRIPT_URL)
        throw new Error("Chưa cấu hình GOOGLE_SCRIPT_URL");
      const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL);
      const json = await res.json();
      if (json.status === "success") setData(json.data.reverse());
      else throw new Error("Lỗi phản hồi từ máy chủ");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const total = data.length;
  const yesCount = data.filter((d) => d.status === "Tham dự").length;
  const noCount = data.filter((d) => d.status === "Không tham dự").length;
  const yesPct = total > 0 ? (yesCount / total) * 100 : 0;

  return (
    <div className="admin-wrap">
      <div className="admin-inner">
        <div className="admin-header">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} strokeWidth={2} color="#ff82b6" />
            <h1 className="admin-title">Bảng Quản Trị Khách Mời</h1>
          </div>
          <button
            onClick={fetchData}
            className="admin-refresh"
            aria-label="Tải lại danh sách"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="admin-card flex items-center justify-between !mb-5 p-5">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff82b6] !mb-1">
              Tổng số phản hồi
            </p>
            <p className="font-extrabold text-4xl text-[#2e081c]">{total}</p>
            <div className="flex gap-4 !mt-2 text-xs font-bold">
              <span className="text-[#ff82b6] flex items-center gap-1">
                <CheckCircle2 size={13} /> Sẽ tham dự: {yesCount}
              </span>
              <span className="text-[#b86f94] flex items-center gap-1">
                <XCircle size={13} /> Bận: {noCount}
              </span>
            </div>
          </div>
          <div className="pie-chart" style={{ "--yes-pct": `${yesPct}%` }} />
        </div>

        <h2 className="flex items-center gap-2 font-extrabold text-lg text-[#ff82b6] !mb-3">
          <Users size={16} color="#ff82b6" strokeWidth={2} /> Danh sách khách
          xác nhận
        </h2>

        {loading ? (
          <div className="flex justify-center !py-10">
            <Loader2 size={24} className="animate-spin text-[#ff82b6]" />
          </div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : data.length === 0 ? (
          <p className="text-center !py-10 text-[#9e7189] text-xs font-semibold">
            Chưa có khách nào gửi phản hồi.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {data.map((item, idx) => (
              <div key={idx} className="admin-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#2e081c] text-sm">
                    {item.name}
                  </p>
                  <span
                    className={
                      item.status === "Tham dự" ? "badge-yes" : "badge-no"
                    }
                  >
                    {item.status}
                  </span>
                </div>
                {item.wishes && (
                  <p className="text-[12px] text-[#6b3a52] !mt-2 italic bg-[#fff0f6] rounded-lg !px-3 !py-2 border border-[#ffcce0]">
                    💌 "{item.wishes}"
                  </p>
                )}
                <p className="text-[10.5px] text-[#9e7189] !mt-1.5">
                  {new Date(item.timestamp).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BÌA THIỆP MỜI TỐI GIẢN & SANG TRỌNG (Minimalist Luxury Cover)
   ══════════════════════════════════════════════════════════════ */
function EnvelopeCover({ onOpen, guestName }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="envelope-screen"
    >
      <div className="envelope-card-minimal">
        {/* Biểu tượng phong bì tròn viền vàng kim thanh thoát */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="envelope-icon-circle"
        >
          <Mail size={32} strokeWidth={0} fill="#8b1d3b" />
        </motion.div>

        <div className="envelope-invite-heading">
          <span className="text-[#d4af37]">✦</span>
          <span>TRÂN TRỌNG KÍNH MỜI</span>
          <span className="text-[#d4af37]">✦</span>
        </div>

        {/* Tên khách mời (nếu có từ tham số link) */}
        {guestName && guestName !== CONFIG.defaultGuestName && (
          <p className="text-[15px] font-extrabold text-[#8b1d3b] tracking-wider !mb-5">
            {guestName}
          </p>
        )}

        {/* Lễ Tốt Nghiệp / Mỹ Vy */}
        <h1 className="envelope-event-title">Lễ Tốt Nghiệp</h1>
        <h2 className="envelope-person-name">{CONFIG.graduateName}</h2>

        {/* Nút Mở Thiệp Mời hình viên thuốc đỏ rượu sang trọng */}
        <div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="envelope-open-pill-btn"
            aria-label="Mở thiệp mời"
          >
            <span>Mở Thiệp Mời</span>
            <Mail size={15} strokeWidth={2.4} />
          </motion.button>
        </div>

        {/* Dòng chú thích: chạm để mở thiệp & bật nhạc nền */}
        <p className="envelope-sub-hint">
          {" "}
          chạm vào đây để mở thiệp nhaa
          <Heart size={16} color="#ff2a75" fill="#ff2a75" strokeWidth={0} />
        </p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ỨNG DỤNG THIỆP MỜI CHÍNH (100% TIẾNG VIỆT · MOBILE FIRST)
   ══════════════════════════════════════════════════════════════ */
export default function App() {
  const p = new URLSearchParams(window.location.search);
  const isAdmin = p.get("admin") === "true";
  if (isAdmin) return <AdminPage />;

  const guestName = useMemo(() => getGuestName(), []);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    firePrincessConfetti();
  };

  const details = [
    {
      icon: CalendarIcon,
      label: "Ngày tổ chức",
      value: CONFIG.ceremonyDayText,
    },
    {
      icon: Clock,
      label: "Thời gian",
      value: CONFIG.ceremonyTime,
    },
    {
      icon: MapPin,
      label: "Địa điểm",
      value: CONFIG.venue,
      sub: CONFIG.venueSub,
    },
    {
      icon: Phone,
      label: "Liên hệ",
      value: CONFIG.contact,
    },
  ];

  return (
    <div className="page-root">
      {/* Vệt sao lấp lánh theo ngón tay (ReactBits ClickSpark) */}
      <ClickSpark
        sparkColor="#ff2a75"
        sparkCount={7}
        sparkSize={13}
        duration={550}
      />

      {/* Bong bóng ngũ sắc bay lơ lửng */}
      <PrincessBubbles />

      {/* Nút phát nhạc chuông chúc mừng */}
      <MusicPlayer src="/cam on mck.mp3" />

      {/* Chuyển cảnh giữa Phong Bì Bìa Thư và Toàn Bộ Nội Dung Thiệp */}
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <EnvelopeCover
            key="envelope-cover"
            onOpen={handleOpenInvitation}
            guestName={guestName}
          />
        ) : (
          <motion.main
            key="invitation-full-content"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -28, scale: 0.96 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="invitation-card"
          >
            {/* ── PHẦN 1: BÌA THIỆP & TÂN CỬ NHÂN ──────────────────── */}
            <section className="invitation-hero">
              {/* Huy hiệu vương miện */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="hero-crown-badge"
              >
                <Crown size={14} strokeWidth={2.4} color="#ff2a75" />
                <ShinyText text="THƯ MỜI TỐT NGHIỆP" speed={3} />
                <Sparkles size={12} strokeWidth={2.4} color="#ff82b6" />
              </motion.div>

              {/* Khung ảnh tân cử nhân hào quang xoay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.65,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="hero-portrait-wrap"
              >
                <div className="hero-portrait-frame">
                  <img
                    src={CONFIG.photoUrl}
                    alt={CONFIG.graduateName}
                    className="hero-portrait-img"
                  />
                </div>
              </motion.div>

              {/* Tên tân cử nhân xuất hiện từ mờ sang nét */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="flex flex-col items-center !px-1"
              >
                <BlurText
                  text={CONFIG.graduateName}
                  delay={120}
                  className="hero-name-heading justify-center"
                  animateBy="words"
                  direction="top"
                />
                <p className="hero-degree-sub">Tân Cử nhân · {CONFIG.major}</p>
                <p className="hero-univ-title">{CONFIG.university}</p>
              </motion.div>
            </section>

            {/* ── PHẦN 2: THƯ MỜI KÍNH GỬI KHÁCH QUÝ ───────────────── */}
            <section className="art-section">
              <Reveal>
                <SpotlightCard
                  className="guest-invitation-card"
                  spotlightColor="rgba(255, 96, 159, 0.3)"
                  borderColor="rgba(255, 96, 159, 0.45)"
                >
                  <ShinyText
                    text="THƯƠNG MỜI"
                    speed={3.5}
                    className="guest-kính-mời"
                  />
                  <div className="flex justify-center !my-1">
                    <BlurText
                      text={guestName}
                      delay={100}
                      className="guest-main-name justify-center"
                      animateBy="words"
                      direction="bottom"
                    />
                  </div>
                  <p className="guest-body-text">
                    Hy vọng người thương sẽ có mặt để cùng Mỹ Vy khép lại hành
                    trình đại học bằng những nụ cười, những cái ôm và thật nhiều
                    kỷ niệm đẹp nha.
                  </p>
                </SpotlightCard>
              </Reveal>

              {/* 4 Nút tiện ích tương tác nhanh */}
              <Reveal delay={0.08}>
                <InteractiveActions />
              </Reveal>
            </section>

            <Divider />

            {/* ── PHẦN 3: KHOẢNH KHẮC KỶ NIỆM (CAROUSEL) ───────────── */}
            {/* <section className="art-section">
              <Reveal>
                <SectionTitle title="KHOẢNH KHẮC KỶ NIỆM" />
              </Reveal>
              <Reveal delay={0.06}>
                <PhotoCarousel />
              </Reveal>
            </section> */}

            {/* <Divider /> */}

            {/* ── PHẦN 4: ĐẾM NGƯỢC NGÀY LỄ ────────────────────────── */}
            <section className="art-section">
              <Reveal>
                <SectionTitle title="ĐẾM NGƯỢC NGÀY LỄ" />
              </Reveal>
              <Reveal delay={0.06}>
                <Countdown target={CONFIG.ceremonyDate} />
              </Reveal>
            </section>

            {/* Lịch tháng 8 */}
            <section className="art-section pt-0">
              <Reveal>
                <MiniCalendar date={CONFIG.ceremonyDate} />
              </Reveal>
            </section>

            <Divider />

            {/* ── PHẦN 5: THÔNG TIN BUỔI LỄ & BẢN ĐỒ ───────────────── */}
            <section className="art-section">
              <Reveal>
                <SectionTitle title="THÔNG TIN BUỔI LỄ" />
              </Reveal>
              <Reveal delay={0.06}>
                <SpotlightCard
                  className="info-card-wrap"
                  spotlightColor="rgba(255, 42, 117, 0.18)"
                  borderColor="rgba(255, 96, 159, 0.38)"
                >
                  {details.map((d, i) => (
                    <motion.div
                      key={d.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                        duration: 0.4,
                      }}
                      className={`info-row ${
                        i < details.length - 1 ? "info-row-border" : ""
                      }`}
                    >
                      <div className="info-icon-badge">
                        <d.icon size={18} strokeWidth={2.2} />
                      </div>
                      <div className="info-text-container">
                        <p className="info-label">{d.label}</p>
                        <p className="info-value">{d.value}</p>
                        {d.sub && <p className="info-sub">{d.sub}</p>}
                      </div>
                    </motion.div>
                  ))}
                </SpotlightCard>
              </Reveal>

              {/* Nút mở chỉ đường Google Maps */}
              <Reveal delay={0.1}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    CONFIG.venueAddress,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="google-map-btn"
                >
                  <div className="info-icon-badge !w-9 !h-9 !mt-0">
                    <Compass size={17} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-extrabold tracking-wider uppercase text-[#ff2a75]">
                      Chỉ đường Google Maps
                    </p>
                    <p className="text-xs font-bold text-[#2e081c] truncate">
                      {CONFIG.venueAddress}
                    </p>
                  </div>
                  <ExternalLink
                    size={15}
                    strokeWidth={2.2}
                    className="text-[#ff2a75] shrink-0 opacity-75"
                  />
                </a>
              </Reveal>
            </section>

            <Divider />

            {/* ── PHẦN 6: FORM XÁC NHẬN THAM DỰ (RSVP) ─────────────── */}
            <RSVPSection guestName={guestName} />

            {/* ── PHẦN 7: CHÂN THIỆP CẢM ƠN ────────────────────────── */}
            <footer className="invitation-footer">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex justify-center gap-1.5 !mb-2.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                      }}
                    >
                      <Heart
                        size={14}
                        fill="#ff2a75"
                        color="#ff2a75"
                        strokeWidth={0}
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="footer-name-title">{CONFIG.graduateName}</p>
                <p className="footer-school-sub">
                  Khóa 2022 · {CONFIG.university}
                </p>
              </motion.div>
            </footer>

            {/* Nút nổi bắn pháo hoa góc màn hình */}
            <button
              onClick={firePrincessConfetti}
              className="floating-celebrate-btn"
              aria-label="Bắn pháo hoa chúc mừng"
            >
              <Sparkles size={17} />
              <span>Chúc mừng</span>
            </button>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
