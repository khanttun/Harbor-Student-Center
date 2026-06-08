"use client";

import { Heart, MessageCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect } from "react";

/**
 * BACKEND SETUP REQUIRED:
 * 
 * 1. Create a Supabase table called "kindness_notes" with the following schema:
 *    - id (uuid, primary key)
 *    - student_name (text, required)
 *    - message (text, required)
 *    - recipient (text, constant: 'katrina & floyd', required)
 *    - created_at (timestamp, default: now())
 *    - updated_at (timestamp, default: now())
 *    - is_approved (boolean, default: false) - for moderation purposes
 * 
 * 2. Create a backend API endpoint POST /api/kindness-notes that:
 *    - Accepts: { student_name: string, message: string }
 *    - Stores the note in the kindness_notes table with is_approved: false and recipient: 'katrina & floyd'
 *    - Returns success/error response
 * 
 * 3. Create a backend endpoint GET /api/kindness-notes that:
 *    - Returns only approved notes
 *    - Orders by created_at descending (newest first)
 *    - Returns array of: { id, student_name, message, created_at }
 */

interface KindnessNote {
  id: string;
  student_name: string;
  message: string;
  created_at: string;
}

export function KindnessNotesSection() {
  const [notes, setNotes] = useState<KindnessNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual backend API call
        // const response = await fetch(`/api/kindness-notes`);
        // const data = await response.json();
        // setNotes(data);

        // Mock data for demonstration (remove after backend is ready)
        const mockNotes: KindnessNote[] = [
          {
            id: "1",
            student_name: "Sarah Johnson",
            message: "Thank you for always being there to listen and support us. Your kindness means the world!",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "2",
            student_name: "Marcus Chen",
            message: "I really appreciate all the guidance and encouragement. You've helped me grow so much.",
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "3",
            student_name: "Emma Williams",
            message: "Your passion and dedication inspire us all. Thank you for everything you do!",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "4",
            student_name: "David Park",
            message: "You both make such a difference in our lives. We are so grateful for you!",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "5",
            student_name: "Olivia Martinez",
            message: "Thank you for believing in us when we didn't believe in ourselves.",
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        setNotes(mockNotes);
      } catch (error) {
        console.error("Failed to fetch kindness notes:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? notes.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === notes.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative py-16 overflow-hidden md:py-20 bg-gradient-to-b from-background via-amber-50/30 to-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl -ml-48 -mb-48" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500 sm:h-6 sm:w-6" />
            <h2
              className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Messages of Appreciation
            </h2>
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500 sm:h-6 sm:w-6" />
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Read the kind words students have left for Sayarma Katrina and Sayar Floyd
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : notes.length > 0 ? (
          <>
            {/* Slideshow View */}
            {!isExpanded ? (
              <div className="mb-8">
                {/* Single Message Card with Slideshow */}
                <div
                  key={notes[currentSlide].id}
                  className="group relative"
                  style={{
                    animation: `fadeInScale 0.5s ease-out`,
                  }}
                >
                  {/* Background card with border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-50/50 to-amber-50/50 dark:from-rose-950/20 dark:to-amber-950/20 rounded-2xl border border-rose-200/50 dark:border-rose-900/30 shadow-md group-hover:shadow-lg transition-shadow duration-300" />

                  {/* Content */}
                  <div className="relative p-5 sm:p-8 md:p-10">
                    {/* Top section with icon and name */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shadow-md">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="flex-grow">
                        <h3
                          className="text-lg font-bold text-foreground"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {notes[currentSlide].student_name}
                        </h3>
                        <time className="text-sm text-muted-foreground">
                          {formatDate(notes[currentSlide].created_at)}
                        </time>
                      </div>

                      {/* Decorative hearts in corner */}
                      <div className="text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Heart className="w-5 h-5 fill-current" />
                      </div>
                    </div>

                    {/* Message */}
                    <p className="mb-8 flex min-h-[80px] items-center text-base italic leading-relaxed text-foreground sm:min-h-[100px] sm:text-lg">
                      "{notes[currentSlide].message}"
                    </p>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between pt-6 border-t border-rose-200/30 dark:border-rose-900/20">
                      <button
                        onClick={handlePrevSlide}
                        className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors duration-200"
                        aria-label="Previous message"
                      >
                        <ChevronLeft className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                      </button>

                      {/* Slide indicator */}
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                          {currentSlide + 1} / {notes.length}
                        </p>
                        <div className="flex gap-1 justify-center mt-2">
                          {notes.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                  ? "bg-rose-500 w-6"
                                  : "bg-rose-200 dark:bg-rose-900/30 w-2 hover:bg-rose-300"
                              }`}
                              aria-label={`Go to message ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleNextSlide}
                        className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors duration-200"
                        aria-label="Next message"
                      >
                        <ChevronRight className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                      </button>
                    </div>
                  </div>

                  {/* Left border accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-amber-500 rounded-l-2xl group-hover:w-1.5 transition-all duration-300" />
                </div>

                {/* See More Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-full font-semibold transition-all duration-200"
                  >
                    See All Messages
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Expanded View - Show All Messages */
              <div className="mb-8">
                {/* See Less Button */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-full font-semibold transition-all duration-200"
                  >
                    Show Slideshow
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>

                {/* All Messages Grid */}
                <div className="space-y-4">
                  {notes.map((note, index) => (
                    <div
                      key={note.id}
                      className="group relative"
                      style={{
                        animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      {/* Background card with border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-50/50 to-amber-50/50 dark:from-rose-950/20 dark:to-amber-950/20 rounded-xl border border-rose-200/50 dark:border-rose-900/30 shadow-sm group-hover:shadow-md transition-shadow duration-300" />

                      {/* Content */}
                      <div className="relative p-6">
                        {/* Top section with icon and name */}
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shadow-md">
                              <MessageCircle className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                              <h3
                                className="text-sm font-bold text-foreground"
                                style={{ fontFamily: "var(--font-heading)" }}
                              >
                                {note.student_name}
                              </h3>
                              <time className="text-xs text-muted-foreground">
                                {formatDate(note.created_at)}
                              </time>
                            </div>
                          </div>

                          {/* Decorative hearts in corner */}
                          <div className="text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Heart className="w-4 h-4 fill-current" />
                          </div>
                        </div>

                        {/* Message */}
                        <p className="py-1 pl-0 text-base leading-relaxed text-foreground sm:pl-14">
                          "{note.message}"
                        </p>
                      </div>

                      {/* Left border accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-amber-500 rounded-l-xl group-hover:w-1.5 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to action */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Want to leave a message of your own?</p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Heart className="w-5 h-5" />
                Leave a Note
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-12 px-6">
            <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground text-lg">
              No messages yet. Be the first to share your appreciation!
            </p>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
