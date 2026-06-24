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
  TypeScript: "bg-blue-400",
  JavaScript: "bg-yellow-400",
  Python:     "bg-green-400",
  Rust:       "bg-orange-500",
  Go:         "bg-cyan-400",
  Java:       "bg-red-400",
  "C++":      "bg-pink-400",
  CSS:        "bg-purple-400",
  HTML:       "bg-orange-400",
  Vue:        "bg-emerald-400",
  Kotlin:     "bg-violet-400",
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
  const langColor = repo.language ? (LANG_COLORS[repo.language] || "bg-white/30") : null;

  return (
    <a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="fade-up glass border border-white/8 rounded-2xl p-5 flex flex-col gap-3 hover:border-violet-500/30 hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
          <span className="text-white font-semibold text-sm truncate group-hover:text-violet-300 transition-colors">
            {repo.name}
          </span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-violet-400 transition-colors flex-shrink-0 mt-0.5" />
      </div>

      <p className="text-white/45 text-xs leading-relaxed flex-1 line-clamp-2">
        {repo.description || "Tidak ada deskripsi."}
      </p>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-white/30 text-xs">
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
          <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Open Source</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            GitHub <span className="gradient-text">Activity</span>
          </h2>
          <div className="rgb-divider w-24 mx-auto mb-5" />
          <p className="text-white/50 max-w-md mx-auto text-base">
            Repository terbaru dan aktivitas coding saya di GitHub.
          </p>
        </div>

        {/* Stats bar */}
        {stats && (
          <div className="flex justify-center gap-6 md:gap-10 mb-10">
            {[
              { label: "Repositories", value: stats.public_repos },
              { label: "Followers",    value: stats.followers    },
              { label: "Following",    value: stats.following    },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black gradient-text tabular-nums">{value}</p>
                <p className="text-white/35 text-xs mt-0.5">{label}</p>
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
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl glass border border-white/10 text-white/60 hover:text-white hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium"
          >
            <Github className="w-4 h-4" /> Lihat semua di GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
