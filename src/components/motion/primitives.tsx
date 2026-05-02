"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

const ease = [0.22, 1, 0.36, 1] as const;

const routeVariants = {
  public: {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  admin: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  },
} as const;

export const revealTransition = {
  duration: 0.45,
  ease,
} as const;

export function RouteTransition({
  children,
  className = "",
  tone = "public",
}: {
  children: ReactNode;
  className?: string;
  tone?: "public" | "admin";
}) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = routeVariants[tone];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className={className}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        transition={{ duration: tone === "public" ? 0.34 : 0.26, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function HoverSurface({
  children,
  className = "",
  hoverY = -4,
  hoverScale = 1.01,
  tapScale = 0.985,
}: {
  children: ReactNode;
  className?: string;
  hoverY?: number;
  hoverScale?: number;
  tapScale?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={shouldReduceMotion ? undefined : { y: hoverY, scale: hoverScale }}
      whileTap={shouldReduceMotion ? undefined : { scale: tapScale, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
