import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  GraduationCap,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Heart,
  Sparkles,
  Send,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  BookOpen,
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
  Shirt,
} from "lucide-react";
import "./index.css";

/* ═══════════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════════ */
const CONFIG = {
  graduateName: "Trịnh Thị Mỹ Vy",
  major: "Logistics & Quản lý Chuỗi cung ứng",
  degree: "Cử nhân",
  university: "Trường Đại học Kinh Tế Tài Chính TP.HCM",
  ceremonyDate: new Date(2026, 7, 27, 13, 0, 0), // 27/08/2026 13:00
  ceremonyTime: "13:00 (1 giờ chiều)",
  venue: "Hội trường lớn",
  venueSub: "Trường ĐH Kinh Tế - Tài Chính TP.HCM (UEF)",
  venueAddress: "141 - 145 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM",
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

/* ── Countdown calculation ────────────────────────────────────── */
function calcDiff(target) {
  const d = Math.max(0, target - Date.now());
  return {
    days: Math.floor(d / 864e5),
    hours: Math.floor((d / 36e5) % 24),
    minutes: Math.floor((d / 6e4) % 60),
    seconds: Math.floor((d / 1e3) % 60),
  };
}

/* ── Confetti Celebration Trigger ─────────────────────────────── */
function fireCelebrationConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#c5a059", "#b75d4e", "#dfba73", "#f7eedd", "#e07a5f"],
    shapes: ["circle", "square"],
    ticks: 200,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ["#c5a059", "#b75d4e", "#f3e9df"],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ["#c5a059", "#b75d4e", "#f3e9df"],
    });
  }, 250);
}

