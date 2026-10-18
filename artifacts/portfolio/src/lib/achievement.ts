export type AchievementIcon =
  | "target" | "music" | "rocket" | "star" | "flame"
  | "trophy" | "message" | "book" | "help";

export interface Achievement {
  icon: AchievementIcon;
  title: string;
  desc: string;
}

const fired = new Set<string>();

export function unlockAchievement(achievement: Achievement) {
  if (fired.has(achievement.title)) return;
  fired.add(achievement.title);
  window.dispatchEvent(new CustomEvent("achievement", { detail: achievement }));
}

export const ACHIEVEMENTS = {
  FIRST_SCROLL:    { icon: "target"  as AchievementIcon, title: "Langkah pertama", desc: "Lo mulai menjelajahi portofolio ini." },
  MUSIC_LOVER:     { icon: "music"   as AchievementIcon, title: "Playlist ditemukan", desc: "Lo menemukan playlist yang sering gue dengarkan." },
  PROJECT_READER:  { icon: "rocket"  as AchievementIcon, title: "Penjelajah proyek", desc: "Lo sudah melihat ketiga proyek gue." },
  EASTER_EGG:      { icon: "star"    as AchievementIcon, title: "Easter egg ditemukan", desc: "Lo menemukan detail tersembunyi." },
  ROAST_MASTER:    { icon: "flame"   as AchievementIcon, title: "Roast portofolio", desc: "Makasih sudah memberi roast buat portofolio ini." },
  SCROLL_BOTTOM:   { icon: "trophy"  as AchievementIcon, title: "Sampai di akhir", desc: "Makasih sudah menggulir sampai bagian paling bawah." },
  COMMENTER:       { icon: "message" as AchievementIcon, title: "Makasih komentarnya", desc: "Makasih sudah meninggalkan pesan." },
  JOURNEY_READER:  { icon: "book"    as AchievementIcon, title: "Pembaca perjalanan", desc: "Lo sudah melihat perjalanan gue." },
  AGE_GUESSER:     { icon: "help"    as AchievementIcon, title: "Tebakan tepat", desc: "Tebakan usia lo benar." },
};
