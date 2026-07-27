"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import NotificationStack from "@/components/NotificationToast";
import { Notifications, useNotifications } from "@/components/useNotifications";

/* ─────────────────────────────────────────────
   Asset catalogue  (unchanged)
───────────────────────────────────────────── */
const assets: any = {
  "1": { name: "Computer Vision",            category: "Core Tech",         startingBid: 300 },
  "2": { name: "Automation Technology",       category: "Core Tech",         startingBid: 300 },
  "3": { name: "AI Systems",                  category: "Core Tech",         startingBid: 350 },
  "4": { name: "Data Centers",               category: "Business Resource", startingBid: 150 },
};

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type TeamStatus = "ACTIVE" | "HIGHEST BIDDER" | "BACKED OUT";

interface Team {
  name: string;
  status: TeamStatus;
}

interface BidEntry {
  id: number;
  team: string;
  amount: number;
  time: string;
  isYou: boolean;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return { m: String(m).padStart(2, "0"), s: String(sec).padStart(2, "0") };
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function BiddingRoom() {
  const { notifications, push, dismiss } = useNotifications();
  const params  = useParams();
  const router  = useRouter();

  /* ── auth + credits (unchanged) ── */
  const [credits, setCredits] = useState("1150");
  useEffect(() => {
    if (!localStorage.getItem("teamName")) router.push("/login");
    const s = localStorage.getItem("credits");
    if (s) { setCredits(s); }
    else   { localStorage.setItem("credits", "1150"); setCredits("1150"); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const id    = String(params.id);
  const asset = assets[id] || { name: "Unknown Asset", category: "Unknown", startingBid: 300 };

  /* ── core auction state (unchanged) ── */
  const [timer,          setTimer]          = useState(15);
  const [highestBid,     setHighestBid]     = useState(asset.startingBid);
  const [leader,         setLeader]         = useState("TEAM 023");
  const [hasWithdrawn,   setHasWithdrawn]   = useState(false);
  const [teams,          setTeams]          = useState<Team[]>([
    { name: "TEAM 001", status: "ACTIVE"         },
    { name: "TEAM 023", status: "HIGHEST BIDDER" },
    { name: "TEAM 045", status: "ACTIVE"         },
    { name: "TEAM 078", status: "BACKED OUT"     },
  ]);

  /* ── new state ── */
  const [bidFeed, setBidFeed] = useState<BidEntry[]>([
    { id: 1, team: "TEAM 023", amount: asset.startingBid, time: nowTime(), isYou: false },
  ]);
  const bidIdRef   = useRef(2);
  const feedEndRef = useRef<HTMLDivElement>(null);

  /* scroll feed to bottom on new bid */
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bidFeed]);

  /* ── timer (unchanged logic + auction-won notification) ── */
  useEffect(() => {
    if (timer <= 0) {
      /* When timer just hit 0, check if the user (TEAM 001) is the winner */
      if (leader === "TEAM 001" && !hasWithdrawn) {
        push(Notifications.auctionWon(asset.name, highestBid));
      }
      return;
    }
    const iv = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(iv);
  }, [timer]);

  /* ── derived counts ── */
  const remaining  = teams.filter(t => t.status !== "BACKED OUT").length;
  const backedOut  = teams.filter(t => t.status === "BACKED OUT").length;
  const isCritical = timer > 0 && timer <= 5;
  const isExpired  = timer <= 0;

  /* ── placeBid (unchanged logic + feed entry) ── */
  function placeBid(amount: number) {
    if (hasWithdrawn) return;
    const cur = Number(credits);
    if (cur < amount) { alert("Insufficient credits to place this increment!"); return; }

    const newCredits = cur - amount;
    setCredits(String(newCredits));
    localStorage.setItem("credits", String(newCredits));

    const newBid = highestBid + amount;
    setHighestBid(newBid);
    setLeader("TEAM 001");
    setTimer(15);

    setTeams(prev =>
      prev.map(t =>
        t.name === "TEAM 001" ? { ...t, status: "HIGHEST BIDDER" }
        : t.name === "TEAM 023" ? { ...t, status: "ACTIVE" }
        : t
      )
    );

    /* outbid notification — fires for TEAM 023 (simulating rival being outbid) */
    push(Notifications.outbid(asset.name, newBid));

    /* append to feed */
    setBidFeed(prev => [
      ...prev,
      { id: bidIdRef.current++, team: "TEAM 001 (You)", amount: newBid, time: nowTime(), isYou: true },
    ]);
  }

  /* ── backOut (unchanged) ── */
  function backOut() {
    if (leader === "TEAM 001") {
      alert("You cannot back out while holding the highest bid");
      return;
    }
    setHasWithdrawn(true);
    setTeams(prev => prev.map(t => t.name === "TEAM 001" ? { ...t, status: "BACKED OUT" } : t));
  }

  /* ── timer display ── */
  const { m, s } = fmtTime(timer);

  return (
    <>
      {/* ── Inline styles ── */}
      <style>{`
        :root {
          --gold: #E8C07D;
          --gold-dim: rgba(232,192,125,0.12);
          --purple: #8B5CF6;
          --bg: #070B18;
          --red: #EF4444;
          --green: #22C55E;
          --card: rgba(255,255,255,0.035);
          --border: rgba(255,255,255,0.07);
        }

        /* ── countdown ring ── */
        .countdown-wrap {
          position: relative;
          width: 180px;
          height: 180px;
          flex-shrink: 0;
        }
        .countdown-svg {
          position: absolute;
          inset: 0;
          transform: rotate(-90deg);
        }
        .countdown-track { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 6; }
        .countdown-arc   {
          fill: none;
          stroke-width: 6;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.9s linear, stroke 0.3s;
        }
        .countdown-inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .countdown-digits {
          font-size: 2.4rem;
          font-weight: 900;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.04em;
          transition: color 0.3s;
        }
        .countdown-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #475569;
          margin-top: 4px;
        }

        /* ── bid flash animation ── */
        @keyframes bid-pop {
          0%   { transform: translateY(10px); opacity: 0; }
          60%  { transform: translateY(-2px); }
          100% { transform: translateY(0);    opacity: 1; }
        }
        .bid-pop { animation: bid-pop 0.4s ease both; }

        /* ── pulse ring on LIVE dot ── */
        @keyframes ping {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
        .ping { animation: ping 1.4s cubic-bezier(0,0,0.2,1) infinite; }

        /* ── shimmer on highest bid number ── */
        @keyframes shimmer-gold {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #E8C07D 25%, #fff 50%, #E8C07D 75%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-gold 2.5s linear infinite;
        }

        /* ── critical flash ── */
        @keyframes critical-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        .critical-pulse { animation: critical-pulse 0.7s ease-in-out infinite; }

        /* ── card hover ── */
        .panel {
          border-radius: 24px;
          border: 1px solid var(--border);
          background: var(--card);
          backdrop-filter: blur(18px);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .panel:hover {
          border-color: rgba(232,192,125,0.2);
          box-shadow: 0 12px 48px rgba(232,192,125,0.05);
        }

        /* ── team row ── */
        .team-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s, border-color 0.2s;
        }
        .team-row--leader  { background: rgba(232,192,125,0.08); border-color: rgba(232,192,125,0.18); }
        .team-row--backedout { opacity: 0.45; }

        /* ── feed item ── */
        .feed-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.04);
          background: rgba(0,0,0,0.2);
          font-size: 0.82rem;
        }
        .feed-item--you {
          background: rgba(232,192,125,0.07);
          border-color: rgba(232,192,125,0.18);
        }

        /* ── bid buttons ── */
        .bid-btn {
          flex: 1;
          padding: 16px 0;
          border-radius: 14px;
          font-weight: 900;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
          border: none;
        }
        .bid-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 36px rgba(232,192,125,0.35);
          filter: brightness(1.1);
        }
        .bid-btn:active:not(:disabled) { transform: scale(0.97); }
        .bid-btn--primary {
          background: linear-gradient(135deg, var(--gold) 0%, var(--purple) 100%);
          color: #000;
        }
        .bid-btn--outline {
          background: transparent;
          border: 2px solid var(--gold) !important;
          color: var(--gold);
        }
        .bid-btn--outline:hover:not(:disabled) {
          background: var(--gold);
          color: #000;
        }
        .bid-btn--disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .back-out-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          border: 2px solid var(--red);
          background: transparent;
          color: var(--red);
          font-weight: 900;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .back-out-btn:hover:not(:disabled) {
          background: var(--red);
          color: #000;
          box-shadow: 0 0 30px rgba(239,68,68,0.3);
        }
        .back-out-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        /* ── stat mini box ── */
        .stat-mini {
          border-radius: 14px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 14px 18px;
          text-align: center;
        }
        .stat-mini__label {
          font-size: 0.64rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #475569;
          margin: 0 0 4px;
        }
        .stat-mini__value {
          font-size: 1.5rem;
          font-weight: 900;
          margin: 0;
        }
      `}</style>

      {/* ── Notification portal ── */}
      <NotificationStack notifications={notifications} onDismiss={dismiss} />

      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "#fff", fontFamily: "inherit" }}>
        <Navbar overrideCredits={credits} />

        <div style={{ padding: "32px 36px 80px", maxWidth: 1400, margin: "0 auto" }}>

          {/* ── Back button (unchanged) ── */}
          <button
            onClick={() => router.back()}
            style={{
              marginBottom: 28,
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: "0.04em",
              transition: "color 0.2s",
              padding: 0,
            }}
            onMouseOver={e => (e.currentTarget.style.color = "#E8C07D")}
            onMouseOut={e  => (e.currentTarget.style.color = "#64748b")}
          >
            ← Back to Marketplace
          </button>

          {/* ══════════════════════════════════
              HERO HEADER  —  title + LIVE countdown
          ══════════════════════════════════ */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 24 }}>

