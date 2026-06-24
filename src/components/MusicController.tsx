import { useState, useEffect, useRef } from "react";
import { Music, Pause, Play, Volume2, VolumeX, ChevronDown } from "lucide-react";

const STORAGE_KEY = "reyhan_music_v1";

export default function MusicController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying]   = useState(false);
  const [volume, setVolume]     = useState(0.55);
  const [minimized, setMin]     = useState(false);
  const [muted, setMuted]       = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}music.mp3`);
    audio.loop    = true;
    audio.volume  = 0.55;
    audio.preload = "none";

    audio.addEventListener("canplaythrough", () => setReady(true), { once: true });
    audio.addEventListener("error", () => setHasError(true), { once: true });

    audioRef.current = audio;

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (typeof saved.vol === "number") { audio.volume = saved.vol; setVolume(saved.vol); }
      if (typeof saved.min === "boolean") setMin(saved.min);
    } catch {}

    return () => { audio.pause(); audio.src = ""; };
  }, []);

  // Listen for music:play event (e.g. from intro animation)
  useEffect(() => {
    const handler = () => {
      const audio = audioRef.current;
      if (!audio || hasError) return;
      audio.load();
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };
    window.addEventListener("music:play", handler);
    return () => window.removeEventListener("music:play", handler);
  }, [hasError]);

  // Listen for spotify:play — pause background music so they don't clash
  useEffect(() => {
    const handler = () => {
      const audio = audioRef.current;
      if (!audio || !playing) return;
      audio.pause();
      setPlaying(false);
    };
    window.addEventListener("spotify:play", handler);
    return () => window.removeEventListener("spotify:play", handler);
  }, [playing]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ vol: volume, min: minimized }));
    } catch {}
  }, [volume, minimized]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (!ready) audio.load();
      // Notify MusicSection to stop Spotify before background music plays
      window.dispatchEvent(new CustomEvent("bgmusic:play"));
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  const handleVolume = (v: number) => {
    const audio = audioRef.current;
    setVolume(v);
    if (audio) { audio.volume = v; if (v > 0 && muted) { audio.muted = false; setMuted(false); } }
  };

  if (hasError) return null;

  const BAR_HEIGHTS = [0.55, 0.9, 0.65, 1, 0.45, 0.8, 0.6];

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-2">
      {!minimized && (
        <div className="glass border border-white/10 rounded-2xl p-4 w-56 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
              <Music className={`w-4 h-4 text-violet-400 ${playing ? "animate-pulse" : ""}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs font-semibold">Background Music</p>
              <p className={`text-[10px] ${playing ? "text-violet-400" : "text-white/30"}`}>
                {playing ? "● Playing..." : "Paused"}
              </p>
            </div>
          </div>

          {/* Visualizer */}
          <div className="flex items-end gap-[2px] h-5 mb-3">
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-gradient-to-t from-violet-500 to-pink-400"
                style={{
                  height: "100%",
                  transformOrigin: "bottom",
                  transition: "transform 0.15s ease",
                  transform: playing ? `scaleY(${h})` : "scaleY(0.15)",
                  animation: playing
                    ? `visualizer-bar ${0.38 + i * 0.07}s ease-in-out infinite alternate`
                    : "none",
                  animationDelay: `${i * 0.04}s`,
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 hover:bg-violet-500/35 transition-colors flex-shrink-0"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/45 hover:text-white/80 transition-colors flex-shrink-0"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <input
              type="range"
              min={0} max={1} step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => handleVolume(Number(e.target.value))}
              className="flex-1 h-1 rounded-full accent-violet-500 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>
      )}

      {/* Toggle minimize button */}
      <button
        onClick={() => setMin((p) => !p)}
        className={`w-10 h-10 rounded-xl glass border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg
          ${playing ? "border-violet-500/40 text-violet-400" : "border-white/10 text-white/45 hover:text-white/80"}`}
        aria-label={minimized ? "Open music player" : "Minimize music player"}
      >
        {minimized
          ? <Music className={`w-4 h-4 ${playing ? "animate-pulse" : ""}`} />
          : <ChevronDown className="w-4 h-4" />
        }
      </button>
    </div>
  );
}
