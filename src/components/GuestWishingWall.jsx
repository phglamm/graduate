import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { MessageSquareHeart, Send, Heart, Sparkles, User, Tag } from "lucide-react";
import SpotlightCard from "./reactbits/SpotlightCard";

const INITIAL_WISHES = [
  {
    id: 1,
    name: "Lan Anh",
    role: "Bạn thân",
    content: "Chúc mừng công chúa Mỹ Vy tốt nghiệp! Chúc bạn sự nghiệp thăng hoa, luôn rạng rỡ và hạnh phúc nhé 🎓💖",
    likes: 12,
    time: "Vừa xong",
    color: "#fff0f6",
  },
  {
    id: 2,
    name: "Hoàng Minh",
    role: "Đồng nghiệp",
    content: "Chúc mừng Tân Cử nhân Logistics xuất sắc! Tương lai làm sếp lớn nhớ chiếu cố nhé!",
    likes: 8,
    time: "10 phút trước",
    color: "#fdf4ff",
  },
  {
    id: 3,
    name: "Phương Linh",
    role: "Gia đình",
    content: "Tự hào về em gái nhỏ của chị nhiều lắm! Chúc em luôn tự tin và toả sáng trên mọi chặng đường!",
    likes: 19,
    time: "Hôm nay",
    color: "#fff7ed",
  },
];

export default function GuestWishingWall({ defaultName = "" }) {
  const [wishes, setWishes] = useState(() => {
    const saved = localStorage.getItem("myvy_grad_wishes");
    return saved ? JSON.parse(saved) : INITIAL_WISHES;
  });

  const [author, setAuthor] = useState(defaultName || "");
  const [role, setRole] = useState("Bạn bè");
  const [message, setMessage] = useState("");
  const [likedMap, setLikedMap] = useState({});

  const handleLike = (id) => {
    if (likedMap[id]) return;
    setLikedMap((prev) => ({ ...prev, [id]: true }));
    const updated = wishes.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w));
    setWishes(updated);
    localStorage.setItem("myvy_grad_wishes", JSON.stringify(updated));

    confetti({
      particleCount: 18,
      spread: 45,
      origin: { y: 0.75 },
      colors: ["#ff3b81", "#ffd166", "#c084fc"],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    const newWish = {
      id: Date.now(),
      name: author.trim(),
      role,
      content: message.trim(),
      likes: 1,
      time: "Vừa xong",
      color: ["#fff0f6", "#fdf4ff", "#fff7ed"][Math.floor(Math.random() * 3)],
    };

    const nextWishes = [newWish, ...wishes];
    setWishes(nextWishes);
    localStorage.setItem("myvy_grad_wishes", JSON.stringify(nextWishes));
    setMessage("");

    confetti({
      particleCount: 65,
      spread: 65,
      origin: { y: 0.7 },
      colors: ["#ff3b81", "#ff65a3", "#ffd166", "#ffffff"],
    });
  };

  return (
    <section className="section">
      <div className="mb-4">
        <div className="flex items-center gap-1.5">
          <MessageSquareHeart size={14} color="#ff3b81" />
          <h2 className="section-heading tracking-wider uppercase text-sm font-extrabold text-[#300b1d]">
            GUESTBOOK & WISHES
          </h2>
        </div>
      </div>

      {/* Form Gửi Lời Chúc */}
      <SpotlightCard className="card p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            <div>
              <label className="input-label">Tên của bạn</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nhập tên..."
                className="modern-input !py-2 !text-xs"
                required
              />
            </div>
            <div>
              <label className="input-label">Mối quan hệ</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="modern-input !py-2 !text-xs bg-white cursor-pointer font-semibold text-[#803358]"
              >
                <option value="Bạn thân">Bạn thân</option>
                <option value="Bạn học UEF">Bạn học UEF</option>
                <option value="Gia đình">Gia đình</option>
                <option value="Đồng nghiệp">Đồng nghiệp</option>
                <option value="Người thương">Người thương</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="input-label">Lời chúc gửi tới Mỹ Vy</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Gửi ngàn lời chúc tốt đẹp nhất..."
              className="modern-input !py-2 !text-xs resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!author.trim() || !message.trim()}
            className="submit-btn !py-2.5 !text-xs"
          >
            <Send size={14} strokeWidth={2.4} />
            <span>Gửi lời chúc ngay</span>
          </button>
        </form>
      </SpotlightCard>

      {/* Danh sách lời chúc */}
      <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
        <AnimatePresence>
          {wishes.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3.5 rounded-[16px] border border-[#ff65a3]/30 shadow-sm relative transition-all hover:scale-[1.01]"
              style={{ backgroundColor: w.color }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#ff3b81]/30 flex items-center justify-center text-[#ff3b81]">
                    <User size={12} strokeWidth={2.4} />
                  </div>
                  <span className="font-bold text-xs text-[#300b1d]">{w.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff3b81]/15 text-[#ff3b81] font-semibold">
                    {w.role}
                  </span>
                </div>
                <span className="text-[10px] text-[#b36b8e] font-medium">{w.time}</span>
              </div>

              <p className="text-xs text-[#4a1830] leading-relaxed font-medium pl-1 mb-2">
                {w.content}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => handleLike(w.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition-all ${
                    likedMap[w.id]
                      ? "bg-[#ff3b81] text-white border-[#ff3b81]"
                      : "bg-white/80 text-[#ff3b81] border-[#ff3b81]/30 hover:bg-white"
                  }`}
                >
                  <Heart
                    size={11}
                    fill={likedMap[w.id] ? "#ffffff" : "#ff3b81"}
                    color={likedMap[w.id] ? "#ffffff" : "#ff3b81"}
                    strokeWidth={0}
                  />
                  <span>{w.likes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
