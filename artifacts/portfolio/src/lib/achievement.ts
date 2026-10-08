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
  FIRST_SCROLL:    { icon: "target"  as AchievementIcon, title: "First Steps",          desc: "You’ve started exploring the portfolio." },
  MUSIC_LOVER:     { icon: "music"   as AchievementIcon, title: "Playlist Found",       desc: "You found the playlist I’ve been listening to." },
  PROJECT_READER:  { icon: "rocket"  as AchievementIcon, title: "Project Explorer",    desc: "You’ve looked through all three projects." },
  EASTER_EGG:      { icon: "star"    as AchievementIcon, title: "Easter Egg Found",    desc: "You found a hidden detail." },
  ROAST_MASTER:    { icon: "flame"   as AchievementIcon, title: "Roast Me",            desc: "Thanks for giving the portfolio a roast." },
  SCROLL_BOTTOM:   { icon: "trophy"  as AchievementIcon, title: "Made It to the End",  desc: "Thanks for scrolling all the way down." },
  COMMENTER:       { icon: "message" as AchievementIcon, title: "Thanks for the Comment", desc: "Thanks for leaving a message." },
  JOURNEY_READER:  { icon: "book"    as AchievementIcon, title: "Journey Reader",     desc: "You’ve seen how I got here." },
  AGE_GUESSER:     { icon: "help"    as AchievementIcon, title: "Good Guess",         desc: "You guessed my age correctly." },
};
