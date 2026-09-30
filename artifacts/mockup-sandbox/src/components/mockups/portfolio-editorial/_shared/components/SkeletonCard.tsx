export function SkeletonNewsCard() {
  return (
    <div className="glass border border-white/8 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-full bg-white/10" />
          <div className="h-4 w-24 rounded-full bg-white/5" />
        </div>
        <div className="h-5 w-3/4 rounded bg-white/10" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded bg-white/5" />
          <div className="h-3.5 w-5/6 rounded bg-white/5" />
          <div className="h-3.5 w-4/6 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCommentCard() {
  return (
    <div className="glass border border-white/8 rounded-xl p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-3 items-center">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-3 w-16 rounded bg-white/5" />
          </div>
          <div className="h-3.5 w-full rounded bg-white/5" />
          <div className="h-3.5 w-3/4 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGitHubCard() {
  return (
    <div className="glass border border-white/8 rounded-2xl p-5 animate-pulse space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/10" />
          <div className="h-4 w-32 rounded bg-white/10" />
        </div>
        <div className="h-4 w-12 rounded-full bg-white/5" />
      </div>
      <div className="h-3.5 w-full rounded bg-white/5" />
      <div className="h-3.5 w-4/5 rounded bg-white/5" />
      <div className="flex gap-3 pt-1">
        <div className="h-3 w-16 rounded bg-white/5" />
        <div className="h-3 w-12 rounded bg-white/5" />
      </div>
    </div>
  );
}
