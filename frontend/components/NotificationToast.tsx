"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

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
  duration?: number; // 0 means stick forever
}

export interface ToastProps {
  item: NotificationItem;
  onDismiss: (id: string) => void;
}

const CONFIG: Record<
  NotificationType,
  { icon: string; label: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  auction_won: {
    icon: "🏆",
    label: "AUCTION WON",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
  },
  outbid: {
    icon: "⚡",
    label: "OUTBID",
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    borderClass: "border-destructive/30",
  },
  market_event: {
    icon: "📣",
    label: "MARKET EVENT",
    colorClass: "text-accent",
    bgClass: "bg-accent/10",
    borderClass: "border-accent/30",
  },
  marketplace_closing: {
    icon: "🔒",
    label: "MARKETPLACE CLOSING",
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
  },
  submission_reminder: {
    icon: "📋",
    label: "SUBMISSION REMINDER",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
  },
};

function Toast({ item, onDismiss }: ToastProps) {
  const cfg = CONFIG[item.type];
  const duration = item.duration ?? 5000;

  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("enter");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [progress, setProgress] = useState(100);
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 10);
    return () => clearTimeout(t);
  }, []);

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
  }, []);

  function dismiss() {
    cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("exit");
    setTimeout(() => onDismiss(item.id), 380);
  }

  const transformStyle =
    phase === "enter"
      ? "translate-x-[120%]"
      : phase === "exit"
      ? "translate-x-[120%]"
      : "translate-x-0";
  const opacityStyle = phase === "idle" ? "opacity-100" : "opacity-0";

  return (
    <div
      className={`relative w-[360px] rounded-xl border bg-card/80 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${cfg.borderClass} ${transformStyle} ${opacityStyle}`}
      role="alert"
    >
      <div className={`absolute top-0 left-0 bottom-0 w-1 rounded-l-xl ${cfg.bgClass.replace('/10', '')}`} />

      <div className="flex gap-3 p-4 pl-5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-xl ${cfg.bgClass} ${cfg.borderClass} ${cfg.colorClass}`}
        >
          {cfg.icon}
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.colorClass}`}>
              {cfg.label}
            </span>
            <button
              onClick={dismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm font-bold text-foreground mb-1 leading-tight">
            {item.title}
          </p>
          <p className="text-xs text-muted-foreground leading-snug">
            {item.message}
          </p>
        </div>
      </div>

      {duration > 0 && (
        <div className="mx-1 mb-1 h-[3px] overflow-hidden rounded-full bg-border/50">
          <div
            className={`h-full transition-all duration-100 ease-linear ${cfg.bgClass.replace('/10', '')}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export interface NotificationStackProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export default function NotificationStack({
  notifications,
  onDismiss,
}: NotificationStackProps) {
  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <Toast item={notification} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
