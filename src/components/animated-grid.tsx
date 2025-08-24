"use client";

import React, { useEffect, useState } from "react";
import { USER_IMG } from "@/assets/AssetUrl";
import { BrainIcon, Share2Icon, Sparkles, SparklesIcon, TrophyIcon, ZapIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";

export function FeaturesBentoGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="mb-12 text-center sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="from-primary/20 to-primary/10 border-primary/30 mb-6 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2"
        >
          <Sparkles className="text-primary h-4 w-4 animate-pulse" />
          <span className="text-primary text-sm font-semibold">Features That Rock</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl dark:text-neutral-100"
        >
          Why BuddhiAI{" "}
          <span className="from-primary animate-pulse bg-gradient-to-r via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Rocks
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400"
        >
          Experience the future of learning with features designed to make you smarter, faster ⚡
        </motion.p>
      </div>
      <BentoGrid className="mx-auto max-w-4xl md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </>
  );
}

/* Skeletons remain unchanged structurally — only text inside them should reflect BuddhiAI’s vibe. */

const SkeletonOne = () => {
  // same as before...
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };
  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-white p-2 dark:border-white/[0.2] dark:bg-black"
      >
        <div className="from-accent to-primary h-6 w-6 shrink-0 rounded-full bg-gradient-to-r" />
        <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-neutral-900" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="ml-auto flex w-3/4 flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-white p-2 dark:border-white/[0.2] dark:bg-black"
      >
        <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-neutral-900" />
        <div className="from-accent to-primary h-6 w-6 shrink-0 rounded-full bg-gradient-to-r" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-white p-2 dark:border-white/[0.2] dark:bg-black"
      >
        <div className="from-accent to-primary h-6 w-6 shrink-0 rounded-full bg-gradient-to-r" />
        <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-neutral-900" />
      </motion.div>
    </motion.div>
  );
};

const SkeletonTwo = () => {
  // unchanged layout
  const variants = {
    initial: { width: 0 },
    animate: { width: "100%", transition: { duration: 0.2 } },
    hover: { width: ["0%", "100%"], transition: { duration: 2 } },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"skeleton-two" + i}
          variants={variants}
          style={{ maxWidth: Math.random() * (100 - 40) + 40 + "%" }}
          className="flex h-4 w-full flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-neutral-100 p-2 dark:border-white/[0.2] dark:bg-black"
        ></motion.div>
      ))}
    </motion.div>
  );
};

const SkeletonThree = () => {
  // unchanged layout
  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: { backgroundPosition: ["0, 50%", "100% 50%", "0 50%"] },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2 rounded-lg"
      style={{
        background: "linear-gradient(-45deg, #148cdb, #1135aa, #0daf3e, #10c269)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};

const SkeletonFour = () => {
  // avatars and text replaced to reflect quiz/brain context
  const first = { initial: { x: 20, rotate: -5 }, hover: { x: 0, rotate: 0 } };
  const second = { initial: { x: -20, rotate: 5 }, hover: { x: 0, rotate: 0 } };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/[0.1] dark:bg-black"
      >
        <Image src={USER_IMG.user1} alt="avatar" width={40} height={40} className="h-10 w-10 rounded-full" />
        <p className="mt-4 text-center text-xs font-semibold text-neutral-500 sm:text-sm">
          “I guessed all answers.”
        </p>
        <p className="mt-4 rounded-full border border-red-500 bg-red-100 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/20">
          Unlucky
        </p>
      </motion.div>
      <motion.div className="relative z-20 flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/[0.1] dark:bg-black">
        <Image src={USER_IMG.user2} width={40} height={40} alt="avatar" className="h-10 w-10 rounded-full" />
        <p className="mt-4 text-center text-xs font-semibold text-neutral-500 sm:text-sm">“Scored 10/10 again!”</p>
        <p className="mt-4 rounded-full border border-green-500 bg-green-100 px-2 py-0.5 text-xs text-green-600 dark:bg-green-900/20">
          Brainiac
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/[0.1] dark:bg-black"
      >
        <Image src={USER_IMG.user3} width={40} height={40} alt="avatar" className="h-10 w-10 rounded-full" />
        <p className="mt-4 text-center text-xs font-semibold text-neutral-500 sm:text-sm">
          “Beat my friend&apos;s score!”
        </p>
        <p className="mt-4 rounded-full border border-orange-500 bg-orange-100 px-2 py-0.5 text-xs text-orange-600 dark:bg-orange-900/20">
          Champion
        </p>
      </motion.div>
    </motion.div>
  );
};

const SkeletonFive = () => {
  const variants = { initial: { x: 0 }, animate: { x: 10, rotate: 5, transition: { duration: 0.2 } } };
  const variantsSecond = { initial: { x: 0 }, animate: { x: -10, rotate: -5, transition: { duration: 0.2 } } };
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row items-start space-x-2 rounded-2xl border border-neutral-100 bg-white p-2 dark:border-white/[0.2] dark:bg-black"
      >
        <Image src={USER_IMG.user4} width={40} height={40} alt="avatar" className="h-10 w-10 rounded-full" />
        <p className="text-xs text-neutral-500">“Loved how quick the AI made my quiz!”</p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="ml-auto flex w-3/4 flex-row items-center justify-end space-x-2 rounded-full border border-neutral-100 bg-white p-2 dark:border-white/[0.2] dark:bg-black"
      >
        <p className="text-xs text-neutral-500">“Challenge accepted.”</p>
        <div className="from-accent to-primary h-6 w-6 shrink-0 rounded-full bg-gradient-to-r" />
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "AI Quiz Generation",
    description: <span className="text-sm">Type a topic and let BuddhiAI craft quizzes instantly.</span>,
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <BrainIcon className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Smart Explanations",
    description: <span className="text-sm">Learn as you play with AI-powered answer insights.</span>,
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <SparklesIcon className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Endless Topics",
    description: <span className="text-sm">From math to memes — quizzes on anything you imagine.</span>,
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <ZapIcon className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Compete & Climb",
    description: <span className="text-sm">Challenge friends, track scores, and top the leaderboard.</span>,
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <TrophyIcon className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Share the Fun",
    description: <span className="text-sm">Create, share, and explore quizzes with the community.</span>,
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <Share2Icon className="h-4 w-4 text-neutral-500" />,
  },
];
