"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SHOW_AT_SCROLL_Y = 280

export function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > SHOW_AT_SCROLL_Y)
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <Button
            type="button"
            size="icon"
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className={cn(
                "fixed bottom-5 right-5 z-60 rounded-full cursor-pointer shadow-lg transition-all duration-300 sm:bottom-6 sm:right-6",
                isVisible
                    ? "translate-y-0 opacity-100 pointer-events-auto"
                    : "translate-y-3 opacity-0 pointer-events-none"
            )}
        >
            <ChevronUp className="w-5 h-5" />
        </Button>
    )
}
