"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from '../services/api';
import { time } from "console";

type Status='ACTIVE'|'QUEUED'|'INACTIVE'
interface Technology{
  id:number,
  name:string,
  description:string,
  status:Status,
  base_price:number,
  current_price:number,
  highest_bidder_id:number|null,
  end:string,
}



/* ─────────────────────────────────────────────
   Auction Card Component
───────────────────────────────────────────── */



function AuctionCard({
  technology,
  timeLeft,
}: {
  technology:Technology;
  timeLeft: number;
}) {
  const isLive = technology.status === "ACTIVE";
  const isCritical = isLive && timeLeft <= 60;
  console.log(technology)
  return (
    <div
      className={`auction-card ${isLive ? "auction-card--live" : "auction-card--waiting"} ${isCritical ? "auction-card--critical" : ""}`}
    >
      {/* Glow overlay */}
      <div className="auction-card__glow" />

      {/* Top row: name + badge */}
      <div className="card-header">
        {/*<div className="card-icon">{auction.icon}</div>*/}
        <div className="card-title-block">
          <h2 className="card-name">{technology.name}</h2>
          {/*<span className="card-category">{technology.category}</span>*/}
        </div>
        <StatusBadge status={technology.status} critical={isCritical} />
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <StatBox
          label="Current Highest Bid"
          value={`${technology.current_price} CR`}
          accent={true}
          large={true}
        />
        <StatBox
          label="Starting Bid"
          value={`${technology.base_price} CR`}
        />
        {/*<StatBox
          label="Teams in Room"
          value={`${technology.teamsInRoom} Teams`}
          icon="👥"
        />*/}
        <TimerBox timeLeft={timeLeft} isLive={isLive} critical={isCritical} />
      </div>

      {/* CTA */}
      <Link
        href={`/bidding/${technology.id}`}
        className={`join-btn ${isLive ? "join-btn--live" : "join-btn--waiting"}`}
      >
        {isLive ? (
          <>
            <span className="join-btn__pulse" />
            JOIN AUCTION →
          </>
        ) : (
          "AUCTION IS NOT ACTIVE"
        )}
      </Link>
    </div>
  );
}

function StatusBadge({
  status,
  critical,
}: {
  status: Status;
  critical: boolean;
}) {
  if (status === "ACTIVE") {
    return (
      <span
        className={`badge badge--live ${
          critical ? "badge--critical" : ""
        }`}
      >
        <span className="badge__dot" />
        {critical ? "ENDING SOON" : "LIVE"}
      </span>
    );
  }

  if (status === "QUEUED") {
    return (
      <span className="badge badge--waiting">
        QUEUED
      </span>
    );
  }

  return (
    <span className="badge badge--inactive">
      CLOSED
    </span>
  );
}

