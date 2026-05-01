"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const renderNavLink = ({ href, label }: (typeof navLinks)[number], mobile = false) => {
    const isActive = isActivePath(pathname, href)

    return (
      <Link
        href={href}
        className={cn(
          "transition-all duration-200",
          mobile
            ? "block rounded-2xl px-4 py-3 text-base font-medium"
            : "rounded-full px-4 py-2 text-sm font-medium",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    )
  }

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-card/80 shadow-md backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3 h-18">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/harborlogo.jpg"
              alt="Harbor Logo"
              width={44}
              height={44}
              className="object-cover transition-transform border rounded-full border-border bg-card group-hover:scale-105"
            />
            <div className="min-w-0">
              <motion.span
                className="block text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                The Harbor
              </motion.span>
              <span className="block text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Student Center
              </span>
            </div>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-3">
            <motion.div
              className="flex items-center gap-1 p-1"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={linkVariants}>
                  {renderNavLink(link)}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="pb-6 overflow-hidden border-t border-border md:hidden"
            >
              <motion.div
                className="flex flex-col gap-2 pt-4"
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
              >
                {navLinks.map((link) => (
                  <motion.div key={link.href} variants={linkVariants}>
                    {renderNavLink(link, true)}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}