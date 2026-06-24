import { useState, useEffect, useRef } from "react";
import {
  MessageSquare, Send, User, Search, SlidersHorizontal,
  ChevronLeft, ChevronRight, BadgeCheck, Loader2,
} from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";
import { supabase } from "@/lib/supabase";

// Table: "comments"  — fields: id, username, message, pinned, created_at
// Table: "replies"   — fields: id, comment_id, reply_text, admin_name, created_at
interface Comment { id: number; username: string; message: string; pinned: boolean; created_at: string; }
interface Reply   { id: number; comment_id: number; reply_text: string; admin_name: string; created_at: string; }

const PAGE_SIZE = 10;
const RATE_KEY  = "comment_last_sent";
const RATE_MS   = 60_000;

function sanitize(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").trim();
}

function CommentText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 200;
  return (
    <div>
      <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap break-words">
        {isLong && !expanded ? text.slice(0, 200) + "..." : text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-violet-400 text-xs mt-1.5 hover:text-violet-300 transition-colors"
        >
          {expanded ? "Sembunyikan ▲" : "Baca Selengkapnya ▼"}
        </button>
      )}
    </div>
  );
}

function formatTime(ts: string): string {
  // Supabase returns timestamps without timezone marker — always force UTC
  // Handles both "2024-01-15 10:30:00" and "2024-01-15T10:30:00" (no Z/+offset)
  const hasZone = ts.endsWith("Z") || ts.includes("+");
  const normalized = hasZone ? ts : ts.replace(" ", "T") + "Z";
  const date = new Date(normalized);
  const diff = Date.now() - date.getTime();
  if (diff < 60_000)     return "Baru saja";
  if (diff < 3_600_000)  return `${Math.floor(diff / 60_000)} menit lalu`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} jam lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function CommentsSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const formRef   = useScrollAnim({ threshold: 0.15, delay: 100 });

  const [comments,    setComments]    = useState<Comment[]>([]);
  const [replies,     setReplies]     = useState<Reply[]>([]);
  const [name,        setName]        = useState("");
  const [message,     setMessage]     = useState("");
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError,   setDataError]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState<"newest" | "oldest">("newest");
  const [page,   setPage]   = useState(1);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setDataLoading(true);
      setDataError(false);
      const [cmtRes, repRes] = await Promise.all([
        supabase.from("comments").select("*").order("created_at", { ascending: false }),
        supabase.from("replies").select("*").order("created_at", { ascending: true }),
      ]);
      if (cmtRes.error || repRes.error) {
        console.error("Supabase load error:", cmtRes.error || repRes.error);
        setDataError(true);
      }
      if (cmtRes.data) setComments(cmtRes.data);
      if (repRes.data) setReplies(repRes.data);
      setDataLoading(false);
    })();
  }, []);

  const filtered = comments
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return c.username.toLowerCase().includes(q) || c.message.toLowerCase().includes(q);
    })
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const canSubmit = () =>
    Date.now() - parseInt(localStorage.getItem(RATE_KEY) || "0") > RATE_MS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanName = sanitize(name);
    const cleanMsg  = sanitize(message);

    if (!cleanName)            { setError("Nama tidak boleh kosong."); return; }
    if (!cleanMsg)             { setError("Pesan tidak boleh kosong."); return; }
    if (cleanName.length > 50) { setError("Nama maksimal 50 karakter."); return; }
    if (cleanMsg.length > 500) { setError("Pesan maksimal 500 karakter."); return; }
    if (!canSubmit()) {
      const remaining = Math.ceil((RATE_MS - (Date.now() - parseInt(localStorage.getItem(RATE_KEY) || "0"))) / 1000);
      setError(`Tunggu ${remaining} detik lagi sebelum kirim komentar baru.`);
      return;
    }

    setSubmitting(true);
    const { data, error: sbErr } = await supabase
      .from("comments")
      .insert([{ username: cleanName, message: cleanMsg }])
      .select();

    if (sbErr) {
      console.error("Insert error:", sbErr);
      setError(
        sbErr.code === "42501"
          ? "Komentar tidak dapat dikirim (akses ditolak). Cek RLS Supabase."
          : "Gagal kirim komentar. Silakan coba lagi."
      );
      setSubmitting(false);
      return;
    }

    if (data && data[0]) {
      localStorage.setItem(RATE_KEY, Date.now().toString());
      setComments((prev) => [data[0], ...prev]);
      setName(""); setMessage(""); setError("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setPage(1);
      setTimeout(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150);
    }
    setSubmitting(false);
  };

  const getReplies = (commentId: number) => replies.filter((r) => r.comment_id === commentId);

  return (
    <section id="comments" className="relative py-24 px-6 pb-32">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div ref={headerRef} className="fade-up text-center mb-14">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Yoo wassup y&apos;all
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Absen-absen or <span className="gradient-text">Something</span>
          </h2>
          <div className="rgb-divider w-24 mx-auto mb-5" />
          <p className="text-white/50 max-w-md mx-auto text-base">Pesan moral</p>
        </div>

        {/* FORM */}
        <div ref={formRef} className="fade-up glass neon-border rounded-2xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wide">Nama</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/40 transition-all"
                  placeholder="Nama kamu..."
                  maxLength={50}
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wide">Pesan</label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30" />
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); if (error) setError(""); }}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/40 transition-all resize-none"
                  placeholder="Tulis pesan kamu..."
                  maxLength={500}
                  disabled={submitting}
                />
              </div>
              <p className="text-right text-white/20 text-[10px] mt-1">{message.length}/500</p>
            </div>

            {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠ {error}</p>}
            {success && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">✓ Komentar berhasil dikirim!</p>}

            <button
              type="submit"
              disabled={submitting}
              className="btn-neon w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? "Mengirim..." : "Kirim Komentar"}
            </button>
          </form>
        </div>

        {/* SEARCH + FILTER */}
        {comments.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Cari nama atau isi komentar..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/40 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 glass border border-white/10 rounded-xl px-3.5 py-2.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as "newest" | "oldest"); setPage(1); }}
                className="bg-transparent text-white/70 text-sm focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#0d1117]">Terbaru</option>
                <option value="oldest" className="bg-[#0d1117]">Terlama</option>
              </select>
            </div>
          </div>
        )}

        {/* LIST */}
        <div ref={listRef} className="flex flex-col gap-3">
          {dataLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
            </div>
          ) : dataError ? (
            <div className="text-center py-12 text-red-400/70 text-sm">
              ⚠ Gagal memuat komentar. Periksa koneksi dan coba refresh.
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">
              {search ? "Tidak ada komentar yang cocok." : "Belum ada komentar. Jadilah yang pertama!"}
            </div>
          ) : paginated.map((c) => {
            const cReplies = getReplies(c.id);
            return (
              <div key={c.id} className={`glass border rounded-xl p-4 hover:border-white/12 transition-colors ${c.pinned ? "border-violet-500/30" : "border-white/8"}`}>
                {c.pinned && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full border border-violet-500/20 uppercase font-bold tracking-wider">📌 Pinned</span>
                  </div>
                )}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/50 to-pink-500/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm uppercase">{c.username.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 items-center mb-1.5 flex-wrap">
                      <span className="text-white font-semibold text-sm">{c.username}</span>
                      <span className="text-white/30 text-xs">{formatTime(c.created_at)}</span>
                    </div>
                    <CommentText text={c.message} />
                  </div>
                </div>

                {/* Admin replies */}
                {cReplies.length > 0 && (
                  <div className="mt-3 ml-12 space-y-2">
                    {cReplies.map((r) => (
                      <div key={r.id} className="flex gap-2.5 bg-violet-500/5 border border-violet-500/15 rounded-xl p-3">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-violet-500/40 flex-shrink-0">
                          <img src="/profile.jpg" alt="Developer" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-violet-300 font-semibold text-xs">{r.admin_name || "Developer"}</span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[9px] font-bold text-violet-300 uppercase tracking-wider">
                              <BadgeCheck className="w-2.5 h-2.5" /> DEVELOPER
                            </span>
                            <span className="text-white/25 text-[10px]">{formatTime(r.created_at)}</span>
                          </div>
                          <p className="text-white/65 text-sm leading-relaxed">{r.reply_text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-violet-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white/40 text-sm tabular-nums">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-violet-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {comments.length > 0 && (
          <p className="text-center text-white/20 text-xs mt-4">
            {filtered.length} komentar{search && ` ditemukan dari ${comments.length} total`}
          </p>
        )}

      </div>
    </section>
  );
}
