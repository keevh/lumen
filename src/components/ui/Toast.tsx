"use client";

import { useCallback, useEffect, useState } from "react";

type ToastTone = "success" | "error";

export function useTimedToast(timeout = 3500) {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<ToastTone>("success");

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage("");
    }, timeout);

    return () => window.clearTimeout(timer);
  }, [message, timeout]);

  const showToast = useCallback((nextMessage: string, nextTone: ToastTone = "success") => {
    setTone(nextTone);
    setMessage(nextMessage);
  }, []);

  return {
    message,
    tone,
    showToast,
    clearToast: () => setMessage(""),
  };
}

export function Toast({ message, tone }: { message: string; tone: ToastTone }) {
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] max-w-sm rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 shadow-lg backdrop-blur-sm">
      <p
        className={`font-body-sm text-body-sm ${tone === "error" ? "text-on-error-container" : "text-on-surface"}`}
        role={tone === "error" ? "alert" : "status"}
      >
        <span
          className={`mb-1 block font-label-sm uppercase tracking-widest ${tone === "error" ? "text-error" : "text-primary"}`}
        >
          {tone === "error" ? "Aviso" : "Listo"}
        </span>
        {message}
      </p>
    </div>
  );
}
