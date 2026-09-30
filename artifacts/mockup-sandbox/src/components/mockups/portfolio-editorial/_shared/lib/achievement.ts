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
  FIRST_SCROLL:    { icon: "target"  as AchievementIcon, title: "Penjelajah Pertama",    desc: "Kamu mulai menjelajahi portfolio ini!"           },
  MUSIC_LOVER:     { icon: "music"   as AchievementIcon, title: "Menemukan Playlist",    desc: "Kamu menemukan section musik favorit!"            },
  PROJECT_READER:  { icon: "rocket"  as AchievementIcon, title: "Membaca Semua Project", desc: "Kamu telah melihat semua project!"                },
  EASTER_EGG:      { icon: "star"    as AchievementIcon, title: "Easter Egg Found",      desc: "Kamu menemukan rahasia tersembunyi!"              },
  ROAST_MASTER:    { icon: "flame"   as AchievementIcon, title: "Roast Master",          desc: "Berani juga roasting portfolio ini!"              },
  SCROLL_BOTTOM:   { icon: "trophy"  as AchievementIcon, title: "Scroll Sampai Bawah",  desc: "Kamu membaca sampai habis, respect!"             },
  COMMENTER:       { icon: "message" as AchievementIcon, title: "Komentator Aktif",      desc: "Terima kasih sudah meninggalkan pesan!"           },
  JOURNEY_READER:  { icon: "book"    as AchievementIcon, title: "Membaca Perjalanan",    desc: "Kamu tahu sejarah developer ini!"                },
  AGE_GUESSER:     { icon: "help"    as AchievementIcon, title: "Penebak Ulung",         desc: "Berhasil menebak umur developer dengan tepat!"   },
};
