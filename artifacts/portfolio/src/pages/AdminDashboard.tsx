import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, MessageSquare, CornerDownRight, Newspaper,
  BarChart2, Settings, LogOut, Send, Trash2, Check, X,
  Plus, Edit3, Bell, BadgeCheck, Loader2, RefreshCw,
  ChevronRight, Menu, AlertCircle, Pin, Download,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { supabase } from "@/lib/supabase";
import { isAdminLoggedIn, logoutAdmin } from "@/lib/adminAuth";

/* ── Notification sound (AudioContext, no external file) ── */
function playNotifSound() {
  try {
    const ctx = new AudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
    ctx.close();
  } catch { /* ignore in restricted contexts */ }
}

interface Comment { id: number; username: string; message: string; pinned: boolean; created_at: string; }
interface Reply   { id: number; comment_id: number; reply_text: string; admin_name: string; created_at: string; }
interface News    { id: number; title: string; category: string; thumbnail: string; content: string; published: boolean; created_at: string; }
interface Visitor { id: number; created_at: string; }

type TabId = "dashboard" | "comments" | "replies" | "news" | "stats" | "settings";

const TABS: { id: TabId; icon: React.ElementType; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard"  },
  { id: "comments",  icon: MessageSquare,   label: "Komentar"   },
  { id: "replies",   icon: CornerDownRight, label: "Balasan"    },
  { id: "news",      icon: Newspaper,       label: "Berita"     },
  { id: "stats",     icon: BarChart2,       label: "Statistik"  },
  { id: "settings",  icon: Settings,        label: "Pengaturan" },
];

