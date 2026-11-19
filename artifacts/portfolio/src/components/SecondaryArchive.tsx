import NewsSection from "@/components/NewsSection";
import MusicSection from "@/components/MusicSection";
import RoastButton from "@/components/RoastButton";
import TerminalMode from "@/components/TerminalMode";

export default function SecondaryArchive() {
  return (
    <div className="secondary-archive-content">
      <NewsSection />
      <MusicSection />
      <div className="secondary-archive-tools" aria-label="Portfolio extras">
        <span className="secondary-archive-tools-label">Sisi lain portfolio</span>
        <RoastButton />
        <TerminalMode />
      </div>
    </div>
  );
}
