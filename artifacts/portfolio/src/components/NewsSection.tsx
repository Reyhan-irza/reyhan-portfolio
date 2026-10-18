import { useState, useEffect } from "react";
import { Newspaper, Calendar, Tag, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useScrollAnim } from "@/hooks/useScrollAnim";
import { SkeletonNewsCard } from "./SkeletonCard";

// Real Supabase schema: id, title, category, thumbnail, content, published, created_at
interface News {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  content: string;
  published: boolean;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Update:  "text-[#a43f2d] bg-[#a43f2d]/10 border-[#a43f2d]/20",
  Project: "text-[#a43f2d] bg-[#a43f2d]/10 border-[#a43f2d]/20",
  General: "text-[#6d6a62] bg-[#211f1b]/5 border-[#211f1b]/10",
  Info:    "text-[#a43f2d] bg-[#a43f2d]/10 border-[#a43f2d]/20",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function NewsCard({ item }: { item: News }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.content.length > 180;
  const tagStyle = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.General;

  return (
    <article data-motion-item className="glass border border-[rgba(33,31,27,.16)] rounded-2xl overflow-hidden hover:border-[#a43f2d] transition-all duration-300 group hover:-translate-y-1">
      {item.thumbnail && (
        <div className="h-44 overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wide ${tagStyle}`}>
            <Tag className="w-2.5 h-2.5" />
            {item.category}
          </span>
           <span className="text-[#6d6a62] text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {fmtDate(item.created_at)}
          </span>
        </div>

         <h3 className="text-[#211f1b] font-bold text-base mb-2 leading-snug group-hover:text-[#a43f2d] transition-colors">
          {item.title}
        </h3>

         <p className="text-[#6d6a62] text-sm leading-relaxed">
          {isLong && !expanded ? item.content.slice(0, 180) + "..." : item.content}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
             className="comment-read-more mt-2 text-[#a43f2d] text-xs hover:text-[#843322] flex items-center gap-1 transition-colors"
            aria-expanded={expanded}
          >
            {expanded ? "Sembunyikan" : "Baca Selengkapnya"}
            <ArrowRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>
    </article>
  );
}

export default function NewsSection() {
  const headerRef = useScrollAnim({ threshold: 0.15, reversibleOnCompact: true });
  const [news,    setNews]    = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const gridRef   = useScrollAnim({
    threshold: 0.08,
    delay: 80,
    refreshKey: `${loading}-${news.length}`,
    reversibleOnCompact: true,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (alive && data) setNews(data);
      } catch {
        if (alive) setLoadError(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section id="news" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="fade-up text-center mb-14">
           <p data-motion-item className="text-[#a43f2d] text-sm font-semibold uppercase tracking-widest mb-3">
            Kabar terbaru
          </p>
           <h2 data-motion-item className="text-3xl md:text-5xl font-bold text-[#211f1b] mb-4">
            Berita &amp; <span className="text-[#a43f2d]">Pembaruan</span>
          </h2>
          <div data-motion-item className="rgb-divider w-24 mx-auto mb-5" />
           <p data-motion-item className="text-[#6d6a62] max-w-md mx-auto text-base">
            Catatan tentang proyek dan hal yang sedang saya kerjakan.
          </p>
        </div>

        <div
          ref={gridRef}
          className="fade-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          aria-busy={loading}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonNewsCard key={i} />)
            : loadError
              ? <p role="status" className="md:col-span-2 lg:col-span-3 border border-white/10 px-5 py-6 text-sm text-neutral-400">Berita belum dapat dimuat saat ini.</p>
              : news.length === 0
                ? <p role="status" className="md:col-span-2 lg:col-span-3 border border-white/10 px-5 py-6 text-sm text-neutral-400">Belum ada berita yang dipublikasikan.</p>
                : news.map((item) => <NewsCard key={item.id} item={item} />)
          }
        </div>

        {loading && <p role="status" className="sr-only">Memuat berita.</p>}
        {!loading && !loadError && news.length > 0 && (
          <p role="status" className="sr-only">
            {news.length} artikel berita berhasil dimuat.
          </p>
        )}

        {!loading && !loadError && news.length > 0 && <div className="mt-6 flex items-center justify-center">
             <span className="flex items-center gap-1.5 text-[#6d6a62] text-xs">
            <Newspaper className="w-3 h-3" /> {news.length} artikel dipublikasikan
          </span>
        </div>}
      </div>
    </section>
  );
}
