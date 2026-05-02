"use client";

import type { ReactNode } from "react";
import { RouteTransition } from "@/components/motion/primitives";

export function PublicPageTransition({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <RouteTransition className={className.trim()} tone="public">{children}</RouteTransition>;
}
