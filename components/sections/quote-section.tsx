export function QuoteSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-primary/5">
      <div className="max-w-4xl mx-auto text-center">
        <blockquote className="relative">
          <span className="absolute -top-6 -left-2 text-8xl text-primary/20 font-serif">&ldquo;</span>
          <p className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-relaxed text-balance">
            We do this because we love Myanmar people.
          </p>
          <span className="absolute -bottom-10 -right-2 text-8xl text-primary/20 font-serif">&rdquo;</span>
        </blockquote>
        <p className="mt-8 text-muted-foreground">
          — Katerina & Floyd Graham
        </p>
      </div>
    </section>
  )
}
