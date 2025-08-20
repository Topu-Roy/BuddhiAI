"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const greetings: string[] = [
  "Science",
  "Stars",
  "Oceans",
  "Robots",
  "Dinosaurs",
  "Volcano",
  "Rainbow",
  "Gravity",
  "Water",
  "Sound",
  "Music",
  "Weather",
  "Animals",
  "Garden",
  "Books",
  "Space",
  "Bike",
  "Food",
  "Desert",
  "Earth",
  "Coffee",
  "Plants",
  "Light",
  "Time",
  "Air",
  "Island",
  "Stone",
  "Starlight",
  "Metal",
  "Movies",
  "Ice",
  "Clouds",
  "Forest",
  "Ocean",
  "River",
  "Tea",
  "Phone",
  "Energy",
  "Bridge",
  "Fire",
  "Sunset",
  "Train",
  "Camera",
  "Game",
  "Sport",
  "Mountain",
  "Cake",
  "Sunrise",
  "Car",
  "Moonlight",
];

const DynamicText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;

        return nextIndex % greetings.length;
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
        {greetings[currentIndex]}
      </motion.div>
    </AnimatePresence>
  );
};

export default DynamicText;
