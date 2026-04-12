import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Cake, CalendarDays, Drumstick, PartyPopper, Pizza } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";

type EventRecord = {
    id: string;
    title: string;
    date: string;
    description: string;
    image_url: string | null;
    category?: string | null;
};

const CATEGORY_LABELS = {
    birthday: "Birthday Celebrations",
    postExam: "Post-Exam Feast",
    holiday: "Holiday Gatherings",
    welcome: "Welcome Parties",
} as const;

function getEventCategory(event: EventRecord) {
    const source = `${event.category ?? ""} ${event.title}`.toLowerCase();

    if (source.includes("birthday")) {
        return "birthday" as const;
    }

    if (source.includes("post-exam") || source.includes("post exam") || source.includes("exam") || source.includes("feast")) {
        return "postExam" as const;
    }

    if (source.includes("holiday")) {
        return "holiday" as const;
    }

    if (source.includes("welcome") || source.includes("party")) {
        return "welcome" as const;
    }

    return "welcome" as const;
}

function getCategoryIcon(category: ReturnType<typeof getEventCategory>) {
    if (category === "birthday") {
        return Cake;
    }

    if (category === "postExam") {
        return Drumstick;
    }

    if (category === "holiday") {
        return Pizza;
    }

    return PartyPopper;
}

type EventDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("events")
        .select("id,title,date,description,image_url,category")
        .eq("id", id)
        .single();

    if (error || !data) {
        notFound();
    }

    const event = data as EventRecord;
    const category = getEventCategory(event);
    const Icon = getCategoryIcon(category);

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <section className="max-w-5xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
                <Link href="/events" className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                </Link>

                <div className="overflow-hidden border shadow-sm bg-card rounded-3xl border-border">
                    {event.image_url && (
                        <div className="relative w-full h-70 md:h-105 bg-muted">
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full shadow-sm left-6 bottom-6 bg-background/90 text-foreground">
                                <Icon className="w-4 h-4" />
                                {CATEGORY_LABELS[category]}
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-10">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold leading-tight md:text-5xl">{event.title}</h1>
                                <div className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                                    <CalendarDays className="w-4 h-4" />
                                    {new Date(event.date).toLocaleDateString(undefined, {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-border">
                            <h2 className="mb-4 text-lg font-semibold">Event Details</h2>
                            <p className="text-base leading-8 whitespace-pre-line text-muted-foreground">
                                {event.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
