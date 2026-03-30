"use client";

import Image from "next/image";
import { useState } from "react";
import { Leaf, TreeDeciduous } from "lucide-react";

interface Memory {
  id: number;
  title: string;
  date: string;
  caption: string;
  image: string;
}

interface MemoriesByYear {
  [year: string]: Memory[];
}

const memoriesByYear: MemoriesByYear = {
  "2026": [
    {
      id: 1,
      title: "Spring Welcome Party",
      date: "March 2026",
      caption: "Welcoming new students with open arms and warm hearts",
      image: "/images/welcome-event.jpg",
    },
  ],
  "2025": [
    {
      id: 2,
      title: "Birthday Celebrations",
      date: "January - March 2025",
      caption: "Every birthday is a reason to come together and celebrate life",
      image: "/images/birthday-1.jpg",
    },
    {
      id: 3,
      title: "Pizza Night",
      date: "February 2025",
      caption: "Simple joys - good pizza, great company, endless conversations",
      image: "/images/pizza-night-1.jpg",
    },
    {
      id: 4,
      title: "150 Fried Chicken Celebration",
      date: "March 2025",
      caption: "The legendary post-exam feast that brought everyone together",
      image: "/images/chicken-1.jpg",
    },
  ],
  "2024": [
    {
      id: 5,
      title: "Halloween Night",
      date: "October 2024",
      caption: "A spooky night full of costumes, laughter, and unforgettable fun",
      image: "/images/halloween-1.jpg",
    },
    {
      id: 6,
      title: "Thanksgiving Dinner",
      date: "November 2024",
      caption: "Grateful hearts gathered around a table full of love and turkey",
      image: "/images/thanksgiving-1.jpg",
    },
    {
      id: 7,
      title: "End of Semester Feast",
      date: "December 2024",
      caption: "Celebrating the end of exams with food, friends, and freedom",
      image: "/images/semester-feast-1.jpg",
    },
  ],
  "2023": [
    {
      id: 8,
      title: "First Gathering",
      date: "September 2023",
      caption: "Where it all began - our first community meal together",
      image: "/images/memory-1.jpg",
    },
    {
      id: 9,
      title: "Holiday Dinner",
      date: "December 2023",
      caption: "Ending the year with warmth, gratitude, and new friendships",
      image: "/images/holiday-event.jpg",
    },
  ],
};

const years = Object.keys(memoriesByYear).sort((a, b) => Number(b) - Number(a));

