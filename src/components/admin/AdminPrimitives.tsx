"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function AdminPageHeader({ title, description }: { title: string; description: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.header
      className="mb-8"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease }}
    >
      <h1 className="font-headline-md text-headline-md text-on-background">{title}</h1>
      <p className="mt-2 text-on-surface-variant">{description}</p>
    </motion.header>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={`rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 soft-shadow ${className}`.trim()}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.22, ease }}
    >
      {children}
    </motion.section>
  );
}

export function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm text-on-surface-variant">{label}</span>{children}</label>;
}

export function AdminModal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const shouldReduceMotion = useReducedMotion();

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={handleBackdropClick}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.18, ease }}
    >
      <motion.div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 soft-shadow"
        onClick={(event) => event.stopPropagation()}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.24, ease }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="admin-modal-title" className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
          <button className="rounded-full px-3 py-1 text-on-surface-variant transition-all duration-200 hover:bg-surface-variant active:scale-[0.98]" type="button" onClick={onClose} aria-label="Cerrar modal">Cerrar</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export const adminInputClass = "lumen-input w-full rounded px-3 py-2 text-on-surface placeholder:text-on-surface-variant/70";
