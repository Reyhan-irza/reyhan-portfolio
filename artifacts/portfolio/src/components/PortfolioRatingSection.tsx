import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { gsap } from "@/lib/motion";

const VISITOR_ID_KEY = "portfolio_rating_visitor_v1";
const MY_RATING_KEY = "portfolio_rating_value_v1";
const ratingValues = [1, 2, 3, 4, 5] as const;

interface RatingSummary {
  rating_count: number;
  average_rating: number;
  one_star_count: number;
  two_star_count: number;
  three_star_count: number;
  four_star_count: number;
  five_star_count: number;
}

function getStoredRating(): number | null {
  try {
    const value = Number(localStorage.getItem(MY_RATING_KEY));
    return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
  } catch {
    return null;
  }
}

function getOrCreateVisitorId(): string {
  try {
    const stored = localStorage.getItem(VISITOR_ID_KEY);
    if (stored && /^[0-9a-f-]{36}$/i.test(stored)) return stored;

    const visitorId = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
    return visitorId;
  } catch {
    return crypto.randomUUID();
  }
}

export default function PortfolioRatingSection() {
  const starsRef = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");
  const [myRating, setMyRating] = useState<number | null>(() => getStoredRating());
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [animationRating, setAnimationRating] = useState(0);
  const [animationVersion, setAnimationVersion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let alive = true;

    const loadSummary = async () => {
      setSummaryLoading(true);
      setSummaryError("");
      const { data, error } = await supabase
        .from("portfolio_rating_summary")
        .select("*")
        .single();

      if (!alive) return;
      if (error) {
        setSummaryError("Rating belum dapat dimuat. Periksa koneksi Supabase.");
        setSummary(null);
      } else {
        setSummary(data as RatingSummary);
      }
      setSummaryLoading(false);
    };

    void loadSummary();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (animationVersion === 0 || animationRating === 0 || !starsRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const stars = gsap.utils.toArray<HTMLElement>("[data-rating-star]");
      gsap.fromTo(
        stars.slice(0, animationRating),
        { scale: 0.72, rotation: -12, y: 3 },
        {
          scale: 1,
          rotation: 0,
          y: 0,
          duration: 0.42,
          stagger: 0.045,
          ease: "back.out(1.65)",
          clearProps: "transform",
        },
      );
    }, starsRef);

    return () => context.revert();
  }, [animationRating, animationVersion]);

  const submitRating = async (value: number) => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    setFeedback("");
    setHoverRating(value);
    setAnimationRating(value);
    setAnimationVersion((version) => version + 1);

    try {
      const visitorId = getOrCreateVisitorId();
      const { error } = await supabase.rpc("submit_portfolio_rating", {
        p_visitor_id: visitorId,
        p_rating: value,
      });
      if (error) throw error;

      try {
        localStorage.setItem(MY_RATING_KEY, String(value));
      } catch {
        // The database write succeeded; retain the in-memory selection.
      }
      setMyRating(value);
      setFeedback("Terima kasih, rating kamu sudah tersimpan.");

      const { data, error: summaryFetchError } = await supabase
        .from("portfolio_rating_summary")
        .select("*")
        .single();
      if (!summaryFetchError && data) setSummary(data as RatingSummary);
    } catch (error) {
      console.error("Portfolio rating failed:", error);
      setSubmitError("Rating belum tersimpan. Pastikan SQL Supabase sudah dijalankan dan koneksi tersedia.");
      setHoverRating(null);
    } finally {
      setSubmitting(false);
    }
  };

  const displayedRating = hoverRating ?? myRating ?? 0;

  return (
    <section id="portfolio-rating" className="relative px-6 py-16 sm:py-20">
      <div className="glass mx-auto max-w-4xl rounded-3xl border border-white/10 px-5 py-8 text-center sm:px-8 sm:py-10">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#aeb8ff]">
          Visitor feedback
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Rate this portfolio
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#c9d0dc]">
          Pilih 1 sampai 5 bintang untuk memberi penilaian.
        </p>

        <div
          ref={starsRef}
          className="mt-6 flex justify-center gap-1.5 sm:gap-2"
          role="group"
          aria-label="Beri rating dari 1 sampai 5 bintang"
          aria-busy={submitting}
        >
          {ratingValues.map((value) => {
            const active = value <= displayedRating;
            return (
              <button
                key={value}
                type="button"
                data-rating-star
                data-rating-value={value}
                aria-label={`${value} dari 5 bintang`}
                aria-pressed={myRating === value}
                aria-describedby="portfolio-rating-hint"
                disabled={submitting}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(null)}
                onFocus={() => setHoverRating(value)}
                onBlur={() => setHoverRating(null)}
                onClick={() => void submitRating(value)}
                className="grid h-12 w-12 place-items-center rounded-xl text-[#8290ff] transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8290ff] disabled:cursor-wait disabled:opacity-60"
              >
                <Star
                  aria-hidden="true"
                  className={`h-7 w-7 transition-colors ${active ? "fill-current text-[#aeb8ff]" : "fill-transparent text-[#667085]"}`}
                />
              </button>
            );
          })}
        </div>
        <p id="portfolio-rating-hint" className="sr-only">
          Pilih bintang untuk menyimpan rating. Kamu dapat mengubah rating dari browser ini.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-3">
          {summaryLoading ? (
            <p role="status" className="text-xs text-[#8b93a3]">Memuat hasil rating…</p>
          ) : summaryError ? (
            <p role="status" className="text-xs text-[#c9d0dc]">{summaryError}</p>
          ) : summary && summary.rating_count > 0 ? (
            <>
              <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-white">
                <Star className="h-4 w-4 fill-current text-[#aeb8ff]" aria-hidden="true" />
                {Number(summary.average_rating).toFixed(1)} / 5
              </span>
              <span className="text-xs text-[#8b93a3]">
                dari {summary.rating_count.toLocaleString("id-ID")} rating visitor
              </span>
            </>
          ) : (
            <p role="status" className="text-xs text-[#8b93a3]">Belum ada rating — jadilah yang pertama.</p>
          )}
        </div>

        {feedback && (
          <p role="status" className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#c9d0dc]">
            <Check className="h-3.5 w-3.5 text-[#aeb8ff]" aria-hidden="true" />
            {feedback}
          </p>
        )}
        {submitError && <p role="alert" className="mt-4 text-xs text-rose-300">{submitError}</p>}
        {submitting && (
          <p role="status" className="mt-4 inline-flex items-center gap-2 text-xs text-[#8b93a3]">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Menyimpan rating…
          </p>
        )}
      </div>
    </section>
  );
}
