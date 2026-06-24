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
    `Available commands:\n\n  whoami    Developer profile\n  skills    Tech stack & ratings\n  projects  Recent projects\n  roadmap   Future goals\n  contact   Get in touch\n  music     Currently listening\n  ls        List sections\n  pwd       Current directory\n  date      Current date/time\n  clear     Clear terminal\n  exit      Close terminal`,

  whoami: () =>
    `┌─────────────────────────────────┐\n│  Reyhan Irza Alvano              │\n│  Full-Stack Developer            │\n│  Indonesia                       │\n└─────────────────────────────────┘\n\nA developer who builds premium digital\nexperiences and dreams of real estate.\n\nPassionate about clean code, beautiful\nUIs, and financial independence.`,

  skills: () =>
    `FRONTEND\n  React         ████████████  Expert\n  TypeScript    ██████████░░  Advanced\n  Next.js       █████████░░░  Advanced\n  TailwindCSS   ████████████  Expert\n\nBACKEND\n  Node.js       █████████░░░  Advanced\n  Express       █████████░░░  Advanced\n  PostgreSQL    ████████░░░░  Proficient\n\nTOOLS\n  Git           ████████████  Expert\n  Docker        ██████░░░░░░  Intermediate\n  Figma         ████████░░░░  Proficient`,

  projects: () =>
    `Projects completed: 15+\n\n  [01] E-Commerce Platform       Live\n  [02] Task Management App       Live\n  [03] AI Chat Interface         Live\n  [04] Portfolio Generator       In Progress\n  [05] Social Media Dashboard    Completed\n\n  → See full list: scroll to #projects`,

  roadmap: () =>
    `Future Roadmap:\n\n  [✓] 2026 — Portfolio Website\n  [○] 2027 — Freelance Projects\n  [○] 2028 — Launch Startup\n  [○] 2030 — Real Estate Investment\n  [○] 2035 — Financial Freedom`,

  future: () => COMMANDS.roadmap(),

  contact: () =>
    `Get in touch:\n\n  WhatsApp   wa.me/62881385242876\n  Instagram  @irzalvano_\n  TikTok     @rehanwatsav\n  Email      irzanour@gmail.com`,

  music: () =>
    `Currently listening:\n\n  Little Piece of Heaven  — Avenged Sevenfold\n  Dear God                — Avenged Sevenfold\n  Open Arms               — SZA ft. Travis Scott\n  Snooze                  — SZA\n  Saturn                  — SZA\n\n  → Full playlist: scroll to #music`,

  ls: () =>
    `hero/  about/  journey/  roadmap/  music/\nprojects/  contact/  comments/`,

  pwd: () => `/home/reyhan/portfolio`,

  date: () => new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" }),

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
      text: `Reyhan's Developer Terminal  v1.0.0\n────────────────────────────────────\nType 'help' to see available commands.\n`,
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
        setHistory([{ type: "output", text: "Terminal cleared.\n", id: idRef.current++ }]);
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
        className="fixed bottom-20 right-4 z-[90] w-11 h-11 rounded-xl glass border border-violet-500/25 flex items-center justify-center text-violet-400/70 hover:text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
        title="Open Developer Terminal  [ > _ ]"
        aria-label="Open developer terminal"
      >
        <Terminal className="w-4.5 h-4.5" />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-enter w-full sm:max-w-2xl h-[70vh] sm:h-[75vh] flex flex-col rounded-none sm:rounded-2xl overflow-hidden border border-white/8 shadow-2xl"
            style={{ background: "hsl(220 18% 5%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 flex-shrink-0"
              style={{ background: "hsl(220 18% 7%)" }}
            >
              <div className="flex gap-1.5">
                <button
                  onClick={() => setOpen(false)}
                  className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/30" />
              </div>
              <span className="flex-1 text-center text-white/25 text-xs font-mono tracking-wide">
                reyhan@portfolio — bash
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-white/25 hover:text-white/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Output */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 font-mono text-[12px] leading-relaxed min-h-0 scrollbar-none">
              {history.map((item) =>
                item.type === "input" ? (
                  <div key={item.id} className="flex gap-2 mt-2">
                    <span className="text-violet-400 select-none flex-shrink-0">{PROMPT}</span>
                    <span className="text-white/90">{item.text}</span>
                  </div>
                ) : (
                  <pre
                    key={item.id}
                    className="text-white/55 whitespace-pre-wrap font-mono text-[12px] leading-relaxed ml-0"
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
              className="flex items-center gap-2 px-4 py-3 border-t border-white/8 flex-shrink-0"
              style={{ background: "hsl(220 18% 7%)" }}
            >
              <span className="text-violet-400 font-mono text-[12px] select-none flex-shrink-0">
                {PROMPT}
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                className="flex-1 bg-transparent text-white/90 font-mono text-[12px] outline-none caret-violet-400 placeholder-white/20"
                placeholder="type a command…"
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
              <span className="w-px h-3.5 bg-violet-400 animate-pulse" />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
