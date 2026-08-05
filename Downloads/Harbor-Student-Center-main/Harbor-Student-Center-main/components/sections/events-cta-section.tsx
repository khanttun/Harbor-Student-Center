import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Camera } from "lucide-react";

export function EventsCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-[family-name:var(--font-heading)] text-balance">
          There&apos;s always something happening
        </h2>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Come join us!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-base font-semibold"
          >
            <Link href="/contact">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-base font-semibold bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <Link href="/memories">
              <Camera className="w-5 h-5 mr-2" />
              View Memories
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
