import { useState, useEffect } from "react";
import { Music, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

interface Song {
  id: number;
  title: string;
  artist: string;
  trackId: string;
  coverUrl: string;
  color: string;
  accent: string;
  accentRing: string;
}

const songs: Song[] = [
  {
    id: 1,
    title: "Little Piece of Heaven",
    artist: "Avenged Sevenfold",
    trackId: "1BLfQ6dPXmuDrFmbdfW7Jl",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c4/21/00/c42100f9-f329-aad4-7535-9055429efc3f/mzi.tbskuyey.jpg/400x400bb.jpg",
    color: "bg-[#e8e1d4]",
    accent: "border-[#a43f2d]",
    accentRing: "ring-[#a43f2d]/30",
  },
  {
    id: 2,
    title: "Dear God",
    artist: "Avenged Sevenfold",
    trackId: "2FML7gk7ac6quGFIjvkDb3",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/45/ab/b7/45abb7a5-6a53-8d8f-91b0-03d1ef93111e/dj.zzffiuki.jpg/400x400bb.jpg",
    color: "bg-[#e8e1d4]",
    accent: "border-[#a43f2d]",
    accentRing: "ring-[#a43f2d]/30",
  },
  {
    id: 3,
    title: "Open Arms",
    artist: "SZA ft. Travis Scott",
    trackId: "6koKhrBBcExADvWuOgceNZ",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/3b/a9/bd3ba9fb-9609-144f-bcfe-ead67b5f6ab3/196589564931.jpg/400x400bb.jpg",
    color: "bg-[#e8e1d4]",
    accent: "border-[#a43f2d]",
    accentRing: "ring-[#a43f2d]/30",
  },
  {
    id: 4,
    title: "Snooze",
    artist: "SZA",
    trackId: "4iZ4pt7kvcaH6Yo8UoZ4s2",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/62/93/13/6293132e-20ff-67ab-3d1f-96bb6797a6ba/196589564955.jpg/400x400bb.jpg",
    color: "bg-[#e8e1d4]",
    accent: "border-[#a43f2d]",
    accentRing: "ring-[#a43f2d]/30",
  },
  {
    id: 5,
    title: "Saturn",
    artist: "SZA",
    trackId: "1bjeWoagtHmUKputLVyDxQ",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/97/bd/88/97bd8804-7d3e-e6c8-0532-ff22877b931c/196871766890.jpg/400x400bb.jpg",
    color: "bg-[#e8e1d4]",
    accent: "border-[#a43f2d]",
    accentRing: "ring-[#a43f2d]/30",
  },
];

export default function MusicSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [nowPlaying, setNowPlaying] = useState<number | null>(null);
  const [spotifyKey, setSpotifyKey] = useState(0);
  const scrollRef = useScrollAnim<HTMLDivElement>({ threshold: 0.08, stagger: 0.06, refreshKey: songs.length });
  const headerRef = useScrollAnim({ threshold: 0.2 });

  // When background music resumes, stop Spotify by reloading the embed
  useEffect(() => {
    const handler = () => {
      setNowPlaying(null);
      setSpotifyKey((k) => k + 1);
    };
    window.addEventListener("bgmusic:play", handler);
    return () => window.removeEventListener("bgmusic:play", handler);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let frame = 0;

    const syncActiveCard = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const containerBounds = container.getBoundingClientRect();
        const containerCenter = containerBounds.left + containerBounds.width / 2;
        const cards = Array.from(container.querySelectorAll<HTMLElement>(".music-card"));
        const nearest = cards.reduce<{ index: number; distance: number } | null>((best, card, index) => {
          const bounds = card.getBoundingClientRect();
          const distance = Math.abs(bounds.left + bounds.width / 2 - containerCenter);
          return !best || distance < best.distance ? { index, distance } : best;
        }, null);
        if (nearest) setActiveIdx(nearest.index);
      });
    };

    container.addEventListener("scroll", syncActiveCard, { passive: true });
    return () => {
      container.removeEventListener("scroll", syncActiveCard);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToCard = (idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(".music-card");
    const card = cards[idx];
    if (card) {
      const containerLeft = container.getBoundingClientRect().left;
      const cardLeft = card.getBoundingClientRect().left;
      const offset = cardLeft - containerLeft - (container.offsetWidth - card.offsetWidth) / 2;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      container.scrollBy({ left: offset, behavior: reduced ? "auto" : "smooth" });
    }
  };

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    setNowPlaying(idx);
    scrollToCard(idx);
    // Pause background music so Spotify and mp3 don't play simultaneously
    window.dispatchEvent(new CustomEvent("spotify:play"));
  };

  const handlePrev = () => handleSelect((activeIdx - 1 + songs.length) % songs.length);
  const handleNext = () => handleSelect((activeIdx + 1) % songs.length);

  return (
    <section id="music" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="fade-up text-center mb-12">
          <p data-motion-item className="text-[#a43f2d] text-sm font-semibold uppercase tracking-widest mb-3">My Music Fav Gweh</p>
          <h2 data-motion-item className="text-3xl md:text-5xl font-bold text-[#211f1b] mb-4">
            Peak <span className="text-[#a43f2d]">Song</span>
          </h2>
          <div data-motion-item className="rgb-divider w-24 mx-auto mb-6" />
          <p data-motion-item className="text-[#6d6a62] max-w-md mx-auto text-base">
            Ts Song Still Banger,y&apos;all.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full glass border border-[rgba(33,31,27,.16)] flex items-center justify-center text-[#6d6a62] hover:text-[#211f1b] hover:border-[#a43f2d] transition-all duration-200 hidden md:flex"
            aria-label="Lagu sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto overscroll-x-contain px-[max(0px,calc((100%-13rem)/2))] pb-4 snap-x snap-mandatory md:px-[max(0px,calc((100%-15rem)/2))]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="region"
            aria-label="Favorite songs"
            tabIndex={0}
          >
            {songs.map((song, idx) => (
              <MusicCard
                key={song.id}
                song={song}
                isActive={activeIdx === idx}
                isPlaying={nowPlaying === idx}
                onClick={() => handleSelect(idx)}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full glass border border-[rgba(33,31,27,.16)] flex items-center justify-center text-[#6d6a62] hover:text-[#211f1b] hover:border-[#a43f2d] transition-all duration-200 hidden md:flex"
            aria-label="Lagu berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {songs.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="grid h-11 w-11 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8290ff]"
              aria-label={`Lagu ${i + 1}`}
              aria-pressed={activeIdx === i}
            >
              <span
                aria-hidden="true"
                className={`h-2 rounded-full bg-[#a43f2d] transition-[width,opacity] duration-300 motion-reduce:transition-none ${
                  activeIdx === i ? "w-6 opacity-100" : "w-2 opacity-35"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Spotify embed */}
        <div className="mt-8">
          <SpotifyEmbed song={songs[activeIdx]} isPlaying={nowPlaying === activeIdx} resetKey={spotifyKey} />
        </div>

        <p className="text-center text-[#6d6a62] text-xs mt-4">
          Klik card untuk berganti lagu &bull; Music background otomatis pause saat Spotify aktif
        </p>
      </div>
    </section>
  );
}

function MusicCard({
  song,
  isActive,
  isPlaying,
  onClick,
}: {
  song: Song;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      className={`music-card flex-shrink-0 snap-center w-52 md:w-60 rounded-2xl p-4 glass border transition-all duration-400 text-left cursor-pointer ${
        isActive
          ? `${song.accent} ring-2 ${song.accentRing} scale-105`
          : "border-[rgba(33,31,27,.16)] hover:border-[#a43f2d] hover:scale-102 hover:-translate-y-1"
      }`}
      onClick={onClick}
      data-motion-item
      aria-label={`${isActive ? "Selected: " : ""}${song.title} by ${song.artist}. Select to play.`}
      aria-pressed={isActive}
    >
      {/* Cover art */}
       <div className={`w-full aspect-square rounded-xl mb-4 ${song.color} overflow-hidden relative`}>
        {song.coverUrl && !imgError ? (
          <>
            <img
              src={song.coverUrl}
              alt={`${song.title} cover`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            {isActive && (
               <div className="absolute inset-0 bg-[#211f1b]/15" />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-10 h-10 text-[#6d6a62]" />
          </div>
        )}

        {isPlaying && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-0.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
            <EqualizerBar delay="0s" />
            <EqualizerBar delay="0.15s" />
            <EqualizerBar delay="0.3s" />
            <EqualizerBar delay="0.1s" />
            <EqualizerBar delay="0.25s" />
          </div>
        )}
      </div>

      {isPlaying && (
        <div className="flex items-center gap-1.5 mb-2">
           <span className="w-1.5 h-1.5 rounded-full bg-[#a43f2d] animate-pulse" />
           <span className="text-[#a43f2d] text-[10px] font-semibold uppercase tracking-widest">Now Playing</span>
        </div>
      )}

       <h3 className="text-[#211f1b] font-semibold text-sm leading-snug mb-1 truncate">{song.title}</h3>
       <p className="text-[#6d6a62] text-xs truncate">{song.artist}</p>
    </button>
  );
}

function EqualizerBar({ delay }: { delay: string }) {
  return (
        <span
      className="w-1 rounded-full bg-[#a43f2d]"
      style={{
        height: "12px",
        animation: "equalizerBounce 0.6s ease-in-out infinite alternate",
        animationDelay: delay,
      }}
          aria-hidden="true"
    />
  );
}

function SpotifyEmbed({ song, isPlaying, resetKey }: { song: Song; isPlaying: boolean; resetKey: number }) {
  const embedUrl = `https://open.spotify.com/embed/track/${song.trackId}?utm_source=generator&theme=0`;

  return (
    <div
       className={`transition-all duration-500 glass neon-border rounded-2xl overflow-hidden p-1 ${
         isPlaying ? "ring-2 ring-[#a43f2d]/30" : ""
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[rgba(33,31,27,.16)]">
         <Music className="w-4 h-4 text-[#a43f2d]" />
         <span className="text-[#6d6a62] text-xs">Spotify Player</span>
        {isPlaying && (
           <span className="ml-auto flex items-center gap-1.5 text-[#a43f2d] text-xs">
             <span className="w-1.5 h-1.5 rounded-full bg-[#a43f2d] animate-pulse" />
            Now Playing
          </span>
        )}
      </div>
      <iframe
        key={`${song.trackId}-${resetKey}`}
        src={embedUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl block"
        title={`${song.title} - ${song.artist}`}
      />
    </div>
  );
}
