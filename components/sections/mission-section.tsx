import { Heart } from "lucide-react"

export function MissionSection() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
            <Heart className="h-8 w-8 text-secondary" />
          </div>
        </div>
        
        <h2 
          className="mb-6 text-3xl font-bold text-foreground sm:text-4xl text-balance"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Our Purpose
        </h2>
        
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          The Myanmar Student Center is a free, independent space created with love for Myanmar students 
          studying at Mae Fah Luang University. We are not affiliated with the university — we are simply 
          a community of people who want to give students a place to relax, eat, connect, and feel at home.
        </p>
        
        <blockquote className="relative rounded-2xl bg-card p-8 shadow-lg">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="text-6xl text-primary">&ldquo;</span>
          </div>
          <p 
            className="text-xl italic text-foreground sm:text-2xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            We do this because we love Myanmar people.
          </p>
        </blockquote>
      </div>
    </section>
  )
}
