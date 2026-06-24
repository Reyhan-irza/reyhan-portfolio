import { useState } from "react";
import { X, Flame } from "lucide-react";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

const ROASTS = [
  "Bro, loading screen-nya lebih dramatis dari film Marvel 😂",
  "Portfolio-nya bagus sih... tapi masa ada musik Avenged Sevenfold? Kamu baik-baik saja? 🤘",
  "Dark theme terus. Takut cahaya ya? Kayak developer pada umumnya 🧛",
  "Typing animation-nya keren! Sayang kontennya yang ngetik, bukan skill-nya 😏",
  "Aurora effect-nya lebih cerah dari masa depannya 🌌",
  "Banyak banget animasi. Apa ini portfolio apa film kartun? 🎬",
  "\"Future Real Estate Investor\" — dan saat ini masih bingung mau beli kos apa kontrakan? 🏠",
  "Floating avatar-nya keren! Sayang yang floating cuma gambarnya, bukan gaji freelance-nya 💸",
  "Glassmorphism dimana-mana. Masa depannya yang blur apa desain-nya? 🔍",
  "Judulnya Full-Stack Developer tapi stack-nya lebih banyak dari cuci piring 🍽️",
  "Komentar section pake localStorage. Kalau clear browser, semua komentar hilang. Professional banget 💪",
  "Easter egg 5 kali klik? Siapa yang mau klik avatar 5 kali coba? Oh iya, kamu 😅",
  "Musik SZA sama A7X. Lagi identity crisis apa emang wide taste? 🎵",
  "Portfolio-nya lebih rapi dari kamar kos-nya, saya yakin 🛏️",
  "Banyak project card. Semua demonya \"#\". Jujur aja, project-nya beneran ada gak? 🤔",
  "Neon purple sama pink. Aesthetic sekali. Teman-temanmu tau kamu desain kayak gini? 🌈",
  "Roadmap sampai 2035. Kamu oke? 10 tahun lebih rencana tapi belum ada yang deploy 🚀",
  "\"100% Client Satisfaction\" — client-nya satu orangnya tadi, yaitu diri sendiri? 😂",
  "Comment section paling sepi yang pernah saya lihat. Bahkan bot pun enggan berkunjung 🤖",
  "Responsive di semua device! Kecuali di hati investor yang kamu tuju 💔",
  "Achievement system untuk scroll. Kamu beneran bikin ini? Serius? 🏆",
  "Loading screen 3 detik. Developer bilang \"optimal\". User bilang \"mending tutup tab\" ⏱️",
  "\"500+ Jam Belajar\" — artinya baru mulai 20 hari yang lalu kalau kerja 24 jam? 🧮",
  "Cursor custom tapi mouse pointer biasa. Inkonsisten kayak commit schedule-nya 📅",
  "10+ teknologi dikuasai. Tapi cuma 6 yang ditampilkan. Sisanya ngumpet dimana? 🙈",
  "Visitor counter pake localStorage. Itu bukan visitor counter, itu self-counter 👁️",
  "Timeline \"Journey\"-nya dramatis banget. Kayak nonton film Aamir Khan versi dev 🎭",
  "Profil foto keren. Fotonya lebih profesional dari CV-nya saya yakin 📸",
  "Scroll animation dimana-mana. Ini portfolio apa rollercoaster? 🎢",
  "\"Building Digital Experiences\" — experience yang dibangun: anxiety pengguna 😅",
  "Semua project pakai tech stack yang sama. Copy-paste architecture! Admitted? 🔄",
  "Marquee tech skills berjalan terus. Kayak semangat awal ngoding sebelum mentok bug 🐛",
  "Navbar ada 6 link. Mobile menu-nya ada animasi. Kamu punya waktu luang banyak ya? ⏰",
  "Equalizer animasi di music card lucu. Tapi Spotify embed-nya bisa di-pause pake... ah, tidak bisa 🎵",
  "Glow effect di mana-mana. Kalau ada yang low vision, mereka bakal silau parah 💡",
  "Easter egg ditemukan! Kamu lebih penasaran dari developer-nya sendiri 🥚",
  "\"Kepuasan Client 100%\" dengan 0 client yang terdaftar di anywhere adalah... matematis? 📊",
  "Portfolio-nya lebih update dari mandi hariannya. Saya asumsikan 🚿",
  "Perjalanan dari 2022-2026 dalam 5 card. Itu 4 tahun, itu bukan journey, itu sprint 🏃",
  "Dark theme portfolio tapi niatnya Real Estate. Properti Haunted House? 👻",
  "Tailwind class-nya lebih panjang dari nama domain yang ingin dibeli 🌐",
  "Font Poppins dan Inter. Classic combo. Seperti nasi dan kecap. Tidak salah, tidak wow 📝",
  "Roast button ini? Berani juga request fitur yang bakal nyerang diri sendiri 🔥",
  "Background aurora-nya indah! Sama indahnya dengan mimpi yang belum terwujud 🌠",
  "Serius mau jadi Real Estate Investor? Mulai dari beli domain dulu bro 💻",
  "\"Future Real Estate Investor\" bisa diterjemahkan: belum punya properti apa-apa 🏗️",
  "Project card-nya keren! Sayang hover-nya lebih smooth dari pitch ke investor 📈",
  "TypeScript dimana-mana. Type safety yes, bug? Also yes. Different type of bug 🦟",
  "Contact form-nya ada 4 platform. WhatsApp, Instagram, TikTok, Gmail. Semuanya belum pernah dibalas tepat waktu 📱",
  "Ini portfolio atau aplikasi Netflix? Banyak banget section-nya 📺",
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
