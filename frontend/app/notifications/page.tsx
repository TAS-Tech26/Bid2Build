"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NotificationStack from "@/components/NotificationToast";
import { Notifications, useNotifications } from "@/components/useNotifications";

/* ─────────────────────────────────────────────
   Demo trigger config
───────────────────────────────────────────── */
const DEMO_TRIGGERS = [
  {
    key: "auction_won",
    label: "Auction Won",
    icon: "🏆",
    description: "Fires when your team holds the highest bid when the round closes.",
    accent: "#E8C07D",
    bg: "rgba(232,192,125,0.07)",
    border: "rgba(232,192,125,0.22)",
    fire: () => Notifications.auctionWon("Computer Vision", 620),
  },
  {
    key: "outbid",
    label: "Outbid",
    icon: "⚡",
    description: "Fires the instant another team places a higher bid than yours.",
    accent: "#EF4444",
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.22)",
    fire: () => Notifications.outbid("Investor Network", 475),
  },
  {
    key: "market_event",
    label: "Market Event",
    icon: "📢",
    description: "Broadcast for game-wide events announced by the facilitator.",
    accent: "#8B5CF6",
    bg: "rgba(139,92,246,0.07)",
    border: "rgba(139,92,246,0.22)",
    fire: () =>
      Notifications.marketEvent(
        "Market Volatility Spike",
        "All asset valuations have shifted +15%. Re-evaluate your bidding strategy before the next round.",
      ),
  },
  {
    key: "marketplace_closing",
    label: "Marketplace Closing",
    icon: "🔒",
    description: "Warning dispatched when the market is about to shut down.",
    accent: "#F59E0B",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.22)",
    fire: () => Notifications.marketplaceClosing(5),
  },
  {
    key: "submission_reminder",
    label: "Submission Reminder",
    icon: "📋",
    description: "Nudges teams to upload their business plan before the deadline.",
    accent: "#22C55E",
    bg: "rgba(34,197,94,0.07)",
    border: "rgba(34,197,94,0.22)",
    fire: () => Notifications.submissionReminder("3:30 PM today"),
  },
] as const;

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function NotificationsDemo() {
  const router = useRouter();
  const [credits, setCredits] = useState("1150");
  const { notifications, push, dismiss } = useNotifications();

  useEffect(() => {
    if (!localStorage.getItem("teamName")) router.push("/login");
    const s = localStorage.getItem("credits");
    if (s) setCredits(s);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fireAll() {
    DEMO_TRIGGERS.forEach((t, i) => {
      setTimeout(() => push(t.fire()), i * 350);
    });
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #070B18;
          --gold: #E8C07D;
          --card: rgba(255,255,255,0.03);
          --border: rgba(255,255,255,0.07);
        }

        @keyframes float-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: float-in 0.5s ease both; }

        .demo-card {
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--card);
          backdrop-filter: blur(16px);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .demo-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.4);
        }

        .trigger-btn {
          padding: 11px 20px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          cursor: pointer;
          border: none;
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
        }
        .trigger-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.12);
        }
        .trigger-btn:active { transform: scale(0.97); }

        .fire-all-btn {
          padding: 16px 40px;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, #E8C07D 0%, #8B5CF6 100%);
          color: #000;
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
        }
        .fire-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(232,192,125,0.4);
          filter: brightness(1.08);
        }

        .code-block {
          border-radius: 12px;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 20px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.78rem;
          line-height: 1.8;
          color: #94a3b8;
          overflow-x: auto;
          white-space: pre;
        }
        .code-kw { color: #8B5CF6; }
        .code-fn { color: #E8C07D; }
        .code-str{ color: #22C55E; }
        .code-cmt{ color: #334155; }
      `}</style>

      {/* Toast portal */}
      <NotificationStack notifications={notifications} onDismiss={dismiss} />

      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "#fff" }}>
        <Navbar overrideCredits={credits} />

        <div style={{ padding: "40px 40px 100px", maxWidth: 1200, margin: "0 auto" }}>

          {/* Back */}
          <Link
            href="/stu_dashboard"
            style={{ color: "#64748b", fontSize: "0.88rem", fontWeight: 600,
                     textDecoration: "none", letterSpacing: "0.04em", display: "inline-block", marginBottom: 28 }}
          >
            ← Dashboard
          </Link>

          {/* ── Header ── */}
          <div className="fade-in" style={{ marginBottom: 48 }}>
            <h1 style={{
              fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 900, margin: "0 0 10px",
              background: "linear-gradient(90deg,#fff 30%,#E8C07D 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Notification System
            </h1>
            <p style={{ color: "#475569", fontSize: "0.95rem", margin: 0 }}>
              Reusable toast component with 5 notification types, smooth slide animations, and auto-dismiss.
            </p>
          </div>

          {/* ── Fire-All button ── */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 52 }}>
            <button className="fire-all-btn" onClick={fireAll}>
              🚀 Fire All Notifications
            </button>
          </div>

          {/* ── Cards grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20, marginBottom: 60 }}>
            {DEMO_TRIGGERS.map((t, i) => (
              <div
                key={t.key}
                className="demo-card fade-in"
                style={{
                  borderColor: t.border,
                  background: `linear-gradient(135deg,#0D1220,${t.bg})`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {/* Icon + label */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: `${t.accent}18`, border: `1px solid ${t.accent}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem",
                  }}>
                    {t.icon}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em",
                                color: t.accent, textTransform: "uppercase" }}>
                      Notification Type
                    </p>
                    <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#f1f5f9" }}>
                      {t.label}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.6 }}>
                  {t.description}
                </p>

                {/* Trigger */}
                <button
                  className="trigger-btn"
                  style={{ background: `linear-gradient(135deg,${t.accent}cc,${t.accent}88)`, color: "#000", alignSelf: "flex-start" }}
                  onClick={() => push(t.fire())}
                >
                  {t.icon} Trigger {t.label}
                </button>
              </div>
            ))}
          </div>

          {/* ── Usage snippet ── */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#E8C07D", letterSpacing: "0.08em", marginBottom: 16 }}>
              USAGE IN ANY PAGE
            </h2>
            <div className="code-block">{`<span class="code-cmt">// 1. Import</span>
<span class="code-kw">import</span> NotificationStack <span class="code-kw">from</span> <span class="code-str">"@/components/NotificationToast"</span>;
<span class="code-kw">import</span> { useNotifications, Notifications } <span class="code-kw">from</span> <span class="code-str">"@/components/useNotifications"</span>;

<span class="code-cmt">// 2. In your component</span>
<span class="code-kw">const</span> { notifications, push, dismiss } = <span class="code-fn">useNotifications</span>();

<span class="code-cmt">// 3. Render the stack (once, anywhere in the tree)</span>
<span class="code-fn">&lt;NotificationStack</span> notifications={notifications} onDismiss={dismiss} <span class="code-fn">/&gt;</span>

<span class="code-cmt">// 4. Fire notifications using presets</span>
<span class="code-fn">push</span>(Notifications.<span class="code-fn">auctionWon</span>(<span class="code-str">"Computer Vision"</span>, 620));
<span class="code-fn">push</span>(Notifications.<span class="code-fn">outbid</span>(<span class="code-str">"Investor Network"</span>, 475));
<span class="code-fn">push</span>(Notifications.<span class="code-fn">marketEvent</span>(<span class="code-str">"Volatility Spike"</span>, <span class="code-str">"..."</span>));
<span class="code-fn">push</span>(Notifications.<span class="code-fn">marketplaceClosing</span>(5));
<span class="code-fn">push</span>(Notifications.<span class="code-fn">submissionReminder</span>(<span class="code-str">"3:30 PM today"</span>));`}</div>
          </div>

        </div>
      </main>
    </>
  );
}
