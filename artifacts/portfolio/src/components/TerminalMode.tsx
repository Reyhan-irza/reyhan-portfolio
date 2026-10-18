import { useState, useRef, useEffect, useCallback } from "react";
import { Terminal, X } from "lucide-react";

const PROMPT = "reyhan@portfolio:~$";

interface HistoryItem {
  type: "input" | "output";
  text: string;
  id: number;
}

const COMMANDS: Record<string, () => string> = {
  help: () =>
    `Perintah yang tersedia:\n\n  whoami    Tentang gue\n  skills    Teknologi di proyek gue\n  projects  Proyek pilihan\n  roadmap   Fokus gue sekarang\n  contact   Hubungi gue\n  music     Musik yang gue dengarkan\n  ls        Lihat bagian halaman\n  pwd       Direktori saat ini\n  date      Tanggal/waktu saat ini\n  clear     Bersihkan terminal\n  exit      Tutup terminal`,

  whoami: () =>
    `┌─────────────────────────────────┐\n│  Reyhan Irza Alvano             │\n│  Pelajar · Pengembang web       │\n│  Lubuk Basung, Indonesia        │\n└─────────────────────────────────┘\n\nGue belajar dengan membangun situs\nweb dan alat digital, lalu terus\nmemperbaikinya sambil belajar.\n\nLihat proyek-proyek gue di seluruh\nportofolio ini.`,

  skills: () =>
    `TEKNOLOGI DI PROYEK GUE\n\n  React\n  TypeScript\n  Tailwind CSS\n  GSAP / ScrollTrigger\n  Lenis\n  Supabase\n\nTeknologi ini gue pakai di berbagai\nproyek sambil terus belajar.`,

  projects: () =>
    `Proyek pilihan:\n\n  [01] TJKT                       Tayang\n  [02] VIREON Library             Tayang\n  [03] Reyhan WhatsApp Portfolio  Tayang\n\n  → Lihat semua: gulir ke #projects`,

  roadmap: () =>
    `Fokus gue sekarang:\n\n  Terus belajar\n  Terus membangun\n  Menjadi full-stack web developer\n\nGue ingin punya pemahaman praktik AI\nyang kuat sambil terus mengembangkan\nkemampuan web.`,

  future: () => COMMANDS.roadmap(),

  contact: () =>
    `Get in touch:\n\n  WhatsApp   wa.me/62881385242876\n  Instagram  @irzalvano_\n  TikTok     @rehanwatsav\n  Email      irzanour@gmail.com`,

  music: () =>
    `Sedang gue dengarkan:\n\n  Little Piece of Heaven  — Avenged Sevenfold\n  Dear God                — Avenged Sevenfold\n  Open Arms               — SZA ft. Travis Scott\n  Snooze                  — SZA\n  Saturn                  — SZA\n\n  → Playlist lengkap: gulir ke #music`,

  ls: () =>
    `hero/  about/  journey/  roadmap/  music/\nprojects/  contact/  comments/`,

  pwd: () => `/home/reyhan/portfolio`,

  date: () => new Date().toLocaleString("en-ID", { dateStyle: "full", timeStyle: "medium" }),

  clear: () => "__clear__",
  exit:  () => "__exit__",
};

const UNKNOWN = (cmd: string): string =>
  `command not found: ${cmd}\nType 'help' to see available commands.`;

export default function TerminalMode() {
  const [open, setOpen]       = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      type: "output",
      text: `Reyhan's Portfolio Terminal  v1.0.0\n────────────────────────────────────\nType 'help' to see available commands.\n`,
      id: 0,
    },
  ]);
  const [input, setInput]       = useState("");
  const [cmdHist, setCmdHist]   = useState<string[]>([]);
  const [histIdx, setHistIdx]   = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef    = useRef(1);

  const scrollBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => { scrollBottom(); }, [history, scrollBottom]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;
    const cmd = raw.toLowerCase();
    const id  = idRef.current++;

    setHistory((h) => [...h, { type: "input", text: raw, id }]);
    setCmdHist((h) => [cmd, ...h]);
    setHistIdx(-1);
    setInput("");

    setTimeout(() => {
      const handler = COMMANDS[cmd] ?? (() => UNKNOWN(cmd));
      const result  = handler();

      if (result === "__clear__") {
        setHistory([{ type: "output", text: "Terminal dibersihkan.\n", id: idRef.current++ }]);
        return;
      }
      if (result === "__exit__") { setOpen(false); return; }

      setHistory((h) => [...h, { type: "output", text: result, id: idRef.current++ }]);
    }, 60);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const ni = Math.min(histIdx + 1, cmdHist.length - 1);
      setHistIdx(ni);
      setInput(cmdHist[ni] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const ni = Math.max(histIdx - 1, -1);
      setHistIdx(ni);
      setInput(ni === -1 ? "" : cmdHist[ni]);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
         className="portfolio-terminal-trigger fixed bottom-20 right-4 z-[90] w-11 h-11 rounded-xl glass border border-[#a43f2d]/25 flex items-center justify-center text-[#a43f2d] hover:border-[#a43f2d] hover:bg-[#a43f2d]/10 transition-all duration-200 hover:scale-105 active:scale-95"
        title="Buka terminal pengembang"
        aria-label="Buka terminal pengembang"
      >
        <Terminal className="w-4.5 h-4.5" />
        <span>Terminal</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-enter w-full sm:max-w-2xl h-[70vh] sm:h-[75vh] flex flex-col rounded-none sm:rounded-2xl overflow-hidden border border-[rgba(33,31,27,.16)]"
            style={{ background: "#f3efe6" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b border-[rgba(33,31,27,.16)] flex-shrink-0"
              style={{ background: "#e8e1d4" }}
            >
              <div className="flex gap-1.5">
                <button
                  onClick={() => setOpen(false)}
                   className="w-3 h-3 rounded-full bg-[#a43f2d] hover:bg-[#843322] transition-colors"
                />
                 <div className="w-3 h-3 rounded-full bg-[#6d6a62]/35" />
                 <div className="w-3 h-3 rounded-full bg-[#6d6a62]/35" />
              </div>
               <span className="flex-1 text-center text-[#6d6a62] text-xs font-mono tracking-wide">
                reyhan@portfolio — bash
              </span>
              <button
                onClick={() => setOpen(false)}
                 className="text-[#6d6a62] hover:text-[#211f1b] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Output */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 font-mono text-[12px] leading-relaxed min-h-0 scrollbar-none">
              {history.map((item) =>
                item.type === "input" ? (
                  <div key={item.id} className="flex gap-2 mt-2">
                     <span className="text-[#a43f2d] select-none flex-shrink-0">{PROMPT}</span>
                     <span className="text-[#211f1b]">{item.text}</span>
                  </div>
                ) : (
                  <pre
                    key={item.id}
                     className="text-[#6d6a62] whitespace-pre-wrap font-mono text-[12px] leading-relaxed ml-0"
                  >
                    {item.text}
                  </pre>
                )
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={submit}
               className="flex items-center gap-2 px-4 py-3 border-t border-[rgba(33,31,27,.16)] flex-shrink-0"
               style={{ background: "#e8e1d4" }}
            >
               <span className="text-[#a43f2d] font-mono text-[12px] select-none flex-shrink-0">
                {PROMPT}
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                 className="flex-1 bg-transparent text-[#211f1b] font-mono text-[12px] outline-none caret-[#a43f2d] placeholder-[#6d6a62]"
                placeholder="ketik perintah…"
                autoComplete="off"
                spellCheck={false}
                aria-label="Input terminal"
              />
               <span className="w-px h-3.5 bg-[#a43f2d] animate-pulse" />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
