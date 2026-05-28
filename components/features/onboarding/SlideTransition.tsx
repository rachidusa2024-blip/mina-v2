"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SlideTransitionProps {
  slideKey: number;
  direction: 1 | -1;
  children: React.ReactNode;
}

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function SlideTransition({ slideKey, direction, children }: SlideTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={slideKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
