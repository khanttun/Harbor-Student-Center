export function UpcomingEventsSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container px-4 mx-auto">
        {/* Heading skeleton */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="h-8 w-56 rounded-lg bg-muted-foreground/15 animate-pulse" />
          <div className="h-4 w-80 rounded-lg bg-muted-foreground/10 animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="aspect-210/297 w-full animate-pulse bg-muted-foreground/10" />
              <div className="flex flex-col gap-3 p-4">
                <div className="h-5 w-3/4 rounded bg-muted-foreground/10 animate-pulse" />
                <div className="h-4 w-full rounded bg-muted-foreground/10 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-muted-foreground/10 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
