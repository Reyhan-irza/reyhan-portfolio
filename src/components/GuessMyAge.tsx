import { useState } from "react";
import { X, RefreshCw, HelpCircle } from "lucide-react";
import { unlockAchievement, ACHIEVEMENTS } from "../lib/achievement";

const DEVELOPER_AGE = 20;
const MAX_ATTEMPTS  = 3;

export default function GuessMyAge() {
  const [open, setOpen]         = useState(false);
  const [guess, setGuess]       = useState("");
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus]     = useState<"playing" | "won" | "lost">("playing");

  const reset = () => {
    setGuess(""); setAttempts(MAX_ATTEMPTS);
    setFeedback(""); setStatus("playing");
  };

  const handleGuess = () => {
    const g = parseInt(guess);
    if (isNaN(g) || g < 1 || g > 99) {
      setFeedback("Masukkan angka yang valid.");
      return;
    }

    const remaining = attempts - 1;
    setAttempts(remaining);

    if (g === DEVELOPER_AGE) {
      setStatus("won");
      setFeedback(`Benar sekali! Developer ini ${DEVELOPER_AGE} tahun. Kamu jenius!`);
      unlockAchievement(ACHIEVEMENTS.AGE_GUESSER);
    } else if (remaining === 0) {
      setStatus("lost");
      setFeedback(`Salah! Umurnya ${DEVELOPER_AGE} tahun. Semangat!`);
    } else {
      const diff = Math.abs(g - DEVELOPER_AGE);
      let hint = g < DEVELOPER_AGE
        ? (diff <= 2 ? "Hampir! Sedikit lebih tua..." : diff <= 5 ? "Lebih tua lagi..." : "Terlalu muda!")
        : (diff <= 2 ? "Hampir! Sedikit lebih muda..." : diff <= 5 ? "Lebih muda lagi..." : "Terlalu tua!");
      setFeedback(`${hint} — ${remaining} kesempatan lagi.`);
    }
    setGuess("");
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); reset(); }}
        className="flex items-center gap-1.5 text-xs text-white/35 hover:text-violet-300 transition-colors duration-200"
        aria-label="Guess My Age mini game"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        Guess My Age
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-enter glass border border-violet-500/20 rounded-2xl p-6 max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-sm">Guess My Age</h3>
                <p className="text-white/35 text-xs mt-0.5">Mini game developer</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/25 hover:text-white/60 transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-white/45 text-xs mb-5 leading-relaxed">
              Berapa umur developer ini? Tebak dengan benar dalam {MAX_ATTEMPTS} kesempatan!
            </p>

            {/* Attempts bar */}
            <div className="flex gap-1.5 mb-4">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i < attempts ? "bg-violet-500/50" : "bg-white/8"
                  }`}
                />
              ))}
            </div>

            {/* Input */}
            {status === "playing" && (
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                  className="flex-1 px-3 py-2 rounded-xl glass border border-white/10 bg-white/4 text-white text-sm outline-none focus:border-violet-500/40 transition-colors placeholder-white/20"
                  placeholder="Tebak umur…"
                  min={1}
                  max={99}
                  autoFocus
                />
                <button
                  onClick={handleGuess}
                  className="btn-neon relative z-10 px-4 py-2 rounded-xl text-xs font-medium"
                >
                  <span className="relative z-10">Tebak</span>
                </button>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <p className={`text-xs font-medium mb-3 leading-relaxed ${
                status === "won"  ? "text-green-400" :
                status === "lost" ? "text-red-400/80" : "text-violet-300"
              }`}>
                {feedback}
              </p>
            )}

            {/* Reset */}
            {status !== "playing" && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors mt-1"
              >
                <RefreshCw className="w-3 h-3" />
                Main lagi
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
