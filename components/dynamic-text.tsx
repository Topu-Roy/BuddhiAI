"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const topics: string[] = [
  "Ancient Civilizations",
  "World War II",
  "Modern Art",
  "Literature",
  "Human Anatomy",
  "Microeconomics",
  "Macroeconomics",
  "Political Theory",
  "Ethics",
  "Philosophy of Mind",
  "Environment Science",
  "Astronomy",
  "Organic Chemistry",
  "Cell Biology",
  "Genetics",
  "World Geography",
  "Classical Music",
  "Linguistics",
  "Archaeology",
  "Computer Algorithms",
  "Artificial Intelligence",
  "Mathematical Logic",
  "Human Physiology",
  "Sociology",
  "Cultural Studies",
  "Modern History",
  "Geology",
  "Oceanography",
  "Neuroscience",
  "Psychology",
];

const DynamicText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;

        return nextIndex % topics.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={currentIndex}
        aria-live="off"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="h-2 w-2 rounded-full" aria-hidden="true" />
        {topics[currentIndex]}
      </motion.div>
    </AnimatePresence>
  );
};

export default DynamicText;
