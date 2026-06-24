import { useState, useRef, useEffect } from "react";
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
    color: "from-red-600/30 to-rose-700/20",
    accent: "border-red-500/40",
    accentRing: "ring-red-500/30",
  },
  {
    id: 2,
    title: "Dear God",
    artist: "Avenged Sevenfold",
    trackId: "2FML7gk7ac6quGFIjvkDb3",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/45/ab/b7/45abb7a5-6a53-8d8f-91b0-03d1ef93111e/dj.zzffiuki.jpg/400x400bb.jpg",
    color: "from-orange-500/30 to-amber-600/20",
    accent: "border-orange-500/40",
    accentRing: "ring-orange-500/30",
  },
  {
    id: 3,
    title: "Open Arms",
    artist: "SZA ft. Travis Scott",
    trackId: "6koKhrBBcExADvWuOgceNZ",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/3b/a9/bd3ba9fb-9609-144f-bcfe-ead67b5f6ab3/196589564931.jpg/400x400bb.jpg",
    color: "from-violet-500/30 to-purple-600/20",
    accent: "border-violet-500/40",
    accentRing: "ring-violet-500/30",
  },
  {
    id: 4,
    title: "Snooze",
    artist: "SZA",
    trackId: "4iZ4pt7kvcaH6Yo8UoZ4s2",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/62/93/13/6293132e-20ff-67ab-3d1f-96bb6797a6ba/196589564955.jpg/400x400bb.jpg",
    color: "from-pink-500/30 to-rose-600/20",
    accent: "border-pink-500/40",
    accentRing: "ring-pink-500/30",
  },
  {
    id: 5,
    title: "Saturn",
    artist: "SZA",
    trackId: "1bjeWoagtHmUKputLVyDxQ",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/97/bd/88/97bd8804-7d3e-e6c8-0532-ff22877b931c/196871766890.jpg/400x400bb.jpg",
    color: "from-blue-500/30 to-cyan-600/20",
    accent: "border-blue-500/40",
    accentRing: "ring-blue-500/30",
  },
];

export default function MusicSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [nowPlaying, setNowPlaying] = useState<number | null>(null);
  const [spotifyKey, setSpotifyKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const scrollToCard = (idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(".music-card");
    const card = cards[idx];
    if (card) {
      const containerLeft = container.getBoundingClientRect().left;
      const cardLeft = card.getBoundingClientRect().left;
      const offset = cardLeft - containerLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollBy({ left: offset, behavior: "smooth" });
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
          <p className="text-pink-400 text-sm font-semibold uppercase tracking-widest mb-3">My Music Fav Gweh</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Peak <span className="gradient-text">Song</span>
          </h2>
          <div className="rgb-divider w-24 mx-auto mb-6" />
          <p className="text-white/50 max-w-md mx-auto text-base">
            Ts Song Still Banger,y&apos;all.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-violet-500/40 transition-all duration-200 shadow-lg hidden md:flex"
            aria-label="Lagu sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-violet-500/40 transition-all duration-200 shadow-lg hidden md:flex"
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
              className={`transition-all duration-300 rounded-full ${
                activeIdx === i
                  ? "w-6 h-2 bg-gradient-to-r from-violet-500 to-pink-500"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Lagu ${i + 1}`}
            />
          ))}
        </div>

        {/* Spotify embed */}
        <div className="mt-8">
          <SpotifyEmbed song={songs[activeIdx]} isPlaying={nowPlaying === activeIdx} resetKey={spotifyKey} />
        </div>

        <p className="text-center text-white/20 text-xs mt-4">
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
          ? `${song.accent} ring-2 ${song.accentRing} scale-105 shadow-xl shadow-violet-500/20`
          : "border-white/8 hover:border-white/20 hover:scale-102 hover:-translate-y-1"
      }`}
      onClick={onClick}
    >
      {/* Cover art */}
      <div className={`w-full aspect-square rounded-xl mb-4 bg-gradient-to-br ${song.color} overflow-hidden relative`}>
        {song.coverUrl && !imgError ? (
          <>
            <img
              src={song.coverUrl}
              alt={`${song.title} cover`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-10 h-10 text-white/40" />
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
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-[10px] font-semibold uppercase tracking-widest">Now Playing</span>
        </div>
      )}

      <h3 className="text-white font-semibold text-sm leading-snug mb-1 truncate">{song.title}</h3>
      <p className="text-white/40 text-xs truncate">{song.artist}</p>
    </button>
  );
}

function EqualizerBar({ delay }: { delay: string }) {
  return (
    <span
      className="w-1 rounded-full bg-white"
      style={{
        height: "12px",
        animation: "equalizerBounce 0.6s ease-in-out infinite alternate",
        animationDelay: delay,
      }}
    />
  );
}

function SpotifyEmbed({ song, isPlaying, resetKey }: { song: Song; isPlaying: boolean; resetKey: number }) {
  const embedUrl = `https://open.spotify.com/embed/track/${song.trackId}?utm_source=generator&theme=0`;

  return (
    <div
      className={`transition-all duration-500 glass neon-border rounded-2xl overflow-hidden p-1 ${
        isPlaying ? "ring-2 ring-violet-500/30" : ""
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
        <Music className="w-4 h-4 text-violet-400" />
        <span className="text-white/50 text-xs">Spotify Player</span>
        {isPlaying && (
          <span className="ml-auto flex items-center gap-1.5 text-green-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
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
