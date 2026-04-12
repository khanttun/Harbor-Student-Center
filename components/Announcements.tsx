"use client";

import React from "react";
import { Megaphone, CalendarHeart, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

const announcement = {
  id: "1",
  title: "The Harbor Opens This Tuesday",
  content: "Come by anytime between 3PM and 7PM. Everyone is welcome!",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Announcements() {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="p-8 bg-card rounded-3xl shadow-xl border border-border"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-primary/10 text-primary rounded-2xl">
          <Megaphone className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
          Latest Announcements
        </h2>
      </motion.div>

      <div className="space-y-6">
        {announcement && (
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-muted/50 rounded-2xl border border-border hover:border-primary/20 transition-colors"
          >
            <h3 className="font-bold text-xl text-foreground mb-2">
              {announcement.title}
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg">
              {announcement.content}
            </p>
          </motion.div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="p-6 bg-primary/5 border border-primary/10 rounded-2xl transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4 text-primary">
              <ChefHat className="w-6 h-6" />
              <h3 className="font-bold text-lg">Saturday Feast</h3>
            </div>
            <p className="text-foreground/80 text-base leading-relaxed">
              Join us this Saturday for a delicious feast featuring Pizza and Fried Rice!
              Make sure you check your schedule and don&apos;t miss out on the incredible food.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="p-6 bg-secondary/5 border border-secondary/10 rounded-2xl transition-shadow hover:shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-4 text-secondary">
              <CalendarHeart className="w-6 h-6" />
              <h3 className="font-bold text-lg">Post-Exam Treat</h3>
            </div>
            <p className="text-secondary-foreground/90 font-bold mb-2 relative z-10">
              🎉 Special Highlight: 150 Fried Chickens!
            </p>
            <p className="text-muted-foreground text-sm relative z-10 leading-relaxed">
              Celebrate the end of exams with an ultimate treat! Brought to you by the Harbor Student Center.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