function StatBox({
  label,
  value,
  accent,
  large,
}: {
  label: string;
  value: string;
  accent?: boolean;
  large?: boolean;
}) {
  return (
    <div className={`stat-box ${accent ? "stat-box--accent" : ""}`}>
      <p className="stat-label">{label}</p>
      <p
        className={`stat-value ${
          large ? "stat-value--large" : ""
        } ${accent ? "stat-value--gold" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function TimerBox({
  timeLeft,
  isLive,
  critical,
}: {
  timeLeft: number;
  isLive: boolean;
  critical: boolean;
}) {
  return (
    <div
      className={`stat-box timer-box ${
        critical ? "timer-box--critical" : ""
      }`}
    >
      <p className="stat-label">Time Remaining</p>

      <p
        className={`timer-value ${
          critical ? "timer-value--critical" : ""
        }`}
      >
        {isLive ? timeLeft : "--:--"}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function MarketplacePage() {
  const router = useRouter();
  const [credits, setCredits] = useState<any>();
  const[tech,setTech]=useState<Technology[]>([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading]=useState(true);
  // Per-auction countdown timers (keyed by id)
  const [timers, setTimers] = useState<Record<number, number>>(() =>
    Object.fromEntries(tech.map((a) => [a.id,
      Math.max(
        0,
        Math.floor(
          (new Date(a.end).getTime() - Date.now()) / 1000
        )
      ),]))
  );

  useEffect(() => {
    const token = localStorage.getItem("access");
    const storedTeam = localStorage.getItem("team");
    if (!storedTeam) {
      router.push("/login");
      return;
    }
    if (!token) {
      router.push("/login");
      return;
    }
    try{
      const team = JSON.parse(storedTeam);
      setTeamName(team.name);
      setCredits(team.credits);
    }
    catch(error){
      console.log("Invalid team data", error);
      localStorage.removeItem("team");
      localStorage.removeItem("access");
      router.push("/login");
    }
  }, [router]);

  useEffect(()=>{
    const fetchTech=async()=>{
      try{
        const token=localStorage.getItem("access");
        const response=await api.get("/api/items/",{
           headers:{
            Authorization:`Bearer ${token}`,
          }},
      );
      setTech(response.data.technologies);
       const initialTimers: Record<number, number> = {};
      response.data.forEach((item: Technology) => {
        if (item.end) {
          initialTimers[item.id] = Math.max(
            0,
            Math.floor(
              (new Date(item.end).getTime() - Date.now()) / 1000
            )
          );
        }
      });

      setTimers(initialTimers);
      }catch(e){
        console.log("Failed to fetch technologies:",e);
      }finally{
        setLoading(false);
      }
    }
    fetchTech();
  },[])

  // Global tick — counts down every live auction
  useEffect(() => {
  const interval = setInterval(() => {
    setTimers((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((id) => {
        if (updated[Number(id)] > 0) {
          updated[Number(id)] -= 1;
        }
      });

      return updated;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);

  const liveCount = tech.filter((a) => a.status === "ACTIVE").length;

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Loading Technologies...
    </div>
  );
}

  return (
    <>
      <style>{`
        /* ── Tokens ── */
        :root {
          --gold: #E8C07D;
          --gold-dim: rgba(232,192,125,0.15);
          --purple: #8B5CF6;
          --bg: #070B18;
          --card-bg: rgba(255,255,255,0.035);
          --card-border: rgba(255,255,255,0.08);
          --red: #EF4444;
          --green: #22C55E;
        }

        /* ── Auction Card ── */
        .auction-card {
          position: relative;
          border-radius: 24px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          padding: 28px;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .auction-card:hover {
          transform: translateY(-4px);
          border-color: rgba(232,192,125,0.35);
          box-shadow: 0 20px 60px rgba(232,192,125,0.08);
        }
        .auction-card--live {
          border-color: rgba(34,197,94,0.2);
        }
        .auction-card--critical {
          border-color: rgba(239,68,68,0.35) !important;
          animation: critical-pulse 2s ease-in-out infinite;
        }
        @keyframes critical-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
          50% { box-shadow: 0 0 0 6px rgba(239,68,68,0.08); }
        }

        /* Glow */
        .auction-card__glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 80% 10%, rgba(232,192,125,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Header */
        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 22px;
        }
        .card-icon {
          font-size: 2rem;
          line-height: 1;
          flex-shrink: 0;
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-title-block { flex: 1; min-width: 0; }
        .card-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          margin: 0;
        }
        .card-category {
          display: inline-block;
          margin-top: 5px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          background: var(--gold-dim);
          border-radius: 6px;
          padding: 2px 8px;
        }

        /* Badge */
        .badge {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }
        .badge--live {
          background: rgba(34,197,94,0.15);
          color: #22C55E;
          border: 1px solid rgba(34,197,94,0.25);
        }
        .badge--critical {
          background: rgba(239,68,68,0.15) !important;
          color: #EF4444 !important;
          border-color: rgba(239,68,68,0.3) !important;
        }
        .badge--waiting {
          background: rgba(251,191,36,0.12);
          color: #FBBF24;
          border: 1px solid rgba(251,191,36,0.2);
        }
        .badge__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 22px;
        }
        .stat-box {
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px;
          padding: 14px 16px;
          transition: background 0.2s;
        }
        .stat-box--accent {
          grid-column: span 2;
          background: rgba(232,192,125,0.06);
          border-color: rgba(232,192,125,0.2);
        }
        .stat-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          margin: 0 0 4px;
        }
        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0;
        }
        .stat-value--large { font-size: 1.5rem; }
        .stat-value--gold { color: var(--gold); }

        /* Timer */
        .timer-box { text-align: center; }
        .timer-box--critical { background: rgba(239,68,68,0.08) !important; border-color: rgba(239,68,68,0.2) !important; }
        .timer-value {
          font-size: 1.6rem;
          font-weight: 900;
          font-variant-numeric: tabular-nums;
          color: #e2e8f0;
          letter-spacing: 0.04em;
          margin: 0;
        }
        .timer-value--critical {
          color: #EF4444;
          animation: timer-flash 1s ease-in-out infinite;
        }
        @keyframes timer-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Join button */
        .join-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
          overflow: hidden;
        }
        .join-btn--live {
          background: linear-gradient(135deg, var(--gold) 0%, var(--purple) 100%);
          color: #000;
        }
        .join-btn--live:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(232,192,125,0.45);
          filter: brightness(1.08);
        }
        .join-btn--waiting {
          background: rgba(255,255,255,0.05);
          color: #64748b;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: default;
          pointer-events: none;
        }
        /* Ripple pulse on live button */
        .join-btn__pulse {
          position: absolute;
          left: 0; top: 0; right: 0; bottom: 0;
          background: rgba(255,255,255,0.12);
          border-radius: inherit;
          transform: scale(0);
          transition: transform 0.6s ease, opacity 0.6s ease;
          opacity: 0;
          pointer-events: none;
        }
        .join-btn--live:hover .join-btn__pulse {
          transform: scale(2);
          opacity: 0;
        }

        /* Summary bar */
        .summary-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 20px;
          border: 1px solid rgba(232,192,125,0.15);
          background: rgba(255,255,255,0.03);
          padding: 24px 32px;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .summary-stat { text-align: left; }
        .summary-stat__label {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #475569;
          margin: 0 0 4px;
        }
        .summary-stat__value {
          font-size: 2rem;
          font-weight: 900;
          margin: 0;
        }
        .summary-stat__value--gold { color: var(--gold); }

        /* Filter tabs */
        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .filter-tab {
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-tab:hover, .filter-tab--active {
          background: var(--gold-dim);
          border-color: rgba(232,192,125,0.3);
          color: var(--gold);
        }
      `}</style>

      <main
        style={{ minHeight: "100vh", background: "var(--bg)", color: "#fff" }}
      >
        <Navbar overrideCredits={credits} />

        <div style={{ padding: "40px 40px 80px" }}>
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 40,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(2rem,4vw,3rem)",
                  fontWeight: 900,
                  background: "linear-gradient(90deg,#fff 30%,#E8C07D 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                LIVE AUCTION DASHBOARD
              </h1>
              <p
                style={{
                  color: "#475569",
                  marginTop: 8,
                  fontSize: "0.95rem",
                  letterSpacing: "0.05em",
                }}
              >
                Bid2Build • Architect Phase • Real-Time Asset Auctions
              </p>
            </div>

            <Link
              href="/stu_dashboard"
              style={{
                padding: "10px 22px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.04)")
              }
              onMouseOut={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent")
              }
            >
              ← Dashboard
            </Link>
          </div>

          {/* ── Summary Bar ── */}
          <div className="summary-bar">
            <div className="summary-stat">
              <p className="summary-stat__label">Available Credits</p>
              <p className="summary-stat__value summary-stat__value--gold">
                {Number(credits).toLocaleString()}
              </p>
            </div>

            <div className="summary-stat">
              <p className="summary-stat__label">Live Auctions</p>
              <p className="summary-stat__value" style={{ color: "#22C55E" }}>
                {liveCount}
              </p>
            </div>

            <div className="summary-stat">
              <p className="summary-stat__label">Total Assets</p>
              <p className="summary-stat__value" style={{ color: "#e2e8f0" }}>
                {tech.length}
              </p>
            </div>

            {/*<div className="summary-stat">
              <p className="summary-stat__label">Teams Competing</p>
              <p className="summary-stat__value" style={{ color: "#8B5CF6" }}>
                {tech.reduce((s, a) => s + a.teamsInRoom, 0)}
              </p>
            </div>*/}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22C55E",
                  display: "inline-block",
                  animation: "blink 1.2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#22C55E",
                  letterSpacing: "0.1em",
                }}
              >
                MARKET OPEN
              </span>
            </div>
          </div>

          {/* ── Filter Tabs (UI only) ── */}
          <div className="filter-tabs">
            {["All Assets", "Core Tech", "Business Resource", "Special Asset", "🔴 Live Only"].map(
              (tab, i) => (
                <button
                  key={tab}
                  className={`filter-tab ${i === 0 ? "filter-tab--active" : ""}`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* ── Auction Grid ── */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))",
              gap: 24,
            }}
          >
            {tech.map((technology) => (
              <AuctionCard
                key={technology.id}
                technology={technology}
                timeLeft={timers[technology.id] ?? 0}
              />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}