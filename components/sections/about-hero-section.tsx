import Image from "next/image"

export function AboutHeroSection() {
  return (
    <section className="relative h-[50vh] min-h-[400px] w-full">
      <Image
        src="/images/about-hero.jpg"
        alt="Myanmar students gathering together as a community"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 to-foreground/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
          About Us
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl text-pretty">
          Built on kindness, community, and care
        </p>
      </div>
    </section>
  )
}
