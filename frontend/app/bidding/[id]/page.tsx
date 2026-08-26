"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import NotificationStack from "@/components/NotificationToast";
import { Notifications, useNotifications } from "@/components/useNotifications";
import b2bApi from '@/app/services/api';


type TechnologyStatus ="QUEUED" | "ACTIVE" | "SOLD" | "UNSOLD";
interface Technology {
  id: number;
  name: string;
  description: string;
  status: TechnologyStatus;
  base_price: number;
  current_highest_bid: number;
  highest_bidder_id: number | null;
  highest_bidder: {
    id: number;
    name: string;
  } | null;
  bid_timer: string | null;
  end_time:string|null;
  
}
interface Team {
  team_name: string;
  team_id:number;
  is_active:boolean;
}
interface BidEntry {
  id: number;
  team: string;
  amount: number;
  time: string;
  isYou: boolean;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return { m: String(m).padStart(2, "0"), s: String(sec).padStart(2, "0") };
}

function calc_remaining_time(endTime:string|null) {
  if(!endTime) return 0;
      return Math.max(0, Math.floor(new Date(endTime).getTime()-Date.now())/1000);
}

export default function BiddingRoom() {
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [highestBid, setHighestBid] = useState(0);
  const [leader, setLeader] = useState<string | null>(null);
  const [bidTimer, setBidTimer] = useState(0);
  const [credits, setCredits] = useState(0);
  const [bidFeed, setBidFeed] = useState<BidEntry[]>([]);
  const [hasWithdrawn, setHasWithdrawn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router=useRouter();
  const {notifications,push,dismiss} = useNotifications();
  const params = useParams();
  const id = String(params.id);

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const fetch_credits=async()=>{
        try{
        const response= await b2bApi.get('api/fetchcredits/',{
             headers:{
              Authorization:`Bearer ${token}`,
            }},);
      setCredits(response.data.available_credits);
        //console.log(response.data);
      }
      catch(e){
        console.log("Failed to fetch team credits, error:", e);
      }
    }
    fetch_credits();
    }, [router]);

  useEffect(() => {
    const fetchRoom = async () => {
    const token=localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const response=await b2bApi.get(
          `/api/items/${id}/room/`,
          {headers: {Authorization:`Bearer ${token}`,},}
      );
      const data = response.data;
      setTechnology(data.technology);
      setTeams(data.teams_in_room);
      setBidFeed(
        data.bid_history.map(
          (bid: any) => ({
            id: bid.id,
            team: bid.team_name,
            amount: Number(bid.amount),
            time: new Date(bid.timestamp).toLocaleTimeString(),
            isYou:bid.team_name ===localStorage.getItem("team_name"),
          })
        )
      );
      setHighestBid(Number(data.technology.current_highest_bid));
      setLeader(data.technology.highest_bidder?.name ?? null);
      if (data.technology.bid_timer){
        setBidTimer(calc_remaining_time(data.technology.bid_timer));
      }else setBidTimer(0);
    } catch (error) {
      console.error("Failed to load auction room:",error);
    } finally {
      setLoading(false);
    }
  };
  fetchRoom();
}, [id, router]);


useEffect(() => {
  const ws = new WebSocket(`ws://127.0.0.1:8002/ws/bids/${id}/`);
  ws.onopen = () => {
    console.log("Connected to auction WebSocket");
  };
  ws.onmessage = (event) => {
    const data =JSON.parse(event.data);
    console.log("Auction update:",data);

    switch (data.type) {
      case "bid_update":
        setHighestBid(Number(data.new_highest_bid));
        setLeader(data.highest_bidder_name);

        if (data.bid_timer) {
          setBidTimer(calc_remaining_time(data.bid_timer));
        }else setBidTimer(0);

        setBidFeed(prev => [
          ...prev,
          {
            id: Date.now(),
            team:
              data.highest_bidder_name,
            amount:
              Number(
                data.new_highest_bid
              ),
            time:
              new Date()
                .toLocaleTimeString(),
            isYou:
              data.highest_bidder_name ===
              localStorage.getItem(
                "team_name"
              ),
          }
        ]);
        break;

      case "participant_update":
        if (data.is_active){
          setTeams(prev => {
            const exists =
              prev.some(
                t => t.team_name ===data.team_name
              );

            if (exists)
              return prev;

            return [...prev,{team_id:data.team_id, team_name:data.team_name, is_active:data.is_active}];
          });
        }

        if (!data.is_active){
          setTeams(prev =>
            prev.map(t => t.team_name !==data.team_name ? {...t,is_active:false}:t)
            );
        }
        break;

      case "auction_started":
        setBidTimer(0);
        break;

      case "auction_ended":
        setBidTimer(0);
        break;
    }
  };

  ws.onerror = error => {
    console.error("WebSocket error:",error);
  };
  ws.onclose = () => {
    console.log("Auction WebSocket closed");
  };
  return () => {
    ws.close();
  };
}, [id]);