function fmt(ts: string) {
  // Supabase returns timestamps without timezone marker — always force UTC
  const hasZone = ts.endsWith("Z") || ts.includes("+");
  const normalized = hasZone ? ts : ts.replace(" ", "T") + "Z";
  return new Date(normalized).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl p-5 border border-white/7 hover:border-violet-500/15 transition-colors" style={{ background: "#111827" }}>
      <p className="text-white/35 text-[10px] uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold gradient-text tabular-nums">{value}</p>
      {sub && <p className="text-white/22 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border whitespace-nowrap
      ${type === "success"
        ? "bg-green-500/15 border-green-500/30 text-green-300"
        : "bg-red-500/15 border-red-500/30 text-red-300"}`}>
      {type === "success" ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

const EMPTY_NEWS = { title: "", thumbnail: "", category: "General", content: "", published: false };

/* ── CSV helpers ─────────────────────────────────────── */
function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape  = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}

function downloadCSV(filename: string, data: Record<string, unknown>[]) {
  const blob = new Blob([toCSV(data)], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  useEffect(() => { if (!isAdminLoggedIn()) navigate("/admin"); }, [navigate]);

  const [tab,        setTab]        = useState<TabId>("dashboard");
  const [comments,   setComments]   = useState<Comment[]>([]);
  const [replies,    setReplies]    = useState<Reply[]>([]);
  const [news,       setNews]       = useState<News[]>([]);
  const [visitors,   setVisitors]   = useState<Visitor[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [hasNew,     setHasNew]     = useState(false);
  const [sideOpen,   setSideOpen]   = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const [replyingTo,  setReplyingTo]  = useState<number | null>(null);
  const [replyText,   setReplyText]   = useState("");
  const [replySending,setReplySending]= useState(false);
  const [replyError,  setReplyError]  = useState("");

  const [newsForm,       setNewsForm]       = useState(EMPTY_NEWS);
  const [newsEditing,    setNewsEditing]    = useState<number | null>(null);
  const [showNewsForm,   setShowNewsForm]   = useState(false);
  const [newsSubmitting, setNewsSubmitting] = useState(false);
  const [newsError,      setNewsError]      = useState("");

  const knownCount = useRef(0);

  const fetchData = useCallback(async () => {
    setFetchError("");
    const [cmtRes, repRes, newsRes, visRes] = await Promise.all([
      supabase.from("comments").select("*").order("created_at", { ascending: false }),
      supabase.from("replies").select("*").order("created_at", { ascending: true }),
      supabase.from("news").select("*").order("created_at", { ascending: false }),
      supabase.from("visitors").select("id, created_at").order("created_at", { ascending: false }).limit(1000),
    ]);
    const anyError = cmtRes.error || repRes.error || newsRes.error;
    if (anyError) {
      const e = cmtRes.error || repRes.error || newsRes.error!;
      setFetchError(e.code === "42501" ? "Akses ditolak. Cek RLS Supabase." : `Gagal memuat data: ${e.message}`);
    }
    if (cmtRes.data) {
      if (knownCount.current > 0 && cmtRes.data.length > knownCount.current) setHasNew(true);
      knownCount.current = cmtRes.data.length;
      setComments(cmtRes.data);
    }
    if (repRes.data)  setReplies(repRes.data);
    if (newsRes.data) setNews(newsRes.data);
    if (visRes.data)  setVisitors(visRes.data);
    setLoading(false);
  }, []);

  /* Initial fetch */
  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Request browser notification permission once ── */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /* ── Supabase Realtime: comments + replies ── */
  useEffect(() => {
    const channel = supabase
      .channel("admin-realtime-v2")
      /* --- comments --- */
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments" }, (payload) => {
        const newComment = payload.new as Comment;
        setComments((prev) => {
          if (prev.some((c) => c.id === newComment.id)) return prev;
          setHasNew(true);
          knownCount.current = prev.length + 1;
          /* Browser notification */
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`💬 Komentar baru dari ${newComment.username}`, {
              body: newComment.message.slice(0, 120),
              icon: "/profile.jpg",
              tag: `comment-${newComment.id}`,
            });
          }
          playNotifSound();
          return [newComment, ...prev];
        });
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "comments" }, (payload) => {
        setComments((prev) => prev.filter((c) => c.id !== (payload.old as { id: number }).id));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "comments" }, (payload) => {
        const updated = payload.new as Comment;
        setComments((prev) => prev.map((c) => c.id === updated.id ? updated : c));
      })
      /* --- replies --- */
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "replies" }, (payload) => {
        const newReply = payload.new as Reply;
        setReplies((prev) => prev.some((r) => r.id === newReply.id) ? prev : [...prev, newReply]);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "replies" }, (payload) => {
        setReplies((prev) => prev.filter((r) => r.id !== (payload.old as { id: number }).id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const logout = () => { logoutAdmin(); navigate("/admin"); };

  const deleteComment = async (id: number) => {
    if (!confirm("Hapus komentar ini?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) { showToast("Gagal menghapus komentar.", "error"); return; }
    setComments((p) => p.filter((c) => c.id !== id));
    setReplies((p) => p.filter((r) => r.comment_id !== id));
    showToast("Komentar dihapus.");
  };

  const togglePin = async (id: number, cur: boolean) => {
    const { error } = await supabase.from("comments").update({ pinned: !cur }).eq("id", id);
    if (error) { showToast("Gagal pin komentar.", "error"); return; }
    setComments((p) => p.map((c) => c.id === id ? { ...c, pinned: !cur } : c));
    showToast(cur ? "Komentar di-unpin." : "Komentar di-pin.");
  };

  const sendReply = async (cId: number) => {
    if (!replyText.trim()) return;
    setReplyError(""); setReplySending(true);
    const { data, error } = await supabase
      .from("replies")
      .insert([{ comment_id: cId, reply_text: replyText.trim(), admin_name: (() => { try { return JSON.parse(sessionStorage.getItem("reyhan_admin_v1") || "{}").username || "Developer"; } catch { return "Developer"; } })() }])
      .select();
    if (error) {
      setReplyError("Gagal mengirim balasan.");
      showToast("Gagal kirim balasan.", "error");
    } else if (data) {
      setReplies((p) => [...p, data[0]]);
      setReplyText(""); setReplyingTo(null);
      showToast("Balasan terkirim!");
    }
    setReplySending(false);
  };

  const deleteReply = async (id: number) => {
    const { error } = await supabase.from("replies").delete().eq("id", id);
    if (error) { showToast("Gagal menghapus balasan.", "error"); return; }
    setReplies((p) => p.filter((r) => r.id !== id));
    showToast("Balasan dihapus.");
  };

  const submitNews = async (e: React.FormEvent) => {
    e.preventDefault(); setNewsError("");
    if (!newsForm.title.trim())   { setNewsError("Judul tidak boleh kosong."); return; }
    if (!newsForm.content.trim()) { setNewsError("Isi berita tidak boleh kosong."); return; }
    setNewsSubmitting(true);
    if (newsEditing !== null) {
      const { data, error } = await supabase.from("news").update(newsForm).eq("id", newsEditing).select();
      if (error) { setNewsError("Gagal update: " + error.message); setNewsSubmitting(false); return; }
      if (data) setNews((p) => p.map((n) => n.id === newsEditing ? data[0] : n));
      setNewsEditing(null); showToast("Berita diupdate!");
    } else {
      const { data, error } = await supabase.from("news").insert([newsForm]).select();
      if (error) { setNewsError("Gagal tambah: " + error.message); setNewsSubmitting(false); return; }
      if (data) setNews((p) => [data[0], ...p]);
      showToast("Berita ditambahkan!");
    }
    setNewsForm(EMPTY_NEWS); setShowNewsForm(false); setNewsSubmitting(false);
  };

  const editNews = (n: News) => {
    setNewsForm({ title: n.title, thumbnail: n.thumbnail, category: n.category, content: n.content, published: n.published });
    setNewsEditing(n.id); setShowNewsForm(true); setNewsError("");
  };

  const deleteNews = async (id: number) => {
    if (!confirm("Hapus berita ini?")) return;
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) { showToast("Gagal menghapus berita.", "error"); return; }
    setNews((p) => p.filter((n) => n.id !== id));
    showToast("Berita dihapus.");
  };

  const togglePublish = async (id: number, cur: boolean) => {
    const { error } = await supabase.from("news").update({ published: !cur }).eq("id", id);
    if (error) { showToast("Gagal ubah status.", "error"); return; }
    setNews((p) => p.map((n) => n.id === id ? { ...n, published: !cur } : n));
  };

  /* Normalize Supabase timestamp to UTC for correct WIB date comparisons */
  const toUtcDate = (ts: string) => {
    const hasZone = ts.endsWith("Z") || ts.includes("+");
    const n = hasZone ? ts : ts.replace(" ", "T") + "Z";
    return new Date(n);
  };

  /* Chart data */
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dStr = d.toDateString();
    return {
      label:    d.toLocaleDateString("id-ID", { weekday: "short" }),
      Komentar: comments.filter((c) => toUtcDate(c.created_at).toDateString() === dStr).length,
      Visitor:  visitors.filter((v) => toUtcDate(v.created_at).toDateString() === dStr).length,
    };
  });

  const totalVisitor = visitors.length;
  const todayStr     = new Date().toDateString();
  const todayVisitor = visitors.filter((v) => toUtcDate(v.created_at).toDateString() === todayStr).length;
  const getReplies   = (id: number) => replies.filter((r) => r.comment_id === id);

  const SIDEBAR_BG = { background: "rgba(5,8,22,0.97)", backdropFilter: "blur(20px)" };
  const HEADER_BG  = { background: "rgba(5,8,22,0.92)", backdropFilter: "blur(16px)" };

  return (
    <div className="min-h-screen flex" style={{ background: "#050816" }}>

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 flex flex-col border-r border-white/10 transition-transform duration-300
          md:relative md:translate-x-0 ${sideOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={SIDEBAR_BG}
      >
        <div className="p-5 border-b border-white/10 flex flex-col gap-2">
          <img src="/logo.png" alt="Reyhan" className="h-10 w-auto object-contain self-start" style={{ imageRendering: "crisp-edges" }} />
          <p className="text-white/30 text-xs">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button key={id}
              onClick={() => { setTab(id); setSideOpen(false); if (id === "comments") setHasNew(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${tab === id
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-white/55 hover:text-white/90 hover:bg-white/8"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {id === "comments" && hasNew && <span className="ml-auto w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {sideOpen && <div className="fixed inset-0 z-20 bg-black/60 md:hidden" onClick={() => setSideOpen(false)} />}

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="border-b border-white/10 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 flex-shrink-0" style={HEADER_BG}>
          <button onClick={() => setSideOpen(true)}
            className="md:hidden w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/70 hover:text-white"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            <Menu className="w-4 h-4" />
          </button>
          <h1 className="text-white/80 font-semibold text-sm flex-1 capitalize">
            {TABS.find((t) => t.id === tab)?.label}
          </h1>
          {/* Realtime indicator */}
          <span className="flex items-center gap-1.5 text-[10px] text-green-400/60 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Realtime
          </span>
          <button onClick={fetchData} title="Refresh"
            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/45 hover:text-white/80 transition-colors"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {hasNew && (
            <button onClick={() => { setTab("comments"); setHasNew(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 text-xs animate-pulse">
              <Bell className="w-3 h-3" /> Komentar Baru
            </button>
          )}
          <button onClick={() => window.open("/", "_self")}
            className="text-white/35 hover:text-white/70 transition-colors text-xs flex items-center gap-1">
            Website <ChevronRight className="w-3 h-3" />
          </button>
        </header>

        <div className="flex-1 p-4 md:p-5 overflow-auto">

          {fetchError && (
            <div className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Koneksi Supabase gagal</p>
                <p className="text-red-300/70 text-xs mt-0.5">{fetchError}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {tab === "dashboard" && (
                <div className="space-y-5 max-w-4xl">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <StatCard label="Total Visitor"    value={totalVisitor} sub="dari tabel visitors" />
                    <StatCard label="Visitor Hari Ini" value={todayVisitor} />
                    <StatCard label="Total Komentar"   value={comments.length} />
                    <StatCard label="Total Berita"     value={news.length} sub={`${news.filter((n) => n.published).length} published`} />
                  </div>
                  <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <h2 className="text-white/60 text-sm font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-violet-400" /> Komentar Terbaru
                    </h2>
                    <div className="space-y-2.5">
                      {comments.slice(0, 5).map((c) => (
                        <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/50 to-pink-500/50 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs uppercase">{c.username.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white/70 text-xs font-semibold">{c.username}</p>
                            <p className="text-white/35 text-xs truncate">{c.message}</p>
                          </div>
                          <p className="text-white/20 text-[10px] flex-shrink-0 hidden sm:block">{fmt(c.created_at)}</p>
                        </div>
                      ))}
                      {comments.length === 0 && <p className="text-white/25 text-xs text-center py-4">Belum ada komentar.</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* KOMENTAR */}
              {tab === "comments" && (
                <div className="space-y-3 max-w-3xl">
                  {/* Export button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => downloadCSV("komentar.csv", comments.map((c) => ({
                        id: c.id, username: c.username, message: c.message, pinned: c.pinned, created_at: c.created_at,
                      })))}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-white/10 text-white/50 hover:text-green-400 hover:border-green-500/30 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  </div>

                  {comments.length === 0 && <p className="text-white/30 text-sm text-center py-16">Belum ada komentar.</p>}
                  {comments.map((c) => {
                    const cReplies = getReplies(c.id);
                    const isNew = Date.now() - new Date(c.created_at).getTime() < 300_000;
                    return (
                      <div key={c.id} className={`rounded-xl p-4 border ${c.pinned ? "border-violet-500/40" : isNew ? "border-violet-500/25" : "border-white/8"}`}
                        style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="flex gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/50 to-pink-500/50 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm uppercase">{c.username.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-white font-semibold text-sm">{c.username}</span>
                              {c.pinned && <span className="text-[9px] text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full border border-violet-500/20">📌 Pinned</span>}
                              {isNew && !c.pinned && <span className="text-[9px] text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full border border-violet-500/20">BARU</span>}
                              <span className="text-white/30 text-xs">{fmt(c.created_at)}</span>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed break-words">{c.message}</p>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <button onClick={() => togglePin(c.id, c.pinned)} title={c.pinned ? "Unpin" : "Pin"}
                              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${c.pinned ? "border-violet-500/40 text-violet-400 bg-violet-500/10" : "border-white/10 text-white/30 hover:text-violet-400"}`}>
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(""); setReplyError(""); }}
                              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-violet-400 hover:bg-violet-500/10 transition-colors"
                              style={{ background: "rgba(255,255,255,0.04)" }}>
                              <CornerDownRight className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteComment(c.id)}
                              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              style={{ background: "rgba(255,255,255,0.04)" }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {replyingTo === c.id && (
                          <div className="mt-3 ml-12 flex flex-col gap-2">
                            <div className="flex gap-2">
                              <textarea value={replyText}
                                onChange={(e) => { setReplyText(e.target.value); setReplyError(""); }}
                                placeholder="Tulis balasan..." rows={2}
                                className="flex-1 px-3 py-2 rounded-xl border border-violet-500/25 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 resize-none"
                                style={{ background: "rgba(255,255,255,0.05)" }} />
                              <div className="flex flex-col gap-1.5">
                                <button onClick={() => sendReply(c.id)} disabled={replySending || !replyText.trim()}
                                  className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 hover:bg-violet-500/30 disabled:opacity-50 transition-colors">
                                  {replySending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                </button>
                                <button onClick={() => { setReplyingTo(null); setReplyText(""); setReplyError(""); }}
                                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
                                  style={{ background: "rgba(255,255,255,0.04)" }}>
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            {replyError && <p className="text-red-400 text-xs">{replyError}</p>}
                          </div>
                        )}

                        {cReplies.length > 0 && (
                          <div className="mt-3 ml-12 space-y-2">
                            {cReplies.map((r) => (
                              <div key={r.id} className="flex gap-2.5 border border-violet-500/15 rounded-xl p-3" style={{ background: "rgba(139,92,246,0.05)" }}>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[9px] font-bold text-violet-300 uppercase">
                                      <BadgeCheck className="w-2.5 h-2.5" /> {r.admin_name || "Developer"}
                                    </span>
                                    <span className="text-white/20 text-[10px]">{fmt(r.created_at)}</span>
                                  </div>
                                  <p className="text-white/65 text-sm">{r.reply_text}</p>
                                </div>
                                <button onClick={() => deleteReply(r.id)} className="text-red-400/40 hover:text-red-400 transition-colors flex-shrink-0 mt-1">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BALASAN */}
              {tab === "replies" && (
                <div className="space-y-3 max-w-3xl">
                  <div className="flex justify-end">
                    <button
                      onClick={() => downloadCSV("balasan.csv", replies.map((r) => ({
                        id: r.id, comment_id: r.comment_id, reply_text: r.reply_text, admin_name: r.admin_name, created_at: r.created_at,
                      })))}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-white/10 text-white/50 hover:text-green-400 hover:border-green-500/30 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  </div>
                  {replies.length === 0 && <p className="text-white/30 text-sm text-center py-16">Belum ada balasan.</p>}
                  {replies.map((r) => {
                    const parent = comments.find((c) => c.id === r.comment_id);
                    return (
                      <div key={r.id} className="rounded-xl p-4 border border-violet-500/15" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[9px] font-bold text-violet-300 uppercase">
                                <BadgeCheck className="w-2.5 h-2.5" /> {r.admin_name || "Developer"}
                              </span>
                              <span className="text-white/30 text-xs">→ <strong className="text-white/50">{parent?.username ?? "?"}</strong></span>
                              <span className="text-white/20 text-[10px]">{fmt(r.created_at)}</span>
                            </div>
                            <p className="text-white/65 text-sm leading-relaxed">{r.reply_text}</p>
                            {parent && (
                              <p className="text-white/25 text-xs mt-2 italic border-l-2 border-white/10 pl-2">
                                &ldquo;{parent.message.slice(0, 100)}{parent.message.length > 100 ? "..." : ""}&rdquo;
                              </p>
                            )}
                          </div>
                          <button onClick={() => deleteReply(r.id)} className="text-red-400/40 hover:text-red-400 transition-colors flex-shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BERITA */}
              {tab === "news" && (
                <div className="max-w-3xl space-y-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setShowNewsForm(true); setNewsEditing(null); setNewsForm(EMPTY_NEWS); setNewsError(""); }}
                      className="btn-neon px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Tambah Berita
                    </button>
                    <button
                      onClick={() => downloadCSV("berita.csv", news.map((n) => ({
                        id: n.id, title: n.title, category: n.category, content: n.content, published: n.published, created_at: n.created_at,
                      })))}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/50 hover:text-green-400 hover:border-green-500/30 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </div>

                  {showNewsForm && (
                    <div className="rounded-2xl p-5 border border-violet-500/20" style={{ background: "rgba(139,92,246,0.05)" }}>
                      <h3 className="text-white/70 font-semibold text-sm mb-4">
                        {newsEditing !== null ? "Edit Berita" : "Berita Baru"}
                      </h3>
                      <form onSubmit={submitNews} className="space-y-3">
                        <input value={newsForm.title}
                          onChange={(e) => { setNewsForm((p) => ({ ...p, title: e.target.value })); setNewsError(""); }}
                          placeholder="Judul berita *"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/40"
                          style={{ background: "rgba(255,255,255,0.05)" }} />
                        <input value={newsForm.thumbnail}
                          onChange={(e) => setNewsForm((p) => ({ ...p, thumbnail: e.target.value }))}
                          placeholder="URL thumbnail (opsional)"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/40"
                          style={{ background: "rgba(255,255,255,0.05)" }} />
                        <select value={newsForm.category}
                          onChange={(e) => setNewsForm((p) => ({ ...p, category: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/40"
                          style={{ background: "rgba(10,13,20,0.9)" }}>
                          {["General", "Update", "Project", "Info"].map((k) => (
                            <option key={k} value={k} className="bg-[#0d1117]">{k}</option>
                          ))}
                        </select>
                        <textarea value={newsForm.content}
                          onChange={(e) => { setNewsForm((p) => ({ ...p, content: e.target.value })); setNewsError(""); }}
                          placeholder="Isi berita *" rows={5}
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/40 resize-none"
                          style={{ background: "rgba(255,255,255,0.05)" }} />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={newsForm.published}
                            onChange={(e) => setNewsForm((p) => ({ ...p, published: e.target.checked }))}
                            className="w-4 h-4 accent-violet-500" />
                          <span className="text-white/50 text-sm">Publish sekarang</span>
                        </label>
                        {newsError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠ {newsError}</p>}
                        <div className="flex gap-2">
                          <button type="submit" disabled={newsSubmitting}
                            className="btn-neon px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60">
                            {newsSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            {newsEditing !== null ? "Update" : "Simpan"}
                          </button>
                          <button type="button"
                            onClick={() => { setShowNewsForm(false); setNewsEditing(null); setNewsError(""); }}
                            className="px-5 py-2 rounded-xl text-sm text-white/40 hover:text-white/70 border border-white/10 transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)" }}>
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {news.length === 0 && !showNewsForm && <p className="text-white/30 text-sm text-center py-12">Belum ada berita.</p>}
                  {news.map((n) => (
                    <div key={n.id} className="rounded-xl p-4 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${n.published ? "bg-green-500/15 text-green-400 border border-green-500/25" : "bg-white/5 text-white/30 border border-white/10"}`}>
                              {n.published ? "Published" : "Draft"}
                            </span>
                            <span className="text-white/25 text-[10px]">{n.category} • {fmt(n.created_at)}</span>
                          </div>
                          <p className="text-white/80 font-semibold text-sm mb-1">{n.title}</p>
                          <p className="text-white/35 text-xs line-clamp-2">{n.content}</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => togglePublish(n.id, n.published)} title={n.published ? "Unpublish" : "Publish"}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${n.published ? "border-green-500/30 text-green-400 hover:bg-green-500/10" : "border-white/10 text-white/30 hover:text-green-400"}`}
                            style={{ background: "rgba(255,255,255,0.04)" }}>
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => editNews(n)}
                            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-violet-400/60 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)" }}>
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteNews(n.id)}
                            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)" }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STATISTIK */}
              {tab === "stats" && (
                <div className="max-w-3xl space-y-5">
                  <div className="flex justify-end">
                    <button
                      onClick={() => downloadCSV("statistik-visitors.csv", visitors.map((v) => ({ id: v.id, created_at: v.created_at })))}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-white/10 text-white/50 hover:text-green-400 hover:border-green-500/30 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <Download className="w-3.5 h-3.5" /> Export Visitors CSV
                    </button>
                  </div>
                  <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <h2 className="text-white/60 text-sm font-semibold mb-4">Aktivitas 7 Hari Terakhir</h2>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="Komentar" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Visitor"  fill="#6D28D9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Total Visitor"   value={totalVisitor} />
                    <StatCard label="Visitor Hari Ini" value={todayVisitor} />
                    <StatCard label="Total Komentar"  value={comments.length} />
                    <StatCard label="Total Balasan"   value={replies.length} />
                    <StatCard label="Total Berita"    value={news.length} />
                    <StatCard label="Published"       value={news.filter((n) => n.published).length} />
                  </div>
                </div>
              )}

              {/* PENGATURAN */}
              {tab === "settings" && (
                <div className="max-w-md space-y-4">
                  <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <h2 className="text-white/70 font-semibold text-sm mb-4">Info Akun & Koneksi</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <span className="text-white/40">Auth</span>
                        <span className="text-white/60 text-xs">Supabase admins table</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <span className="text-white/40">Session</span>
                        <span className="text-green-400 text-xs">● Aktif (24 jam)</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <span className="text-white/40">Supabase</span>
                        <span className={fetchError ? "text-red-400 text-xs" : "text-green-400 text-xs"}>
                          {fetchError ? "● Error" : "● Terhubung"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2.5">
                        <span className="text-white/40">Realtime</span>
                        <span className="text-green-400 text-xs">● Aktif</span>
                      </div>
                    </div>
                    <button onClick={logout}
                      className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 border border-red-500/20 hover:bg-red-500/8 transition-all">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
