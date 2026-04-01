"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Facebook } from "lucide-react"

export function ContactMethodsSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 
            className="mb-4 text-3xl font-bold text-foreground sm:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect with our community or reach out to our coordinators directly
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          {/* Left Side: Messenger Group Card */}
          <Card className="group relative overflow-hidden border-0 bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="relative flex flex-1 flex-col gap-6 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <MessageCircle className="h-7 w-7" />
              </div>

              <div className="flex-1">
                <h3 className="mb-2 text-2xl font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                  Join Our Messenger Group
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with other students, get updates on events, and stay informed about everything happening at our center. A welcoming space to ask questions and share experiences.
                </p>
              </div>

              <Button
                asChild
                className="mt-4 w-full sm:w-fit rounded-full bg-primary px-8 py-6 text-lg text-white hover:bg-primary/90 transition-all"
              >
                <Link href="https://m.me/ch/AbbgVeO_7EtUQRQp/" target="_blank" rel="noopener noreferrer">
                  Join Group
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Right Side: Merged Organizer Card with adjusted photo focus */}
          <Card className="group relative overflow-hidden border-0 bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Unified Image Header */}
            <div className="relative h-56 w-full overflow-hidden">
              <Image 
                src="images/katrina-floyd.jpg" 
                alt="Sayarma Katrina and Sayar Floyd" 
                fill 
                className="object-cover object-[center_80%] transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <h3 className="text-xl font-bold text-white">Our Coordinators</h3>
                <p className="text-white/80 text-sm">Always here for you</p>
              </div>
            </div>

            <CardContent className="relative p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Katrina's Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                      <Facebook className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-foreground">Sayarma Katrina</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic mb-1">Katrina Trask Graham</p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Link href="https://www.facebook.com/katrina.t.graham" target="_blank" rel="noopener noreferrer">
                      Contact Sayarma Katrina
                    </Link>
                  </Button>
                </div>

                {/* Floyd's Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                      <Facebook className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-foreground">Sayar Floyd</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic mb-1">Floyd S. Graham</p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Link href="https://www.facebook.com/fsgraham" target="_blank" rel="noopener noreferrer">
                      Contact Sayar Floyd
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}