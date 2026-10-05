import MusicController from "@/components/MusicController";
import NewsSection from "@/components/NewsSection";
import MusicSection from "@/components/MusicSection";
import CommentsSection from "@/components/CommentsSection";
import RoastButton from "@/components/RoastButton";
import TerminalMode from "@/components/TerminalMode";

export default function SecondaryArchive() {
  return (
    <div className="secondary-archive-content">
      <NewsSection />
      <MusicSection />
      <CommentsSection />
      <div className="secondary-archive-tools" aria-label="Portfolio extras">
        <span className="secondary-archive-tools-label">Small extras</span>
        <RoastButton />
        <TerminalMode />
        <MusicController />
      </div>
    </div>
  );
}
