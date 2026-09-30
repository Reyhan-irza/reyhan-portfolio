import { useState } from "react";
import { X, Flame } from "lucide-react";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

const ROASTS = [
  "Achievement untuk sampai ke footer. Programmer memang suka mengubah scroll jadi target kecil.",
  "Roadmap-nya sampai 2035. Semoga build berikutnya tidak butuh selama itu.",
  "Tiga proyek, beberapa catatan, dan satu pertanyaan: mana yang mau dibuka dulu?",
  "Playlist di dalam portfolio. Satu tab, banyak alasan untuk tetap di sini.",
  "Link demo dan GitHub berdampingan. Biar orang bisa cek hasilnya sekaligus caranya.",
  "Timeline belajar, award, dan rencana masa depan. README hidup, rupanya.",
  "Portofolio pribadi, tapi bagian yang paling sering dibuka mungkin tombol Roast Me ini.",
  "Rencana investasi properti sudah dicatat. Sekarang tinggal menutup tab dokumentasi dan mulai bekerja.",
  "Kamu membangun sistem untuk orang lain, lalu menambahkan achievement untuk pengunjung. Detail kecil memang susah dilepas.",
  "Ada catatan proyek di sini. Semoga commit message-nya sama jelasnya.",
];

export default function RoastButton() {
  const [open, setOpen] = useState(false);
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);

  const getNewRoast = () => {
    setLoading(true);
    setTimeout(() => {
      const next = ROASTS[Math.floor(Math.random() * ROASTS.length)];
      setRoast(next);
      setLoading(false);
    }, 600);
  };

  const handleOpen = () => {
    setOpen(true);
    getNewRoast();
    unlockAchievement(ACHIEVEMENTS.ROAST_MASTER);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 left-4 z-[90] flex items-center gap-2 px-4 py-2.5 rounded-full glass border border-orange-500/30 bg-orange-500/10 text-orange-300 text-sm font-medium hover:bg-orange-500/20 hover:border-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-orange-500/10"
        title="Roast This Website!"
      >
        <Flame className="w-4 h-4" />
        <span className="hidden sm:inline">Roast Me!</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="modal-enter glass border border-orange-500/30 rounded-3xl p-7 max-w-md w-full relative shadow-2xl shadow-orange-500/15" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors" onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>

            <div className="text-4xl mb-3">🔥</div>
            <h3 className="text-lg font-bold text-orange-300 mb-1">Roast This Website!</h3>
            <p className="text-white/40 text-xs mb-5">Peringatan: Konten mungkin terlalu akurat 😅</p>

            <div className="glass border border-orange-500/20 rounded-xl p-5 min-h-[80px] flex items-center justify-center mb-5">
              {loading ? (
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              ) : (
                <p className="text-white/80 text-sm leading-relaxed text-center">{roast}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={getNewRoast}
                className="flex-1 py-2.5 rounded-xl border border-orange-500/30 text-orange-300 text-sm font-medium hover:bg-orange-500/15 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" /> Roast Lagi
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/60 text-sm font-medium hover:border-white/20 hover:text-white transition-all duration-200"
              >
                Cukup 😭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
