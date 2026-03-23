"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Facebook } from "lucide-react"

interface ContactMethodCardProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonText: string
  buttonLink: string
  people?: Array<{ name: string; role?: string }>
}

function ContactMethodCard({
  icon,
  title,
  description,
  buttonText,
  buttonLink,
  people,
}: ContactMethodCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardContent className="relative flex flex-col gap-6 p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>

        <div>
          <h3 className="mb-2 text-2xl font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {people && people.length > 0 && (
          <div className="space-y-3 border-t border-border pt-4">
            {people.map((person, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium text-foreground">{person.name}</p>
                {person.role && <p className="text-muted-foreground">{person.role}</p>}
              </div>
            ))}
          </div>
        )}

        <Button
          asChild
          className="mt-4 rounded-full bg-primary px-6 text-white hover:bg-primary/90 transition-all"
        >
          <Link href={buttonLink} target="_blank" rel="noopener noreferrer">
            {buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function ContactMethodsSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 
            className="mb-4 text-3xl font-bold text-foreground sm:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose your preferred way to connect with us
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Messenger Group Card */}
          <ContactMethodCard
            icon={<MessageCircle className="h-7 w-7" />}
            title="Join Our Messenger Group"
            description="Connect with other students, get updates on events, and stay informed about everything happening at our center. A welcoming space to ask questions and share experiences."
            buttonText="Join Group"
            buttonLink="https://m.me/groups/placeholder"
          />

          {/* Facebook Profiles Card */}
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h3 
                className="mb-2 text-2xl font-semibold text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Reach Us on Facebook
              </h3>
              <p className="text-muted-foreground">
                Connect with our coordinators directly
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="group relative overflow-hidden border-0 bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardContent className="relative flex flex-col gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Facebook className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Katerina Trask Graham</h4>
                    <p className="text-sm text-muted-foreground">Community Coordinator</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary/10"
                  >
                    <Link href="https://facebook.com/katerina.trask" target="_blank" rel="noopener noreferrer">
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardContent className="relative flex flex-col gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Facebook className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Floyd S. Graham</h4>
                    <p className="text-sm text-muted-foreground">Program Manager</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary/10"
                  >
                    <Link href="https://facebook.com/floyd.graham" target="_blank" rel="noopener noreferrer">
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
