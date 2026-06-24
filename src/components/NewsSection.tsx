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
  Update:  "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Project: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  General: "text-white/50 bg-white/5 border-white/10",
  Info:    "text-green-400 bg-green-500/10 border-green-500/20",
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
    <article className="glass border border-white/8 rounded-2xl overflow-hidden hover:border-violet-500/25 transition-all duration-300 group hover:-translate-y-1">
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
          <span className="text-white/25 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {fmtDate(item.created_at)}
          </span>
        </div>

        <h3 className="text-white font-bold text-base mb-2 leading-snug group-hover:text-violet-200 transition-colors">
          {item.title}
        </h3>

        <p className="text-white/50 text-sm leading-relaxed">
          {isLong && !expanded ? item.content.slice(0, 180) + "..." : item.content}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-2 text-violet-400 text-xs hover:text-violet-300 flex items-center gap-1 transition-colors"
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
  const headerRef = useScrollAnim({ threshold: 0.15 });
  const gridRef   = useScrollAnim({ threshold: 0.08, delay: 80 });

  const [news,    setNews]    = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (alive) {
        if (!error && data) setNews(data);
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!loading && news.length === 0) return null;

  return (
    <section id="news" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="fade-up text-center mb-14">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">
            What&apos;s New
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            News &amp; <span className="gradient-text">Updates</span>
          </h2>
          <div className="rgb-divider w-24 mx-auto mb-5" />
          <p className="text-white/45 max-w-md mx-auto text-base">
            Kabar terbaru seputar project, update, dan hal-hal menarik lainnya.
          </p>
        </div>

        <div ref={gridRef} className="fade-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonNewsCard key={i} />)
            : news.map((item) => <NewsCard key={item.id} item={item} />)
          }
        </div>

        <div className="mt-6 flex items-center justify-center">
          <span className="flex items-center gap-1.5 text-white/20 text-xs">
            <Newspaper className="w-3 h-3" /> {news.length} artikel dipublish
          </span>
        </div>
      </div>
    </section>
  );
}
