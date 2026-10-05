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
          className="portfolio-roast-trigger fixed bottom-6 left-4 z-[90] flex items-center gap-2 px-4 py-2.5 rounded-full glass border border-[#a43f2d]/35 bg-[#a43f2d]/10 text-[#a43f2d] text-sm font-medium hover:bg-[#a43f2d]/20 hover:border-[#a43f2d] hover:scale-105 active:scale-95 transition-all duration-300"
        title="Roast This Website!"
        aria-label="Get a light-hearted portfolio roast"
      >
        <Flame className="w-4 h-4" />
        <span>Roast Me!</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
         <div className="modal-enter glass border border-[#a43f2d]/30 rounded-3xl p-7 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
             <button className="absolute top-4 right-4 text-[#6d6a62] hover:text-[#211f1b] transition-colors" onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>

             <div className="mb-3 text-xs font-mono uppercase tracking-[.16em] text-[#a43f2d]">Side note</div>
             <h3 className="text-lg font-bold text-[#a43f2d] mb-1">Roast This Website!</h3>
             <p className="text-[#6d6a62] text-xs mb-5">Peringatan: Konten mungkin terlalu akurat</p>

             <div className="glass border border-[#a43f2d]/20 rounded-xl p-5 min-h-[80px] flex items-center justify-center mb-5">
              {loading ? (
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                   <span key={i} className="w-2 h-2 rounded-full bg-[#a43f2d] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              ) : (
                 <p className="text-[#211f1b] text-sm leading-relaxed text-center">{roast}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={getNewRoast}
                 className="flex-1 py-2.5 rounded-xl border border-[#a43f2d]/30 text-[#a43f2d] text-sm font-medium hover:bg-[#a43f2d]/10 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" /> Roast Lagi
              </button>
              <button
                onClick={() => setOpen(false)}
                 className="flex-1 py-2.5 rounded-xl glass border border-[rgba(33,31,27,.16)] text-[#6d6a62] text-sm font-medium hover:border-[#a43f2d] hover:text-[#211f1b] transition-all duration-200"
              >
                 Cukup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
