"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { revealTransition } from "@/components/motion/primitives";

type ScrollRevealProps = {
  as?: "div" | "section";
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
};

export function ScrollReveal({ as, children, className = "", delay = 0, threshold = 0.18 }: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: "0px 0px -8% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const motionProps = {
    className: className.trim(),
    initial: shouldReduceMotion ? false : { opacity: 0, y: 18 },
    animate: shouldReduceMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { ...revealTransition, delay: delay / 1000 },
    style: shouldReduceMotion ? undefined : ({ willChange: "opacity, transform" } as CSSProperties),
  };

  if (as === "section") {
    return (
      <motion.section ref={ref as RefObject<HTMLElement>} {...motionProps}>
        {children}
      </motion.section>
    );
  }

  return (
    <motion.div ref={ref as RefObject<HTMLDivElement>} {...motionProps}>
      {children}
    </motion.div>
  );
}
