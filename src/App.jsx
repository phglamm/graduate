import { useEffect, useRef, useState, useMemo } from "react";
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
  PartyPopper,
  BookOpen,
  MessageCircleHeart,
  ExternalLink,
  Quote,
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
  graduateName: "Lâm Phương",
  major: "Losgistics & Quản lý Chuỗi cung ứng",
  degree: "Cử nhân",
  university: "Trường Đại học Kinh Tế Tài Chính TP.HCM",
  ceremonyDate: new Date(2026, 7, 15, 9, 0, 0),
  ceremonyTime: "09:00 SA",
  venue: "Hội trường lớn",
  venueSub: "Trường Đại học Kinh Tế Tài Chính TP.HCM",
  venueAddress: "141 - 145 Điện Biên Phủ, P.15, Q.Bình Thạnh",
  photoUrl: "/graduate-photo.png",
  defaultGuestName: "Quý khách",
  GOOGLE_SCRIPT_URL: import.meta.env.VITE_GOOGLE_SCRIPT_URL, // TODO: Thêm URL Google Apps Script vào đây
};

console.log(CONFIG.GOOGLE_SCRIPT_URL);
function getGuestName() {
  const p = new URLSearchParams(window.location.search);
  return p.get("to") || CONFIG.defaultGuestName;
}

function generateToken(name) {
  // Đơn giản tạo token từ tên để validate
  return btoa(encodeURIComponent(name)).slice(0, 10);
}

/* ── Countdown ────────────────────────────────────────────── */
function calcDiff(target) {
  const d = Math.max(0, target - Date.now());
  return {
    days: Math.floor(d / 864e5),
    hours: Math.floor((d / 36e5) % 24),
    minutes: Math.floor((d / 6e4) % 60),
    seconds: Math.floor((d / 1e3) % 60),
  };
}

/* ── Scroll reveal wrapper ────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Section title ────────────────────────────────────────── */
function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="text-center mb-5">
      <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F0E8E2] border border-[#E8DDD8] mb-3">
        <Icon size={16} color="#C9847E" strokeWidth={1.8} />
      </div>
      <h3 className="font-serif text-lg font-semibold text-[#3D2E32] mb-0.5">
        {title}
      </h3>
      {subtitle && <p className="text-[11px] text-[#9E9590]">{subtitle}</p>}
    </div>
  );
}

