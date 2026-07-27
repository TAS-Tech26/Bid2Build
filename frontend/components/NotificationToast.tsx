"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export type NotificationType =
  | "auction_won"
  | "outbid"
  | "market_event"
  | "marketplace_closing"
  | "submission_reminder";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  /** ms before auto-dismiss. 0 = never auto-dismiss. Default 5000 */
  duration?: number;
}

interface ToastProps {
  item: NotificationItem;
  onDismiss: (id: string) => void;
  index: number;
}

/* ─────────────────────────────────────────────
   Per-type config
───────────────────────────────────────────── */
const CONFIG: Record<
  NotificationType,
  { icon: string; accent: string; bg: string; border: string; label: string }
> = {
  auction_won: {
    icon: "🏆",
    label: "AUCTION WON",
    accent: "#E8C07D",
    bg: "rgba(232,192,125,0.07)",
    border: "rgba(232,192,125,0.28)",
  },
  outbid: {
    icon: "⚡",
    label: "OUTBID",
    accent: "#EF4444",
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.28)",
  },
  market_event: {
    icon: "📢",
    label: "MARKET EVENT",
    accent: "#8B5CF6",
    bg: "rgba(139,92,246,0.07)",
    border: "rgba(139,92,246,0.28)",
  },
  marketplace_closing: {
    icon: "🔒",
    label: "MARKETPLACE CLOSING",
    accent: "#F59E0B",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.28)",
  },
  submission_reminder: {
    icon: "📋",
    label: "SUBMISSION REMINDER",
    accent: "#22C55E",
    bg: "rgba(34,197,94,0.07)",
    border: "rgba(34,197,94,0.28)",
  },
};

/* ─────────────────────────────────────────────
   Single Toast
───────────────────────────────────────────── */
function Toast({ item, onDismiss, index }: ToastProps) {
  const cfg = CONFIG[item.type];
  const duration = item.duration ?? 5000;

  /* mount/unmount animation state */
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("enter");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* progress bar width (0→100 over duration) */
  const [progress, setProgress] = useState(100);
  const startRef = useRef<number>(Date.now());
  const rafRef   = useRef<number>(0);

  /* Enter */
  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 10);
    return () => clearTimeout(t);
  }, []);

  /* Auto-dismiss timer + progress bar */
  useEffect(() => {
    if (duration <= 0) return;

    startRef.current = Date.now();

    function tick() {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setTimeout(() => dismiss(), duration);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss() {
    cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("exit");
    setTimeout(() => onDismiss(item.id), 380);
  }

  const translateX = phase === "enter" ? "translateX(120%)" : phase === "exit" ? "translateX(120%)" : "translateX(0)";
  const opacity    = phase === "idle" ? 1 : 0;

  return (
    <div
      style={{
        position: "relative",
        width: 360,
        borderRadius: 16,
        border: `1px solid ${cfg.border}`,
        background: `linear-gradient(135deg, #0D1220 0%, ${cfg.bg} 100%)`,
        backdropFilter: "blur(20px)",
        overflow: "hidden",
        boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 0 ${cfg.accent}20`,
        transform: translateX,
        opacity,
        transition: "transform 0.38s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
        cursor: "default",
        userSelect: "none",
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Left accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: cfg.accent, borderRadius: "16px 0 0 16px" }} />

      {/* Content */}
      <div style={{ padding: "16px 18px 14px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>

        {/* Icon bubble */}
        <div style={{
          flexShrink: 0,
          width: 42, height: 42,
          borderRadius: 12,
          background: `${cfg.accent}18`,
          border: `1px solid ${cfg.accent}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.25rem",
        }}>
          {cfg.icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{
              fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.12em",
              color: cfg.accent, textTransform: "uppercase",
            }}>
              {cfg.label}
            </span>
            <button
              onClick={dismiss}
              aria-label="Dismiss notification"
              style={{
                background: "none", border: "none", padding: "0 2px",
                color: "#475569", cursor: "pointer", fontSize: "0.9rem", lineHeight: 1,
                transition: "color 0.15s",
              }}
              onMouseOver={e => (e.currentTarget.style.color = "#e2e8f0")}
              onMouseOut={e  => (e.currentTarget.style.color = "#475569")}
            >
              ✕
            </button>
          </div>
          <p style={{ margin: "0 0 3px", fontSize: "0.88rem", fontWeight: 800, color: "#f1f5f9", lineHeight: 1.3 }}>
            {item.title}
          </p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>
            {item.message}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div style={{ height: 3, background: "rgba(255,255,255,0.05)", margin: "0 4px 4px" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${cfg.accent}88, ${cfg.accent})`,
            borderRadius: 999,
            transition: "width 0.1s linear",
          }} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Toast Stack  (the main export — mount once
   near the root of each page)
───────────────────────────────────────────── */
export interface NotificationStackProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export default function NotificationStack({ notifications, onDismiss }: NotificationStackProps) {
  return (
    <div
      aria-label="Notifications"
      style={{
        position: "fixed",
        top: 100,           /* clears the sticky navbar */
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      {notifications.map((item, i) => (
        <div key={item.id} style={{ pointerEvents: "auto" }}>
          <Toast item={item} onDismiss={onDismiss} index={i} />
        </div>
      ))}
    </div>
  );
}
