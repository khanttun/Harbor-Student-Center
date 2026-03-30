"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Facebook, MessageCircle } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/memories", label: "Memories" },
  { href: "/contact", label: "Contact" },
]

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://m.me", label: "Messenger", icon: MessageCircle },
]

export function Footer() {
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          
          {/* Logo - Stacked Layout */}
          <Link href="/" onClick={handleLogoClick} className="flex flex-col items-center gap-4 text-center group">
            <div className="relative h-32 w-32 rounded-full overflow-hidden transition-transform group-hover:scale-105 shadow-xl">
              <Image
                src="/harborlogo.jpg"
                alt="The Harbor Student Center Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              The Harbor Student Center
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center gap-2 border-t border-border/50 pt-8 w-full">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 fill-secondary text-secondary" /> for Myanmar students
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} The Harbor Student Center. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}