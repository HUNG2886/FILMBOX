export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
      <div className="h-16 animate-pulse rounded-2xl border border-card-border bg-card" />

      <div className="mt-5 animate-pulse rounded-2xl border border-card-border bg-card p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
          <div className="aspect-[2/3] rounded-xl bg-card-elevated" />
          <div className="space-y-3">
            <div className="h-7 w-3/4 rounded bg-card-elevated" />
            <div className="h-4 w-24 rounded bg-card-elevated" />
            <div className="h-4 w-full rounded bg-card-elevated" />
            <div className="h-4 w-[92%] rounded bg-card-elevated" />
            <div className="h-4 w-[84%] rounded bg-card-elevated" />
          </div>
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, sectionIdx) => (
        <div key={sectionIdx} className="mt-8">
          <div className="mb-4 h-6 w-48 animate-pulse rounded bg-card" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((__, cardIdx) => (
              <div
                key={cardIdx}
                className="aspect-[2/3] animate-pulse rounded-xl border border-card-border bg-card"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