/* ══════════════════════════════════════════════════════════════
   PHOTO CAROUSEL (Lucide arrows, smooth swipe)
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
    <section
      className="carousel-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-track-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.03 }}
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
            className="carousel-slide"
            style={{ cursor: "grab" }}
          >
            <img
              src={PHOTOS[current].src}
              alt={PHOTOS[current].caption}
              className="carousel-img"
              draggable={false}
            />
            <div className="carousel-overlay" />
            <div className="carousel-badge">
              {PHOTOS[current].caption} · {current + 1}/{count}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next Lucide Arrows */}
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={prev}
          aria-label="Ảnh trước"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={next}
          aria-label="Ảnh sau"
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="carousel-dots">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`carousel-dot ${i === current ? "carousel-dot-active" : ""}`}
            aria-label={`Ảnh ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL WRAPPER
   ══════════════════════════════════════════════════════════════ */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SECTION TITLE
   ══════════════════════════════════════════════════════════════ */
function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <p className="section-label">{subtitle || "—"}</p>
      <h2 className="section-heading">{title}</h2>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   THIN DIVIDER
   ══════════════════════════════════════════════════════════════ */
function Divider() {
  return <div className="divider" />;
}

/* ══════════════════════════════════════════════════════════════
   COUNTDOWN
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
          className="cd-card"
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={it.v}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 6, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="cd-num"
            >
              {String(it.v).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="cd-label">{it.l}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MINI CALENDAR
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
    <div style={{ maxWidth: 280, margin: "0 auto" }}>
      <p className="cal-month">
        {months[month]} {year}
      </p>
      <div className="cal-grid mb-1">
        {labels.map((l) => (
          <div key={l} className="cal-head">
            {l}
          </div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.005 }}
            className={`cal-cell-wrap ${c === null ? "invisible" : ""}`}
          >
            <span className={c === day ? "cal-active" : "cal-day"}>{c}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   INTERACTIVE WISHES & CELEBRATION (All Lucide Icons)
   ══════════════════════════════════════════════════════════════ */
function InteractiveActions() {
  const [likes, setLikes] = useState(() => {
    const saved = localStorage.getItem("myvy_grad_likes");
    return saved ? parseInt(saved, 10) : 68;
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

    // Spawn floating heart particle using Lucide Heart
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const heart = {
      id,
      x: rect.left + rect.width / 2 - 9 + (Math.random() * 26 - 13),
      y: rect.top,
    };
    setFloatingHearts((prev) => [...prev, heart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1200);

    if (nextCount % 5 === 0) {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ["#b75d4e", "#c5a059", "#dfba73"],
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Thư mời Lễ tốt nghiệp — Trịnh Thị Mỹ Vy",
      text: "Trân trọng kính mời bạn đến tham dự Lễ tốt nghiệp của Trịnh Thị Mỹ Vy vào ngày 27/08/2026 lúc 13:00!",
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
      "Lễ Trao Bằng Tốt Nghiệp Cử nhân Logistics & Quản lý Chuỗi cung ứng — Trịnh Thị Mỹ Vy tại UEF Hội trường lớn.",
    );
    const location = encodeURIComponent(CONFIG.venueAddress);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260827T060000Z/20260827T090000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, "_blank");
  };

  return (
    <>
      <div className="action-grid">
        <button onClick={handleSendHeart} className="action-card-btn">
          <Heart size={15} color="#b75d4e" fill="#b75d4e" strokeWidth={0} />
          <span>Gửi tim ({likes})</span>
        </button>

        <button onClick={handleAddToCalendar} className="action-card-btn">
          <CalendarPlus size={15} color="#c5a059" strokeWidth={2} />
          <span>Lưu vào Lịch</span>
        </button>

        <button
          onClick={() => {
            fireCelebrationConfetti();
            showToast("Chúc mừng Tân Cử Nhân Trịnh Thị Mỹ Vy!");
          }}
          className="action-card-btn btn-celebrate"
        >
          <PartyPopper size={15} color="#b75d4e" strokeWidth={2} />
          <span>Bắn pháo hoa</span>
        </button>

        <button onClick={handleShare} className="action-card-btn">
          <Share2 size={15} color="#6c5b54" strokeWidth={2} />
          <span>Chia sẻ thiệp</span>
        </button>
      </div>

      {/* Floating hearts rendered in fixed position using Lucide Heart */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={{ left: h.x, top: h.y }}
        >
          <Heart size={18} fill="#b75d4e" color="#b75d4e" strokeWidth={0} />
        </div>
      ))}

      {/* Toast Notice */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="toast-notice"
          >
            <Sparkles size={15} color="#dfba73" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   RSVP SECTION
   ══════════════════════════════════════════════════════════════ */
function RSVPSection({ guestName }) {
  const [name, setName] = useState(
    guestName === CONFIG.defaultGuestName ? "" : guestName,
  );
  const [status, setStatus] = useState(null);
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
      alert("Chưa cấu hình GOOGLE_SCRIPT_URL!");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: generateToken(name), name, status }),
      });
      setAttendees([
        ...attendees,
        { name: name.trim(), status, timestamp: new Date().toISOString() },
      ]);
      setSubmitted(true);
      fireCelebrationConfetti();
    } catch {
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="section">
        <Reveal>
          <div className="card text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.45 }}
              className="rsvp-ok-icon"
            >
              <CheckCircle2 size={28} strokeWidth={2} />
            </motion.div>
            <p className="rsvp-ok-title">Đã xác nhận thành công!</p>
            <p className="rsvp-ok-sub">
              Cảm ơn <strong>{name || guestName}</strong> đã phản hồi. Rất mong
              được đón tiếp bạn tại buổi lễ!
            </p>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="section">
      <Reveal>
        <SectionTitle title="Xác nhận tham dự" subtitle="RSVP" />
      </Reveal>
      <Reveal delay={0.06}>
        <div className="card">
          {/* Name input */}
          <div className="mb-4">
            <label className="input-label">Tên của bạn</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              className="modern-input"
            />
            {isNameExist && (
              <p className="input-hint">
                Tên này đã có trong danh sách xác nhận.
              </p>
            )}
          </div>

          {/* Status buttons */}
          <div className="flex gap-2.5 mb-5">
            <button
              onClick={() => setStatus("Tham dự")}
              className={`rsvp-btn ${status === "Tham dự" ? "rsvp-yes" : "rsvp-idle"}`}
            >
              <CheckCircle2 size={15} strokeWidth={2} />
              Sẽ tham dự
            </button>
            <button
              onClick={() => setStatus("Không tham dự")}
              className={`rsvp-btn ${status === "Không tham dự" ? "rsvp-no" : "rsvp-idle"}`}
            >
              <XCircle size={15} strokeWidth={2} />
              Bận, không thể đến
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !status || isSubmitting || isNameExist}
            className="submit-btn"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} strokeWidth={2} />
            )}
            {isSubmitting ? "Đang gửi thông tin..." : "Gửi xác nhận tham dự"}
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
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
      else throw new Error("Lỗi phản hồi từ server");
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
            <ShieldCheck size={22} strokeWidth={2} color="#dfba73" />
            <h1 className="admin-title">Admin Dashboard</h1>
          </div>
          <button
            onClick={fetchData}
            className="admin-refresh"
            aria-label="Tải lại"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="admin-card flex items-center justify-between mb-5 p-5">
          <div>
            <p className="stat-label">Tổng phản hồi</p>
            <p className="stat-num">{total}</p>
            <div className="flex gap-4 mt-2 text-[12px]">
              <span className="stat-yes flex items-center gap-1">
                <CheckCircle2 size={13} /> Tham dự: {yesCount}
              </span>
              <span className="stat-no flex items-center gap-1">
                <XCircle size={13} /> Không: {noCount}
              </span>
            </div>
          </div>
          <div className="pie-chart" style={{ "--yes-pct": `${yesPct}%` }} />
        </div>

        <h2 className="admin-list-title">
          <Users size={16} color="#dfba73" strokeWidth={2} /> Danh sách khách
          mời
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin text-[#dfba73]" />
          </div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : data.length === 0 ? (
          <p className="empty-text">Chưa có phản hồi nào.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="admin-card p-4 flex items-center justify-between"
              >
                <div>
                  <p className="list-name">{item.name}</p>
                  <p className="list-time">
                    {new Date(item.timestamp).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span
                  className={
                    item.status === "Tham dự" ? "badge-yes" : "badge-no"
                  }
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN APPLICATION
   ══════════════════════════════════════════════════════════════ */
export default function App() {
  const p = new URLSearchParams(window.location.search);
  const isAdmin = p.get("admin") === "true";
  if (isAdmin) return <AdminPage />;

  const guestName = useMemo(() => getGuestName(), []);

  // Initial welcome confetti burst
  useEffect(() => {
    const t = setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.25 },
        colors: ["#c5a059", "#b75d4e", "#f7eedd"],
      });
    }, 750);
    return () => clearTimeout(t);
  }, []);

  const details = [
    {
      icon: CalendarIcon,
      label: "Ngày tổ chức",
      value: "Thứ Năm, 27 tháng 8 năm 2026",
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
      icon: BookOpen,
      label: "Chuyên ngành",
      value: `${CONFIG.degree} — ${CONFIG.major}`,
    },
  ];

  return (
    <div className="page-root">
      <div className="site-card">
        {/* ── HERO SECTION ─────────────────────────────────────── */}
        <section className="hero">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="hero-badge"
          >
            <GraduationCap size={13} strokeWidth={2.2} />
            Thư mời tốt nghiệp
          </motion.div>

          {/* Portrait frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="portrait-wrap"
          >
            <div className="portrait-frame">
              <img
                src={CONFIG.photoUrl}
                alt={CONFIG.graduateName}
                className="portrait-img"
              />
            </div>
          </motion.div>

          {/* Name & Academic info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="hero-text"
          >
            <h1 className="hero-name">{CONFIG.graduateName}</h1>
            <p className="hero-sub">
              {CONFIG.degree} · {CONFIG.major}
            </p>
            <p className="hero-univ">{CONFIG.university}</p>
          </motion.div>
        </section>

        {/* ── GUEST INVITATION CARD ────────────────────────────── */}
        <section className="section">
          <Reveal>
            <div className="guest-card">
              <p className="guest-label">Trân trọng kính mời</p>
              <p className="guest-name">{guestName}</p>
              <p className="guest-sub">
                Đến chung vui cùng Mỹ Vy trong ngày Lễ tốt nghiệp cử nhân
              </p>
            </div>
          </Reveal>

          {/* Interactive Utility Bar (All Lucide Icons) */}
          <Reveal delay={0.08}>
            <InteractiveActions />
          </Reveal>
        </section>

        <Divider />

        {/* ── PHOTO CAROUSEL ───────────────────────────────────── */}
        <Reveal>
          <PhotoCarousel />
        </Reveal>

        <Divider />

        {/* ── COUNTDOWN ────────────────────────────────────────── */}
        <section className="section">
          <Reveal>
            <SectionTitle title="Đếm ngược đến ngày lễ" subtitle="COUNTDOWN" />
          </Reveal>
          <Reveal delay={0.06}>
            <Countdown target={CONFIG.ceremonyDate} />
          </Reveal>
        </section>

        {/* ── CALENDAR ─────────────────────────────────────────── */}
        <section className="section">
          <Reveal>
            <div className="card p-5">
              <MiniCalendar date={CONFIG.ceremonyDate} />
            </div>
          </Reveal>
        </section>

        <Divider />

        {/* ── PROGRAM & DETAILS ────────────────────────────────── */}
        <section className="section">
          <Reveal>
            <SectionTitle title="Thông tin buổi lễ" subtitle="EVENT DETAILS" />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="card">
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
                  className={`detail-row ${
                    i < details.length - 1 ? "detail-border" : ""
                  }`}
                >
                  <div className="detail-icon">
                    <d.icon size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="detail-label">{d.label}</p>
                    <p className="detail-value">{d.value}</p>
                    {d.sub && <p className="detail-sub">{d.sub}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Map Link */}
          <Reveal delay={0.1}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                CONFIG.venueAddress,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              <div className="detail-icon">
                <Compass size={16} strokeWidth={2} />
              </div>
              <span className="map-text">{CONFIG.venueAddress}</span>
              <ExternalLink
                size={14}
                strokeWidth={2}
                style={{ flexShrink: 0, opacity: 0.55 }}
              />
            </a>
          </Reveal>
        </section>

        <Divider />

        {/* ── RSVP ─────────────────────────────────────────────── */}
        <RSVPSection guestName={guestName} />

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer className="site-footer">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer-hearts">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{
                    duration: 2.2,
                    delay: i * 0.35,
                    repeat: Infinity,
                  }}
                >
                  <Heart
                    size={13}
                    fill="#c5a059"
                    color="#c5a059"
                    strokeWidth={0}
                  />
                </motion.div>
              ))}
            </div>
            <p className="footer-name">{CONFIG.graduateName}</p>
            <p className="footer-meta">Khóa 2026 · {CONFIG.university}</p>
          </motion.div>
        </footer>

        {/* Floating Celebration Trigger Button */}
        <button
          onClick={fireCelebrationConfetti}
          className="floating-celebrate-btn"
          aria-label="Bắn pháo hoa chúc mừng"
        >
          <Sparkles size={16} />
          <span>Chúc mừng</span>
        </button>
      </div>
    </div>
  );
}