/* ── Ornament divider ─────────────────────────────────────── */
function OrnDivider({ dots = 3 }) {
  return (
    <div className="flex items-center gap-2.5 px-7 my-1">
      <div className="flex-1 h-px bg-[#E8DDD8]" />
      {dots === 3 ? (
        <>
          <span className="text-[#C4A0AE] text-[9px]">✦</span>
          <span className="text-[#C4A0AE] text-[13px]">✦</span>
          <span className="text-[#C4A0AE] text-[9px]">✦</span>
        </>
      ) : (
        <span className="text-[#C4A0AE] text-[13px]">✦</span>
      )}
      <div className="flex-1 h-px bg-[#E8DDD8]" />
    </div>
  );
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
      {items.map((it) => (
        <motion.div
          key={it.l}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="bg-[#F0E8E2] border border-[#E8DDD8] rounded-xl w-[68px] py-2.5 text-center"
        >
          <div className="font-serif text-[22px] font-semibold text-[#8B5E6B] tabular-nums leading-none">
            {String(it.v).padStart(2, "0")}
          </div>
          <div className="text-[9px] uppercase tracking-[.12em] text-[#9E9590] font-medium mt-1">
            {it.l}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CALENDAR
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
    <div className="max-w-[300px] mx-auto">
      <p className="font-serif text-[13px] font-semibold text-[#3D2E32] text-center mb-4">
        {months[month]} {year}
      </p>
      {/* header */}
      <div className="cal-grid mb-1">
        {labels.map((l) => (
          <div
            key={l}
            className="cal-cell text-[10px] font-medium text-[#9E9590] text-center py-1"
          >
            {l}
          </div>
        ))}
      </div>
      {/* days */}
      <div className="cal-grid">
        {cells.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.01, duration: 0.2 }}
            className={`flex items-center justify-center py-1 ${c === null ? "invisible" : ""}`}
          >
            {c === day ? (
              <span className="w-[26px] h-[26px] rounded-full bg-[#8B5E6B] text-white text-[11px] font-semibold flex items-center justify-center">
                {c}
              </span>
            ) : (
              <span className="text-[11px] text-[#7A6A6E]">{c}</span>
            )}
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
    // Lấy danh sách từ server để validate thay vì dùng localStorage
    const fetchAttendees = async () => {
      if (!CONFIG.GOOGLE_SCRIPT_URL) return;
      try {
        const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL);
        const json = await res.json();
        if (json.status === "success") {
          setAttendees(json.data);
          // Kiểm tra xem tên hiện tại đã submit chưa
          const initialName = guestName === CONFIG.defaultGuestName ? "" : guestName;
          if (initialName) {
            const existing = json.data.find(
              (d) => d.name.toLowerCase() === initialName.toLowerCase()
            );
            if (existing) {
              setSubmitted(true);
              setStatus(existing.status);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách RSVP:", err);
      }
    };
    fetchAttendees();
  }, [guestName]);

  const isNameExist = useMemo(() => {
    if (!name.trim()) return false;
    return attendees.some((d) => d.name.toLowerCase() === name.trim().toLowerCase());
  }, [name, attendees]);

  const handleSubmit = async () => {
    if (!name.trim() || !status) return;

    if (!CONFIG.GOOGLE_SCRIPT_URL) {
      alert("Vui lòng cấu hình GOOGLE_SCRIPT_URL trong App.jsx để gửi RSVP!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = generateToken(name);
      await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, name, status }),
      });

      // Thêm vào danh sách local để validate sau khi submit thành công
      setAttendees([...attendees, { name: name.trim(), status, timestamp: new Date().toISOString() }]);
      setSubmitted(true);
    } catch (err) {
      alert("Có lỗi xảy ra khi gửi xác nhận. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="px-5 py-4">
        <Reveal>
          <div className="bg-[#F0E8E2] border border-[#E8DDD8] rounded-2xl p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <CheckCircle2 size={24} color="#8B5E6B" />
            </motion.div>
            <h3 className="font-serif text-lg font-semibold text-[#3D2E32] mb-1">
              Cảm ơn bạn!
            </h3>
            <p className="text-[13px] text-[#7A6A6E]">
              Xác nhận của bạn đã được ghi nhận.
            </p>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="px-5 py-4">
      <Reveal>
        <SectionTitle
          icon={MailOpen}
          title="Xác nhận tham dự"
          subtitle="Vui lòng phản hồi trước 20/07/2026"
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="bg-white border border-[#E8DDD8] rounded-2xl p-5">
          <div className="mb-4">
            <label className="block text-[11px] uppercase tracking-[.15em] text-[#9E9590] font-medium mb-1.5">
              Tên của bạn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              className="w-full bg-[#FDF8F5] border border-[#E8DDD8] rounded-xl px-4 py-2.5 text-[13px] text-[#3D2E32] focus:outline-none focus:border-[#C4A0AE] transition-colors"
            />
            {isNameExist && (
              <p className="text-[11px] text-[#C9847E] mt-1.5 font-medium">
                Tên này đã được xác nhận tham dự.
              </p>
            )}
          </div>

          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setStatus("Tham dự")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border rsvp-btn ${status === "Tham dự" ? "active-yes" : "border-[#E8DDD8] text-[#7A6A6E] hover:bg-[#F0E8E2]"}`}
            >
              <CheckCircle2 size={16} />
              <span className="text-[13px] font-medium">Tham dự</span>
            </button>
            <button
              onClick={() => setStatus("Không tham dự")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border rsvp-btn ${status === "Không tham dự" ? "active-no" : "border-[#E8DDD8] text-[#7A6A6E] hover:bg-[#F0E8E2]"}`}
            >
              <XCircle size={16} />
              <span className="text-[13px] font-medium">Không thể đến</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !status || isSubmitting || isNameExist}
            className="w-full flex items-center justify-center gap-2 bg-[#8B5E6B] text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            <span className="text-[13px] font-medium uppercase tracking-wider">
              {isSubmitting ? "Đang gửi..." : "Gửi xác nhận"}
            </span>
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADMIN PAGE
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
      if (json.status === "success") {
        setData(json.data.reverse()); // Mới nhất lên đầu
      } else {
        throw new Error("Lỗi từ server");
      }
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
    <div className="min-h-screen bg-[#FDF8F5] p-5 font-sans">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} color="#8B5E6B" />
            <h1 className="font-serif text-xl font-bold text-[#3D2E32]">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={fetchData}
            className="p-2 bg-white rounded-full border border-[#E8DDD8] shadow-sm"
          >
            <RefreshCw
              size={16}
              color="#7A6A6E"
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DDD8] shadow-sm mb-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#9E9590] mb-1">
              Tổng phản hồi
            </p>
            <p className="font-serif text-3xl font-semibold text-[#3D2E32]">
              {total}
            </p>
            <div className="flex gap-3 mt-3 text-[12px]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8B5E6B]"></span> Có:{" "}
                {yesCount}
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#9E9590]"></span>{" "}
                Không: {noCount}
              </div>
            </div>
          </div>
          <div
            className="pie-chart"
            style={{ "--yes-pct": `${yesPct}%` }}
          ></div>
        </div>

        {/* List */}
        <h2 className="font-serif text-lg font-semibold text-[#3D2E32] mb-3 flex items-center gap-2">
          <Users size={18} color="#C9847E" /> Danh sách khách mời
        </h2>

        {loading ? (
          <div className="text-center py-10">
            <Loader2
              size={24}
              className="animate-spin mx-auto text-[#C9847E]"
            />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm text-center border border-red-100">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-10 text-[#9E9590] text-sm">
            Chưa có dữ liệu phản hồi.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-[#E8DDD8] shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#3D2E32]">{item.name}</p>
                  <p className="text-[11px] text-[#9E9590] mt-0.5">
                    {new Date(item.timestamp).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[11px] font-medium border ${
                    item.status === "Tham dự"
                      ? "bg-[#F0E8E2] text-[#8B5E6B] border-[#E8DDD8]"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {item.status}
                </div>
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

  if (isAdmin) {
    return <AdminPage />;
  }

  const guestName = useMemo(() => getGuestName(), []);

  const details = [
    { icon: Calendar, label: "Ngày", value: "Thứ Bảy, 26/07/2025" },
    { icon: Clock, label: "Thời gian", value: CONFIG.ceremonyTime },
    {
      icon: MapPin,
      label: "Địa điểm",
      value: CONFIG.venue,
      sub: CONFIG.venueSub,
    },
    {
      icon: BookOpen,
      label: "Ngành",
      value: `${CONFIG.degree} ${CONFIG.major}`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F5]">
      <div className="max-w-sm mx-auto relative">
        {/* ─── HERO ──────────────────────────────────────── */}
        <section className="relative pt-14 pb-8 px-6 text-center overflow-hidden">
          {/* Ornamental SVG corners */}
          <svg
            className="hero-ornament"
            viewBox="0 0 380 100"
            aria-hidden="true"
          >
            <g opacity="0.3" stroke="#8B5E6B" fill="none" strokeWidth="0.7">
              <path d="M16 16 Q28 8 40 16 Q28 24 16 16Z" />
              <path d="M8 44 L8 16 L40 8" />
              <circle cx="8" cy="8" r="2" fill="#8B5E6B" />
              <path d="M20 8 Q26 14 20 20 Q14 14 20 8Z" />
              <path d="M38 24 Q46 18 54 24" />
              <path d="M8 54 Q14 46 8 38" />
            </g>
            <g
              opacity="0.3"
              stroke="#8B5E6B"
              fill="none"
              strokeWidth="0.7"
              transform="scale(-1,1) translate(-380,0)"
            >
              <path d="M16 16 Q28 8 40 16 Q28 24 16 16Z" />
              <path d="M8 44 L8 16 L40 8" />
              <circle cx="8" cy="8" r="2" fill="#8B5E6B" />
              <path d="M20 8 Q26 14 20 20 Q14 14 20 8Z" />
              <path d="M38 24 Q46 18 54 24" />
              <path d="M8 54 Q14 46 8 38" />
            </g>
            <line
              x1="64"
              y1="8"
              x2="316"
              y2="8"
              stroke="#E8DDD8"
              strokeWidth="0.5"
            />
            <path
              d="M190 4 L194 8 L190 12 L186 8Z"
              fill="#C9847E"
              opacity="0.5"
            />
          </svg>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F0E8E2] border border-[#E8DDD8] mb-6"
          >
            <GraduationCap size={13} color="#8B5E6B" strokeWidth={2} />
            <span className="text-[10px] font-semibold text-[#8B5E6B] uppercase tracking-[.14em]">
              Thư mời tốt nghiệp
            </span>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              type: "spring",
              stiffness: 120,
            }}
            className="flex justify-center mb-5"
          >
            <div className="relative">
              <div className="photo-ring w-[136px] h-[136px] rounded-full p-[3px]">
                <div className="photo-ring-inner w-full h-full rounded-full bg-[#F0E8E2] overflow-hidden flex items-center justify-center">
                  <img
                    src={CONFIG.photoUrl}
                    alt={CONFIG.graduateName}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <span style={{ display: "none" }} className="text-5xl">
                    🎓
                  </span>
                </div>
              </div>
              {/* Heart badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#C9847E] border-2 border-[#FDF8F5] flex items-center justify-center">
                <Heart size={12} color="white" fill="white" />
              </div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-script text-[#8B5E6B] mb-1"
            style={{ fontSize: "clamp(2.4rem, 9vw, 3.2rem)", lineHeight: 1.1 }}
          >
            {CONFIG.graduateName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="font-serif text-[13px] text-[#7A6A6E] tracking-wide mb-1"
          >
            {CONFIG.degree} · {CONFIG.major}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="text-[11px] text-[#9E9590] tracking-wide"
          >
            {CONFIG.university}
          </motion.p>
        </section>

        <OrnDivider />

        {/* ─── GUEST CARD ──────────────────────────────── */}
        <section className="px-5 py-4">
          <Reveal>
            <div className="bg-[#F0E8E2] border border-[#E8DDD8] rounded-2xl p-5 text-center">
              <p className="text-[10px] uppercase tracking-[.2em] text-[#9E9590] font-medium mb-1.5">
                Trân trọng kính mời
              </p>
              <p className="font-serif text-[22px] font-semibold text-[#3D2E32] mb-1.5">
                {guestName}
              </p>
              <p className="text-[12px] text-[#7A6A6E] italic">
                đến tham dự buổi lễ tốt nghiệp
              </p>
            </div>
          </Reveal>
        </section>

        {/* ─── COUNTDOWN ───────────────────────────────── */}
        <section className="px-5 py-4">
          <Reveal>
            <SectionTitle icon={Sparkles} title="Sắp đến rồi!" />
          </Reveal>
          <Reveal delay={0.1}>
            <Countdown target={CONFIG.ceremonyDate} />
          </Reveal>
        </section>

        {/* ─── CALENDAR ────────────────────────────────── */}
        <section className="px-5 pb-4">
          <Reveal>
            <div className="bg-white border border-[#E8DDD8] rounded-2xl p-5">
              <MiniCalendar date={CONFIG.ceremonyDate} />
            </div>
          </Reveal>
        </section>

        <OrnDivider dots={3} />

        {/* ─── DETAILS ─────────────────────────────────── */}
        <section className="px-5 py-4">
          <Reveal>
            <SectionTitle icon={PartyPopper} title="Thông tin buổi lễ" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-white border border-[#E8DDD8] rounded-2xl p-4">
              {details.map((d, i) => (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  className={`flex items-start gap-3 py-3 ${i < details.length - 1 ? "border-b border-[#E8DDD8]" : ""}`}
                >
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[#F0E8E2] border border-[#E8DDD8] flex items-center justify-center shrink-0">
                    <d.icon size={15} color="#C9847E" strokeWidth={1.8} />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[9px] uppercase tracking-[.15em] text-[#9E9590] font-medium mb-0.5">
                      {d.label}
                    </p>
                    <p className="text-[13px] font-medium text-[#3D2E32] leading-snug">
                      {d.value}
                    </p>
                    {d.sub && (
                      <p className="text-[11px] text-[#9E9590] mt-0.5">
                        {d.sub}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Map link */}
          <Reveal delay={0.15}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.venueAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center gap-2.5 px-3.5 py-3 bg-white border border-[#E8DDD8] rounded-xl hover:bg-[#F0E8E2] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F0E8E2] border border-[#E8DDD8] flex items-center justify-center shrink-0">
                <MapPin size={14} color="#C9847E" strokeWidth={1.8} />
              </div>
              <span className="flex-1 text-[11px] text-[#7A6A6E] truncate">
                {CONFIG.venueAddress}
              </span>
              <ExternalLink
                size={13}
                color="#9E9590"
                className="shrink-0 group-hover:text-[#C9847E] transition-colors"
              />
            </a>
          </Reveal>
        </section>

        <OrnDivider dots={1} />

        {/* ─── MESSAGE ─────────────────────────────────── */}
        <section className="px-5 py-4">
          <Reveal>
            <SectionTitle icon={Heart} title="Lời nhắn" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-white border border-[#E8DDD8] rounded-2xl p-5 text-center">
              <Quote
                size={20}
                className="mx-auto mb-3 rotate-180"
                color="#C4A0AE"
                strokeWidth={1.5}
              />
              <p className="font-serif italic text-[14px] text-[#3D2E32] leading-[1.8] mb-3">
                Hành trình dài đã kết thúc, và một chương mới sắp bắt đầu. Em
                rất vinh dự được mời{" "}
                <span className="text-[#A66560] font-semibold not-italic">
                  {guestName === CONFIG.defaultGuestName
                    ? "quý anh/chị"
                    : guestName}
                </span>{" "}
                đến tham dự buổi lễ — ngày em đã mong chờ từ lâu.
              </p>
              <p className="text-[12px] text-[#7A6A6E] mb-4">
                Sự hiện diện của{" "}
                {guestName === CONFIG.defaultGuestName ? "quý vị" : guestName}{" "}
                sẽ làm ngày này thêm trọn vẹn ✨
              </p>
              <OrnDivider dots={1} />
              <p className="font-script text-[#C9847E] text-[28px] mt-3">
                {CONFIG.graduateName}
              </p>
            </div>
          </Reveal>
        </section>

        <OrnDivider dots={3} />

        {/* ─── RSVP ────────────────────────────────────── */}
        <RSVPSection guestName={guestName} />

        <OrnDivider dots={3} />

        {/* ─── FOOTER ──────────────────────────────────── */}
        <footer className="py-10 px-6 text-center border-t border-[#E8DDD8] mt-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center gap-1.5 mb-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                >
                  <Heart size={11} color="#C4A0AE" fill="#C4A0AE" />
                </motion.div>
              ))}
            </div>
            <p className="font-script text-[#C9847E] text-[26px] mb-1">
              Cảm ơn & Yêu thương
            </p>
            <p className="text-[10px] text-[#9E9590] tracking-[.15em] uppercase">
              {CONFIG.graduateName} · Khóa 2025
            </p>
            <p className="text-[10px] text-[#9E9590] tracking-[.15em] uppercase mt-0.5">
              {CONFIG.university}
            </p>
            <p className="text-[10px] text-[#E8DDD8] mt-5">Made with ♥</p>
          </motion.div>
        </footer>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 4, duration: 1 }}
          className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none"
        >
          <span className="text-[10px] text-[#9E9590] tracking-widest uppercase bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm border border-[#E8DDD8]">
            Cuộn xuống
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ChevronDown size={15} color="#C9847E" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
