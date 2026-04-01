import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export function MemoriesCtaSection() {
  return (
    <section className="py-20 px-4 bg-linear-to-r from-primary/10 via-accent/10 to-primary/10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Every moment here becomes a memory
        </h2>
        <p className="text-xl text-muted-foreground mb-8 text-balance">
          Come be part of the next one.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/events">
            <CalendarDays className="w-5 h-5 mr-2" />
            View Events
          </Link>
        </Button>
      </div>
    </section>
  );
}
