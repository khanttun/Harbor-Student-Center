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
  { href: "/login", label: "Admin Setting" },
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
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">

          {/* Logo - Stacked Layout */}
          <Link href="/" onClick={handleLogoClick} className="flex flex-col items-center gap-4 text-center group">
            <div className="relative w-32 h-32 overflow-hidden transition-transform rounded-full shadow-xl group-hover:scale-105">
              <Image
                src="/harborlogo.jpg"
                alt="The Harbor Student Center Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              The Harbor Student Center
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
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
                className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center w-full gap-2 pt-8 border-t border-border/50">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Made with <Heart className="w-4 h-4 fill-secondary text-secondary" /> for Myanmar students
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