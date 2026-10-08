import { useState, useEffect } from "react";
import { Github, Star, GitFork, ExternalLink, Code2 } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";
import { SkeletonGitHubCard } from "./SkeletonCard";

const GITHUB_USERNAME = "Reyhan-irza";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  homepage: string | null;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-[#a43f2d]",
  JavaScript: "bg-[#a43f2d]",
  Python:     "bg-[#a43f2d]",
  Rust:       "bg-[#a43f2d]",
  Go:         "bg-[#a43f2d]",
  Java:       "bg-[#a43f2d]",
  "C++":      "bg-[#a43f2d]",
  CSS:        "bg-[#a43f2d]",
  HTML:       "bg-[#a43f2d]",
  Vue:        "bg-[#a43f2d]",
  Kotlin:     "bg-[#a43f2d]",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "hari ini";
  if (days === 1) return "kemarin";
  if (days < 30) return `${days} hari lalu`;
  if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;
  return `${Math.floor(days / 365)} tahun lalu`;
}

function RepoCard({ repo, delay }: { repo: Repo; delay: number }) {
  const ref = useScrollAnim<HTMLAnchorElement>({ threshold: 0.1, delay });
  const langColor = repo.language ? (LANG_COLORS[repo.language] || "bg-[#a43f2d]") : null;

  return (
    <a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="fade-up glass border border-[rgba(33,31,27,.16)] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#a43f2d] hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-[#a43f2d] flex-shrink-0" />
          <span className="text-[#211f1b] font-semibold text-sm truncate group-hover:text-[#a43f2d] transition-colors">
            {repo.name}
          </span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-[#6d6a62] group-hover:text-[#a43f2d] transition-colors flex-shrink-0 mt-0.5" />
      </div>

      <p className="text-[#6d6a62] text-xs leading-relaxed flex-1 line-clamp-2">
        {repo.description || "Tidak ada deskripsi."}
      </p>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-[#a43f2d]/10 border border-[#a43f2d]/20 text-[#a43f2d]">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-[#6d6a62] text-xs">
        {repo.language && langColor && (
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${langColor}`} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" /> {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" /> {repo.forks_count}
          </span>
        )}
        <span className="ml-auto">{formatDate(repo.updated_at)}</span>
      </div>
    </a>
  );
}

export default function GitHubSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });
  const [repos,   setRepos]   = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [stats,   setStats]   = useState<{ public_repos: number; followers: number; following: number } | null>(null);
  const statsRef = useScrollAnim<HTMLDivElement>({
    threshold: 0.18,
    stagger: 0.08,
    distance: 14,
    refreshKey: stats ? "loaded" : "pending",
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [repoRes, userRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=public`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        ]);
        if (!repoRes.ok || !userRes.ok) throw new Error("GitHub API error");
        const [repoData, userData] = await Promise.all([repoRes.json(), userRes.json()]);
        if (alive) {
          setRepos(repoData.filter((r: Repo) => !r.name.includes(".github")));
          setStats({ public_repos: userData.public_repos, followers: userData.followers, following: userData.following });
          setLoading(false);
        }
      } catch {
        if (alive) { setError(true); setLoading(false); }
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!loading && error) return null;

  return (
    <section id="github" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div ref={headerRef} className="fade-up text-center mb-14">
          <p data-motion-item className="text-[#a43f2d] text-sm font-semibold uppercase tracking-widest mb-3">Open Source</p>
          <h2 data-motion-item className="text-3xl md:text-5xl font-bold text-[#211f1b] mb-4">
            GitHub <span className="text-[#a43f2d]">Activity</span>
          </h2>
          <div data-motion-item className="rgb-divider w-24 mx-auto mb-5" />
          <p data-motion-item className="text-[#6d6a62] max-w-md mx-auto text-base">
            Repository terbaru dan aktivitas coding saya di GitHub.
          </p>
        </div>

        {/* Stats bar */}
        {stats && (
          <div ref={statsRef} className="flex justify-center gap-6 md:gap-10 mb-10">
            {[
              { label: "Repositories", value: stats.public_repos },
              { label: "Followers",    value: stats.followers    },
              { label: "Following",    value: stats.following    },
            ].map(({ label, value }) => (
              <div key={label} data-motion-item className="text-center">
                <p className="text-2xl font-black text-[#a43f2d] tabular-nums">{value}</p>
                <p className="text-[#6d6a62] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Repo grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonGitHubCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((r, i) => <RepoCard key={r.id} repo={r} delay={i * 60} />)}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl glass border border-[rgba(33,31,27,.16)] text-[#6d6a62] hover:text-[#211f1b] hover:border-[#a43f2d] transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium"
          >
            <Github className="w-4 h-4" /> Lihat semua di GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