const placeBid = async (increment: number) => {
  const token=localStorage.getItem("token");
  if (!token)
    return;
  
  const newBid=highestBid + increment;
  try {
    await b2bApi.post("/api/bid/",
      {
        tech_id: Number(id),
        bid_amount: newBid,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    console.error("Bid failed:",error.response?.data ||error);
    alert(error.response?.data?.error ||"Unable to place bid.");
  }
};
  
  const feedEndRef = useRef<HTMLDivElement>(null);
  /* scroll feed to bottom on new bid */
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bidFeed]);

  useEffect(() => {
  if (bidTimer <= 0) {
    return;
  }

  const interval = setInterval(() => {
    setBidTimer(prev => Math.max(0, prev - 1));
  }, 1000);

  return () => clearInterval(interval);
}, [bidTimer]);

  /* ── derived counts ── */
  const remaining  = teams.filter(t => t.is_active).length;
  const backedOut  = teams.filter(t => !t.is_active).length;
  const isCritical=bidTimer > 0 && bidTimer <= 5;
  const isBidTimerExpired=highestBid > 0 && bidTimer <= 0;

  async function backOut() {
    const token=localStorage.getItem('token');
    try{
      await b2bApi.post('api/back-out/',{tech_id:Number(id)},{headers:{Authorization:`Bearer ${token}`,}, });
      setHasWithdrawn(true);
    }catch(e){
      console.log('Unable to back-out, error:', e);
    }
  }

  /* ── timer display ── */
  const { m, s } = fmtTime(bidTimer);

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
     {<NotificationStack notifications={notifications} onDismiss={dismiss}/>}

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
                {technology?.name}
              </h1>
              <p style={{ color: "#475569", marginTop: 8, fontSize: "0.9rem", letterSpacing: "0.06em" }}>
                 Starting Bid: <span style={{ color: "#E8C07D", fontWeight: 700 }}>{technology?.base_price} CR</span>
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
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - bidTimer / 15)}`}
                    stroke={isCritical ? "#EF4444" : isBidTimerExpired ? "#374151" : "#E8C07D"}
                  />
                </svg>
                <div className="countdown-inner">
                  <span
                    className={`countdown-digits ${isCritical ? "critical-pulse" : ""}`}
                    style={{ color: isCritical ? "#EF4444" : isBidTimerExpired ? "#374151" : "#E8C07D" }}
                  >
                    {m}:{s}
                  </span>
                  <span className="countdown-label">
                    {isBidTimerExpired ? "ENDED" : bidTimer>0 ? "REMAINING" : "WAITING FOR BID"}
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
                  className={`bid-btn bid-btn--primary ${hasWithdrawn || isBidTimerExpired ? "bid-btn--disabled" : ""}`}
                  onClick={() => placeBid(50)}
                  disabled={hasWithdrawn || isBidTimerExpired}
                >
                  +50 BID
                </button>
                <button
                  className={`bid-btn bid-btn--outline ${hasWithdrawn || isBidTimerExpired ? "bid-btn--disabled" : ""}`}
                  onClick={() => placeBid(100)}
                  disabled={hasWithdrawn || isBidTimerExpired}
                  style={{ border: "2px solid var(--gold)" }}
                >
                  +100 BID
                </button>
                <button
                  className={`bid-btn bid-btn--outline ${hasWithdrawn || isBidTimerExpired ? "bid-btn--disabled" : ""}`}
                  onClick={() => placeBid(250)}
                  disabled={hasWithdrawn || isBidTimerExpired}
                  style={{ border: "2px solid rgba(139,92,246,0.7)", color: "#8B5CF6" }}
                >
                  +250 BID
                </button>
              </div>

              {/* ── Back Out ── */}
              <button
                className="back-out-btn"
                onClick={backOut}
                disabled={hasWithdrawn || isBidTimerExpired}
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
                  const isLeader  = team.team_name===leader;
                  const isBacked  = !team.is_active;
                  return (
                    <div
                      key={team.team_name}
                      className={`team-row ${isLeader ? "team-row--leader" : ""} ${isBacked ? "team-row--backedout" : ""}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                          background: isBacked ? "#EF4444" : isLeader ? "#E8C07D" : "#22C55E",
                        }} />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: isLeader ? "#E8C07D" : "#e2e8f0" }}>
                          {team.team_name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.06em",
                        color: isBacked ? "#EF4444" : isLeader ? "#E8C07D" : "#22C55E",
                        background: isBacked ? "rgba(239,68,68,0.1)" : isLeader ? "rgba(232,192,125,0.1)" : "rgba(34,197,94,0.1)",
                        borderRadius: 6, padding: "2px 8px",
                      }}>
                        {isBacked? "Backed-Out" : isLeader ? "Highest Bidder" : "Active"}
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