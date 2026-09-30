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
             className="mt-2 text-[#a43f2d] text-xs hover:text-[#843322] flex items-center gap-1 transition-colors"
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
  const [news,    setNews]    = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef   = useScrollAnim({ threshold: 0.08, delay: 80, refreshKey: `${loading}-${news.length}` });

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
           <p data-motion-item className="text-[#a43f2d] text-sm font-semibold uppercase tracking-widest mb-3">
            What&apos;s New
          </p>
           <h2 data-motion-item className="text-3xl md:text-5xl font-bold text-[#211f1b] mb-4">
            News &amp; <span className="text-[#a43f2d]">Updates</span>
          </h2>
          <div data-motion-item className="rgb-divider w-24 mx-auto mb-5" />
           <p data-motion-item className="text-[#6d6a62] max-w-md mx-auto text-base">
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
             <span className="flex items-center gap-1.5 text-[#6d6a62] text-xs">
            <Newspaper className="w-3 h-3" /> {news.length} artikel dipublish
          </span>
        </div>
      </div>
    </section>
  );
}