function YearSelector({
  selectedYear,
  onSelectYear,
}: {
  selectedYear: string;
  onSelectYear: (year: string) => void;
}) {
  return (
    <div className="flex justify-center mb-12">
      <div className="flex gap-2 p-1.5 bg-card rounded-full shadow-md border border-border overflow-x-auto max-w-full">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
              selectedYear === year
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}

function MemoryCard({
  memory,
  side,
}: {
  memory: Memory;
  side: "left" | "right";
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div
        className={`relative flex items-center ${
          side === "left" ? "md:flex-row-reverse" : "md:flex-row"
        } flex-col md:gap-8 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500`}
      >
        {/* Branch line for desktop */}
        <div
          className={`hidden md:block absolute top-1/2 w-16 h-0.5 bg-linear-to-r ${
            side === "left"
              ? "right-1/2 from-transparent to-green-400"
              : "left-1/2 from-green-400 to-transparent"
          }`}
        />

        {/* Leaf node */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-green-400 rounded-full items-center justify-center shadow-lg z-10">
          <Leaf className="w-5 h-5 text-white" />
        </div>

        {/* Content card */}
        <div
          className={`w-full md:w-5/12 ${
            side === "left" ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
          }`}
        >
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Single Image */}
            <div
              className="relative aspect-[16/10] overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(memory.image)}
            >
              <Image
                src={memory.image}
                alt={memory.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="p-5">
              <span className="text-sm text-primary font-medium">
                {memory.date}
              </span>
              <h3
                className="text-xl font-bold text-foreground mt-1 mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {memory.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {memory.caption}
              </p>
            </div>
          </div>
        </div>

        {/* Empty space for the other side */}
        <div className="hidden md:block w-5/12" />
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Image
              src={selectedImage}
              alt="Enlarged photo"
              width={1200}
              height={800}
              className="object-contain w-full h-full rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function TimelineTreeSection() {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const memories = memoriesByYear[selectedYear] || [];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Unique tree-inspired background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient sky to ground */}
        <div className="absolute inset-0 bg-linear-to-b from-green-50/50 via-background to-amber-50/30" />
        
        {/* Subtle tree bark texture on sides */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-amber-100/40 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-amber-100/40 to-transparent" />
        
        {/* Floating leaves decoration */}
        <div className="absolute top-20 left-[10%] text-green-300/40 animate-pulse">
          <Leaf className="w-20 h-20 rotate-45" />
        </div>
        <div className="absolute top-40 right-[15%] text-green-200/30 animate-pulse" style={{ animationDelay: "1s" }}>
          <Leaf className="w-16 h-16 -rotate-12" />
        </div>
        <div className="absolute top-[60%] left-[8%] text-green-300/25 animate-pulse" style={{ animationDelay: "0.5s" }}>
          <Leaf className="w-14 h-14 rotate-90" />
        </div>
        <div className="absolute top-[30%] right-[8%] text-green-200/35 animate-pulse" style={{ animationDelay: "1.5s" }}>
          <Leaf className="w-12 h-12 rotate-180" />
        </div>
        <div className="absolute bottom-40 right-[12%] text-green-300/30 animate-pulse" style={{ animationDelay: "2s" }}>
          <Leaf className="w-18 h-18 -rotate-45" />
        </div>
        <div className="absolute bottom-60 left-[15%] text-amber-200/30">
          <Leaf className="w-10 h-10 rotate-135" />
        </div>
        
        {/* Tree silhouette decorations */}
        <div className="absolute bottom-0 left-[5%] text-green-200/20">
          <TreeDeciduous className="w-32 h-32" />
        </div>
        <div className="absolute bottom-0 right-[5%] text-green-200/15">
          <TreeDeciduous className="w-40 h-40" />
        </div>
        
        {/* Ground gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-amber-100/50 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Year Selector */}
        <YearSelector selectedYear={selectedYear} onSelectYear={setSelectedYear} />

        {/* Tree trunk - vertical line */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-32 bottom-0 w-1.5 bg-gradient-to-b from-green-300 via-green-400 to-amber-600 rounded-full shadow-sm" />

        {/* Tree top decoration */}
        <div className="hidden md:flex justify-center mb-12">
          <div className="bg-linear-to-br from-green-400 to-green-500 rounded-full p-4 shadow-lg ring-4 ring-green-200/50">
            <TreeDeciduous className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Mobile indicator */}
        <div className="md:hidden flex justify-center mb-8">
          <div className="bg-linear-to-br from-green-400 to-green-500 rounded-full p-3 shadow-lg">
            <TreeDeciduous className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Memory cards */}
        <div className="space-y-12 md:space-y-16" key={selectedYear}>
          {memories.length > 0 ? (
            memories.map((memory, index) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                side={index % 2 === 0 ? "left" : "right"}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No memories yet for {selectedYear}</p>
            </div>
          )}
        </div>

        {/* Tree root decoration */}
        <div className="hidden md:flex justify-center mt-12">
          <div className="relative">
            <div className="w-24 h-12 bg-linear-to-t from-amber-700 via-amber-600 to-amber-500 rounded-b-full shadow-md" />
            <div className="absolute -left-4 bottom-0 w-8 h-6 bg-linear-to-tr from-amber-700 to-amber-600 rounded-bl-full" />
            <div className="absolute -right-4 bottom-0 w-8 h-6 bg-linear-to-tl from-amber-700 to-amber-600 rounded-br-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