            {/* Title */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                {/* LIVE badge */}
                <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 7,
                               padding: "5px 14px", borderRadius: 999,
                               background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)",
                               fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", color: "#22C55E" }}>
                  <span style={{ position: "relative", width: 8, height: 8 }}>
                    <span className="ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E", opacity: 0.6 }} />
                    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E" }} />
                  </span>
                  LIVE BIDDING ROOM
                </span>
              </div>

              <h1 style={{
                fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, margin: 0, lineHeight: 1.1,
                background: "linear-gradient(90deg,#fff 30%,#E8C07D 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {asset.name}
              </h1>
              <p style={{ color: "#475569", marginTop: 8, fontSize: "0.9rem", letterSpacing: "0.06em" }}>
                {asset.category} • Starting Bid: <span style={{ color: "#E8C07D", fontWeight: 700 }}>{asset.startingBid} CR</span>
              </p>
            </div>

            {/* ── LARGE COUNTDOWN RING ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div className="countdown-wrap">
                {/* SVG ring */}
                <svg className="countdown-svg" viewBox="0 0 180 180">
                  <circle className="countdown-track" cx="90" cy="90" r="80" />
                  <circle
                    className="countdown-arc"
                    cx="90" cy="90" r="80"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - timer / 15)}`}
                    stroke={isCritical ? "#EF4444" : isExpired ? "#374151" : "#E8C07D"}
                  />
                </svg>
                <div className="countdown-inner">
                  <span
                    className={`countdown-digits ${isCritical ? "critical-pulse" : ""}`}
                    style={{ color: isCritical ? "#EF4444" : isExpired ? "#374151" : "#E8C07D" }}
                  >
                    {m}:{s}
                  </span>
                  <span className="countdown-label">
                    {isExpired ? "ENDED" : "REMAINING"}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.68rem", color: "#475569", letterSpacing: "0.1em", fontWeight: 600, margin: 0 }}>
                RESETS ON NEW BID
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════
              STAT STRIP
          ══════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 28 }}>
            {/* Current Bid */}
            <div className="stat-mini" style={{ border: "1px solid rgba(232,192,125,0.25)", background: "rgba(232,192,125,0.05)" }}>
              <p className="stat-mini__label">Current Bid</p>
              <p className="stat-mini__value shimmer-text">{highestBid.toLocaleString()}</p>
              <p style={{ fontSize: "0.65rem", color: "#64748b", margin: "2px 0 0", fontWeight: 600 }}>CREDITS</p>
            </div>
            {/* Highest Bidder */}
            <div className="stat-mini" style={{ border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.05)" }}>
              <p className="stat-mini__label">Highest Bidder</p>
              <p className="stat-mini__value" style={{ fontSize: "1.1rem", color: "#8B5CF6" }}>{leader}</p>
            </div>
            {/* Remaining */}
            <div className="stat-mini" style={{ border: "1px solid rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.04)" }}>
              <p className="stat-mini__label">Remaining Bidders</p>
              <p className="stat-mini__value" style={{ color: "#22C55E" }}>{remaining}</p>
            </div>
            {/* Backed Out */}
            <div className="stat-mini" style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}>
              <p className="stat-mini__label">Backed Out</p>
              <p className="stat-mini__value" style={{ color: "#EF4444" }}>{backedOut}</p>
            </div>
          </div>

          {/* ══════════════════════════════════
              3-COLUMN GRID
          ══════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px 300px", gap: 20, alignItems: "start" }}>

            {/* ── COL 1: Main auction panel ── */}
            <div className="panel" style={{ padding: 36 }}>

              {/* Bid heading */}
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", color: "#475569", textTransform: "uppercase", margin: "0 0 10px" }}>
                Current Highest Bid
              </p>

              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 6 }}>
                <h2 className="shimmer-text" style={{ fontSize: "clamp(3.5rem,6vw,5rem)", fontWeight: 900, margin: 0, lineHeight: 1 }}>
                  {highestBid.toLocaleString()}
                </h2>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#64748b", paddingBottom: 8 }}>CR</span>
              </div>

              <p style={{ marginTop: 8, marginBottom: 36, color: "#94a3b8", fontSize: "0.9rem" }}>
                Leading Team:
                <span style={{ marginLeft: 8, color: "#E8C07D", fontWeight: 800 }}>{leader}</span>
              </p>

              {/* ── Bid buttons ── */}
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <button
                  className={`bid-btn bid-btn--primary ${hasWithdrawn || isExpired ? "bid-btn--disabled" : ""}`}
                  onClick={() => placeBid(50)}
                  disabled={hasWithdrawn || isExpired}
                >
                  +50 BID
                </button>
                <button
                  className={`bid-btn bid-btn--outline ${hasWithdrawn || isExpired ? "bid-btn--disabled" : ""}`}
                  onClick={() => placeBid(100)}
                  disabled={hasWithdrawn || isExpired}
                  style={{ border: "2px solid var(--gold)" }}
                >
                  +100 BID
                </button>
                <button
                  className={`bid-btn bid-btn--outline ${hasWithdrawn || isExpired ? "bid-btn--disabled" : ""}`}
                  onClick={() => placeBid(250)}
                  disabled={hasWithdrawn || isExpired}
                  style={{ border: "2px solid rgba(139,92,246,0.7)", color: "#8B5CF6" }}
                >
                  +250 BID
                </button>
              </div>

              {/* ── Back Out ── */}
              <button
                className="back-out-btn"
                onClick={backOut}
                disabled={hasWithdrawn || isExpired}
              >
                {hasWithdrawn ? "✓ BACKED OUT" : "BACK OUT"}
              </button>

              {/* Withdrawn notice */}
              {hasWithdrawn && (
                <p style={{ marginTop: 16, textAlign: "center", fontSize: "0.8rem", color: "#EF4444", fontWeight: 600, letterSpacing: "0.06em" }}>
                  You have withdrawn from this auction.
                </p>
              )}
            </div>

            {/* ── COL 2: Participants ── */}
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#E8C07D", letterSpacing: "0.14em", margin: 0 }}>
                  PARTICIPANTS
                </h2>
                <span style={{ fontSize: "0.68rem", background: "rgba(34,197,94,0.12)", color: "#22C55E",
                               border: "1px solid rgba(34,197,94,0.25)", borderRadius: 999, padding: "3px 10px",
                               fontWeight: 700, letterSpacing: "0.08em" }}>
                  {remaining} ACTIVE
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {teams.map(team => {
                  const isLeader  = team.status === "HIGHEST BIDDER";
                  const isBacked  = team.status === "BACKED OUT";
                  return (
                    <div
                      key={team.name}
                      className={`team-row ${isLeader ? "team-row--leader" : ""} ${isBacked ? "team-row--backedout" : ""}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                          background: isBacked ? "#EF4444" : isLeader ? "#E8C07D" : "#22C55E",
                        }} />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: isLeader ? "#E8C07D" : "#e2e8f0" }}>
                          {team.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.06em",
                        color: isBacked ? "#EF4444" : isLeader ? "#E8C07D" : "#22C55E",
                        background: isBacked ? "rgba(239,68,68,0.1)" : isLeader ? "rgba(232,192,125,0.1)" : "rgba(34,197,94,0.1)",
                        borderRadius: 6, padding: "2px 8px",
                      }}>
                        {team.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* mini divider stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 20 }}>
                <div style={{ textAlign: "center", padding: "10px 0", borderRadius: 10, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.15)" }}>
                  <p style={{ fontSize: "1.4rem", fontWeight: 900, color: "#22C55E", margin: 0 }}>{remaining}</p>
                  <p style={{ fontSize: "0.6rem", color: "#475569", margin: 0, fontWeight: 700, letterSpacing: "0.08em" }}>REMAINING</p>
                </div>
                <div style={{ textAlign: "center", padding: "10px 0", borderRadius: 10, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <p style={{ fontSize: "1.4rem", fontWeight: 900, color: "#EF4444", margin: 0 }}>{backedOut}</p>
                  <p style={{ fontSize: "0.6rem", color: "#475569", margin: 0, fontWeight: 700, letterSpacing: "0.08em" }}>BACKED OUT</p>
                </div>
              </div>
            </div>

            {/* ── COL 3: Recent Bids Feed ── */}
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#8B5CF6", letterSpacing: "0.14em", margin: 0 }}>
                  RECENT BIDS
                </h2>
                <span style={{ fontSize: "0.65rem", color: "#475569", fontWeight: 600 }}>
                  {bidFeed.length} bids
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto",
                            paddingRight: 4, scrollbarWidth: "thin" }}>
                {[...bidFeed].reverse().map((bid, i) => (
                  <div key={bid.id} className={`feed-item bid-pop ${bid.isYou ? "feed-item--you" : ""}`}
                       style={{ animationDelay: `${i * 0.04}s` }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700,
                                  color: bid.isYou ? "#E8C07D" : "#e2e8f0" }}>
                        {bid.team}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.65rem", color: "#475569" }}>{bid.time}</p>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: "0.9rem",
                                   color: bid.isYou ? "#E8C07D" : "#8B5CF6" }}>
                      {bid.amount.toLocaleString()} CR
                    </span>
                  </div>
                ))}
                <div ref={feedEndRef} />
              </div>
            </div>

          </div>{/* end grid */}
        </div>
      </main>
    </>
  );
}