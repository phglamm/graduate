import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  MapPin,
  Calendar,
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
  MailOpen,
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
  ceremonyDate: new Date(2026, 7, 27, 13, 0, 0),
  ceremonyTime: "13:00",
  venue: "Hội trường lớn",
  venueSub: "UEF — 141-145 Điện Biên Phủ, P.15, Q.Bình Thạnh",
  venueAddress: "141 - 145 Điện Biên Phủ, P.15, Q.Bình Thạnh",
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

/* ── Countdown calc ───────────────────────────────────────────── */
function calcDiff(target) {
  const d = Math.max(0, target - Date.now());
  return {
    days: Math.floor(d / 864e5),
    hours: Math.floor((d / 36e5) % 24),
    minutes: Math.floor((d / 6e4) % 60),
    seconds: Math.floor((d / 1e3) % 60),
  };
}

/* ══════════════════════════════════════════════════════════════
   PHOTO CAROUSEL
   ══════════════════════════════════════════════════════════════ */
const PHOTOS = [
  { src: "/portrait.png", caption: "Mỹ Vy" },
  { src: "/graduate-photo.png", caption: "Mỹ Vy" },
];

function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const count = PHOTOS.length;

  const go = (dir) => setCurrent((c) => (c + dir + count) % count);

  return (
    <section className="carousel-section">
      <div className="carousel-track-wrap">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: dragging ? 0 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (info.offset.x < -40) go(1);
            else if (info.offset.x > 40) go(-1);
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
          {/* subtle gradient overlay at bottom */}
          <div className="carousel-overlay" />
        </motion.div>

        {/* Prev / Next arrows */}
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={() => go(-1)}
          aria-label="Ảnh trước"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={() => go(1)}
          aria-label="Ảnh sau"
        >
          <ChevronRight size={18} strokeWidth={2} />
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

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
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
   SECTION TITLE  — modern, minimal
   ══════════════════════════════════════════════════════════════ */
function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-5">
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
    <div className="flex justify-center gap-3">
      {items.map((it, idx) => (
        <motion.div
          key={it.l}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: idx * 0.07,
            ease: [0.22, 1, 0.36, 1],
            duration: 0.45,
          }}
          className="cd-card"
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={it.v}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.2 }}
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
            transition={{ delay: i * 0.006 }}
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
   RSVP
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
              <CheckCircle2 size={26} strokeWidth={1.5} />
            </motion.div>
            <p className="rsvp-ok-title">Đã ghi nhận!</p>
            <p className="rsvp-ok-sub">Cảm ơn bạn đã xác nhận tham dự.</p>
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
      <Reveal delay={0.08}>
        <div className="card">
          {/* Name input */}
          <div className="mb-4">
            <label className="input-label">Tên của bạn</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              className="modern-input"
            />
            {isNameExist && (
              <p className="input-hint">Tên này đã xác nhận tham dự.</p>
            )}
          </div>

          {/* Status buttons */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setStatus("Tham dự")}
              className={`rsvp-btn ${status === "Tham dự" ? "rsvp-yes" : "rsvp-idle"}`}
            >
              <CheckCircle2 size={15} strokeWidth={1.8} />
              Tham dự
            </button>
            <button
              onClick={() => setStatus("Không tham dự")}
              className={`rsvp-btn ${status === "Không tham dự" ? "rsvp-no" : "rsvp-idle"}`}
            >
              <XCircle size={15} strokeWidth={1.8} />
              Không thể đến
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !status || isSubmitting || isNameExist}
            className="submit-btn"
          >
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} strokeWidth={1.8} />
            )}
            {isSubmitting ? "Đang gửi..." : "Gửi xác nhận"}
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADMIN
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
      else throw new Error("Lỗi từ server");
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
            <ShieldCheck size={20} strokeWidth={1.8} color="#ec4899" />
            <h1 className="admin-title">Admin Dashboard</h1>
          </div>
          <button onClick={fetchData} className="admin-refresh">
            <RefreshCw
              size={15}
              color="#ec4899"
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        <div className="card flex items-center justify-between mb-5 p-5">
          <div>
            <p className="stat-label">Tổng phản hồi</p>
            <p className="stat-num">{total}</p>
            <div className="flex gap-4 mt-2 text-[12px]">
              <span className="stat-yes">✓ Có: {yesCount}</span>
              <span className="stat-no">✗ Không: {noCount}</span>
            </div>
          </div>
          <div className="pie-chart" style={{ "--yes-pct": `${yesPct}%` }} />
        </div>

        <h2 className="admin-list-title">
          <Users size={16} color="#ec4899" strokeWidth={1.8} /> Danh sách
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={22} className="animate-spin" color="#ec4899" />
          </div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : data.length === 0 ? (
          <p className="empty-text">Chưa có dữ liệu.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="card p-4 flex items-center justify-between"
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
   MAIN APP
   ══════════════════════════════════════════════════════════════ */
export default function App() {
  const p = new URLSearchParams(window.location.search);
  const isAdmin = p.get("admin") === "true";
  if (isAdmin) return <AdminPage />;

  const guestName = useMemo(() => getGuestName(), []);

  const details = [
    { icon: Calendar, label: "Ngày", value: "Thứ Năm, 27 tháng 8 năm 2026" },
    { icon: Clock, label: "Thời gian", value: "13:00 (1 giờ chiều)" },
    {
      icon: MapPin,
      label: "Địa điểm",
      value: CONFIG.venue,
      sub: CONFIG.venueSub,
    },
    {
      icon: BookOpen,
      label: "Ngành học",
      value: `${CONFIG.degree} — ${CONFIG.major}`,
    },
  ];

  return (
    <div className="page-root">
      <div className="site-card">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="hero">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="hero-badge"
          >
            <GraduationCap size={13} strokeWidth={2} />
            Thư mời tốt nghiệp
          </motion.div>

          {/* Portrait — simple oval frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
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

          {/* Name + info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="hero-text"
          >
            <h1 className="hero-name">{CONFIG.graduateName}</h1>
            <p className="hero-sub">
              {CONFIG.degree} · {CONFIG.major}
            </p>
            <p className="hero-univ">{CONFIG.university}</p>
          </motion.div>
        </section>

        {/* ── GUEST CARD ───────────────────────────────────────── */}
        <section className="section">
          <Reveal>
            <div className="guest-card">
              <p className="guest-label">Trân trọng kính mời</p>
              <p className="guest-name">{guestName}</p>
              <p className="guest-sub">đến tham dự buổi lễ tốt nghiệp</p>
            </div>
          </Reveal>
        </section>

        <Divider />

        {/* ── PHOTO CAROUSEL ───────────────────────────────────── */}
        <PhotoCarousel />

        <Divider />
        {/* -- COUNTDOWN ----------------------------------------- */}

        <section className="section">
          <Reveal>
            <SectionTitle title="Đếm ngược đến ngày lễ" subtitle="COUNTDOWN" />
          </Reveal>
          <Reveal delay={0.08}>
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

        {/* ── DETAILS ──────────────────────────────────────────── */}
        <section className="section">
          <Reveal>
            <SectionTitle title="Thông tin buổi lễ" subtitle="EVENT DETAILS" />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="card">
              {details.map((d, i) => (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                    duration: 0.4,
                  }}
                  className={`detail-row ${i < details.length - 1 ? "detail-border" : ""}`}
                >
                  <div className="detail-icon">
                    <d.icon size={15} strokeWidth={1.8} />
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

          <Reveal delay={0.14}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.venueAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              <div className="detail-icon">
                <MapPin size={14} strokeWidth={1.8} />
              </div>
              <span className="map-text">{CONFIG.venueAddress}</span>
              <ExternalLink
                size={13}
                strokeWidth={1.8}
                style={{ flexShrink: 0, opacity: 0.5 }}
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
            transition={{ duration: 0.7 }}
          >
            <div className="footer-hearts">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 2,
                    delay: i * 0.35,
                    repeat: Infinity,
                  }}
                >
                  <Heart
                    size={12}
                    fill="#ec4899"
                    color="#ec4899"
                    strokeWidth={0}
                  />
                </motion.div>
              ))}
            </div>
            <p className="footer-name">{CONFIG.graduateName}</p>
            <p className="footer-meta">Khóa 2026 · {CONFIG.university}</p>
          </motion.div>
        </footer>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 4, duration: 1 }}
          className="scroll-cue"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ChevronDown size={18} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
