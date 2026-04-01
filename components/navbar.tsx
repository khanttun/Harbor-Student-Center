"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/memories", label: "Memories" },
  { href: "/contact", label: "Contact" },
]

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
}

const mobileMenuVariants = {
  hidden: { opacity: 0, scaleY: 0, originY: 0, height: 0 },
  visible: { opacity: 1, scaleY: 1, originY: 0, height: "auto" },
  exit: { opacity: 0, scaleY: 0, originY: 0, height: 0 },
}

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-card/70 backdrop-blur-xl shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/harborlogo.jpg"
              alt="Harbor Logo"
              width={40}
              height={40}
              className="rounded-full object-cover border border-border group-hover:scale-105 transition-transform"
            />
            <motion.span
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              The Harbor
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <motion.div
              className="flex items-center gap-1 mr-4"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={linkVariants}>
                  <Link
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* --- ADMIN LOGIN BUTTON (DESKTOP) --- */}
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                <Lock className="h-3.5 w-3.5" />
                Admin Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/login">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" aria-label="Admin Login">
                <Lock className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-border pb-6 md:hidden"
            >
              <motion.div
                className="flex flex-col gap-1 pt-4"
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
              >
                {navLinks.map((link) => (
                  <motion.div key={link.href} variants={linkVariants}>
                    <Link
                      href={link.href}
                      className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div variants={linkVariants} className="px-4 pt-4 border-t border-border mt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full gap-2 justify-center" variant="outline">
                      <Lock className="h-4 w-4" />
                      Admin Portal
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}