import Image from "next/image"
import { SectionHeading } from "@/components/section-heading"

interface ProfileCardProps {
  name: string
  role: string
  bio: string
  imageSrc: string
}

function ProfileCard({ name, role, bio, imageSrc }: ProfileCardProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] relative">
        <Image
          src={imageSrc}
          alt={`Portrait of ${name}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-foreground mb-1">
          {name}
        </h3>
        <p className="text-primary font-medium text-sm mb-3">{role}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">{bio}</p>
      </div>
    </div>
  )
}

export function PeopleSection() {
  const profiles = [
    {
      name: "Katerina Trask Graham",
      role: "Co-founder & Host",
      bio: "With a heart full of love for Myanmar students, Katerina opens her home every week to provide warm meals, a listening ear, and a safe space. Her generosity and maternal care have touched the lives of countless students who now consider her family.",
      imageSrc: "/images/katerina.jpg"
    },
    {
      name: "Floyd S. Graham",
      role: "Co-founder & Host",
      bio: "Floyd works alongside Katerina to ensure every student who walks through their door feels welcome. His dedication to running activities, organizing events, and supporting students in need has made the center what it is today.",
      imageSrc: "/images/floyd.jpg"
    }
  ]

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="The People Behind the Community"
          subtitle="Meet the hearts that make this home"
        />
        
        <div className="grid md:grid-cols-2 gap-8">
          {profiles.map((profile) => (
            <ProfileCard key={profile.name} {...profile} />
          ))}
        </div>
      </div>
    </section>
  )
}
