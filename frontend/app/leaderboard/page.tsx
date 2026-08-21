"use client"


import Navbar from "@/components/Navbar";

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'

const leaderboard = [
  { rank: 1,  prevRank: 2,  team: "Team Titan",   quizScore: 29, credits: 1200, assets: 0 },
  { rank: 2,  prevRank: 1,  team: "Team Nova",    quizScore: 28, credits: 1200, assets: 0 },
  { rank: 3,  prevRank: 3,  team: "Team Orbit",   quizScore: 28, credits: 1200, assets: 0 },
  { rank: 4,  prevRank: 6,  team: "Team Phoenix", quizScore: 27, credits: 1200, assets: 0 },
  { rank: 5,  prevRank: 5,  team: "Team Quantum", quizScore: 27, credits: 1200, assets: 0 },
  { rank: 6,  prevRank: 4,  team: "Team Nexus",   quizScore: 26, credits: 1200, assets: 0 },
  { rank: 7,  prevRank: 7,  team: "Team Atlas",   quizScore: 26, credits: 1200, assets: 0 },
  { rank: 8,  prevRank: 10, team: "Team Eclipse", quizScore: 25, credits: 1200, assets: 0 },
  { rank: 9,  prevRank: 9,  team: "Team Vertex",  quizScore: 25, credits: 1200, assets: 0 },
  { rank: 10, prevRank: 8,  team: "Team Zenith",  quizScore: 25, credits: 1200, assets: 0 },
  { rank: 11, prevRank: 11, team: "Team Ares",    quizScore: 24, credits: 1150, assets: 0 },
  { rank: 12, prevRank: 12, team: "Team Helios",  quizScore: 24, credits: 1150, assets: 0 },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span title="Gold" style={{ fontSize: "1.4rem" }}>🥇</span>;
  if (rank === 2) return <span title="Silver" style={{ fontSize: "1.4rem" }}>🥈</span>;
  if (rank === 3) return <span title="Bronze" style={{ fontSize: "1.4rem" }}>🥉</span>;
  return <span className="rank-number">#{rank}</span>;
}

function MovementArrow({ current, prev }: { current: number; prev: number }) {
  const diff = prev - current; // positive = moved up
  if (diff === 0) return <span className="movement-neutral">—</span>;
  if (diff > 0)
    return (
      <span className="movement-up" title={`+${diff} positions`}>
        ▲ {diff}
      </span>
    );
  return (
    <span className="movement-down" title={`${diff} positions`}>
      ▼ {Math.abs(diff)}
    </span>
  );
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [currentTeam, setCurrentTeam] = useState("");
  const [credits, setCredits] = useState("1150");
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedTeam = localStorage.getItem("team");
    const token=localStorage.getItem("token");
    if (!storedTeam) {
      router.push("/login");
      return;
    } 
    if(!token){
      router.push("/login");
      return;
    }
    try{
      const team=JSON.parse(storedTeam);
      setCurrentTeam(team.name);
      setCredits(team.credits);
    }
    catch(error){
      console.log("Invalid team data", error);
      localStorage.removeItem("team");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const filtered = leaderboard.filter((t) =>
    t.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const podiumColors = [
    {
      border: "border-yellow-400",
      text: "text-yellow-300",
      glow: "shadow-yellow-400/20",
      bg: "bg-yellow-400/5",
    },
    {
      border: "border-slate-300",
      text: "text-slate-200",
      glow: "shadow-slate-300/20",
      bg: "bg-slate-300/5",
    },
    {
      border: "border-orange-400",
      text: "text-orange-300",
      glow: "shadow-orange-400/20",
      bg: "bg-orange-400/5",
    },
  ];

  return (
    <>
      <style>{`
        /* ── Leaderboard page styles ── */
        .lb-page {
          min-height: 100vh;
          background: #070B18;
          color: #fff;
        }

        .lb-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 2rem 4rem;
        }

        /* Back button */
        .lb-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
          font-size: 0.875rem;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .lb-back:hover { border-color: #E8C07D; color: #E8C07D; }

        /* Header row */
        .lb-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 2rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .lb-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #fff 30%, #E8C07D);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
        }

        .lb-subtitle {
          color: #64748b;
          margin-top: 0.4rem;
          font-size: 0.925rem;
          letter-spacing: 0.02em;
        }

        /* Live badge */
        .lb-live {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: 9999px;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.25);
          color: #4ade80;
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .lb-live-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse-green 1.5s ease-in-out infinite;
        }
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        /* Search */
        .lb-search-wrap {
          position: relative;
          margin-top: 1.5rem;
          max-width: 420px;
        }
        .lb-search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
          font-size: 1rem;
        }
        .lb-search {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border-radius: 0.875rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-size: 0.925rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .lb-search::placeholder { color: #475569; }
        .lb-search:focus {
          border-color: #E8C07D;
          box-shadow: 0 0 0 3px rgba(232,192,125,0.12);
        }

        /* Podium */
        .lb-podium {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 2.5rem;
        }
        @media (max-width: 640px) { .lb-podium { grid-template-columns: 1fr; } }

        .podium-card {
          border-radius: 1.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: transform 0.25s, box-shadow 0.25s;
          cursor: default;
        }
        .podium-card:hover { transform: translateY(-4px); }

        .podium-medal { font-size: 3rem; margin-bottom: 0.75rem; display: block; }
        .podium-name  { font-size: 1.25rem; font-weight: 800; }
        .podium-stat  { margin-top: 0.5rem; font-size: 0.875rem; color: #94a3b8; }
        .podium-credits { margin-top: 0.35rem; font-size: 1.1rem; font-weight: 700; }

        /* Table wrapper */
        .lb-table-wrap {
          margin-top: 2.5rem;
          border-radius: 1.5rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }

        /* Sticky table header */
        .lb-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.925rem;
        }
        .lb-table thead {
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .lb-thead-row {
          background: rgba(15, 20, 40, 0.95);
          backdrop-filter: blur(12px);
        }
        .lb-table thead th {
          padding: 1.1rem 1.25rem;
          color: #E8C07D;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(232,192,125,0.15);
        }
        .lb-table thead th:first-child { text-align: left; }
        .lb-table thead th:nth-child(2) { text-align: left; }
        .lb-table thead th { text-align: center; }

        /* Body rows */
        .lb-row {
          border-top: 1px solid rgba(255,255,255,0.04);
          transition: background 0.18s, transform 0.18s;
          cursor: default;
        }
        .lb-row:hover { background: rgba(255,255,255,0.05); }

        .lb-row.is-me {
          background: rgba(232,192,125,0.07);
          border-top-color: rgba(232,192,125,0.2) !important;
        }
        .lb-row.is-me:hover { background: rgba(232,192,125,0.11); }

        /* Top 10 gold tint */
        .lb-row.top-ten td.team-name-cell { color: #E8C07D; }

        .lb-table td { padding: 1rem 1.25rem; vertical-align: middle; }
        .lb-table td:first-child { text-align: left; }
        .lb-table td:nth-child(2) { text-align: left; }
        .lb-table td { text-align: center; }

        .rank-number {
          font-size: 1rem;
          font-weight: 800;
          color: #94a3b8;
        }

        .team-name-cell {
          font-weight: 600;
          font-size: 0.975rem;
          color: #e2e8f0;
        }
        .you-badge {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0.1rem 0.55rem;
          border-radius: 9999px;
          background: rgba(232,192,125,0.15);
          border: 1px solid rgba(232,192,125,0.4);
          color: #E8C07D;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          vertical-align: middle;
        }

        /* Movement arrows */
        .movement-up    { color: #4ade80; font-size: 0.78rem; font-weight: 700; }
        .movement-down  { color: #f87171; font-size: 0.78rem; font-weight: 700; }
        .movement-neutral { color: #475569; font-size: 0.78rem; }

        /* Credits */
        .credits-cell { color: #E8C07D; font-weight: 700; }

        /* Empty state */
        .lb-empty {
          text-align: center;
          padding: 3rem;
          color: #475569;
          font-size: 0.95rem;
        }

        /* Stats bar */
        .lb-stats {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        .lb-stat-pill {
          padding: 0.35rem 0.875rem;
          border-radius: 9999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #64748b;
          font-size: 0.8rem;
        }
        .lb-stat-pill span { color: #E8C07D; font-weight: 700; margin-left: 0.25rem; }
      `}</style>

      <main className="lb-page">
        <Navbar overrideCredits={credits} />

        <div className="lb-content">

          {/* Back */}
          <Link href="/stu_dashboard" className="lb-back">
            ← Back to Dashboard
          </Link>

          {/* Header */}
          <div className="lb-header">
            <div>
              <h1 className="lb-title">LIVE LEADERBOARD</h1>
              <p className="lb-subtitle">Architect Phase • Round 2</p>
              <div className="lb-stats">
                <div className="lb-stat-pill">Teams <span>{leaderboard.length}</span></div>
                <div className="lb-stat-pill">Top Credits <span>{Math.max(...leaderboard.map(t => t.credits))}</span></div>
                {currentTeam && (
                  <div className="lb-stat-pill">
                    Your Rank <span>
                      #{leaderboard.find(t => t.team === currentTeam)?.rank ?? "—"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="lb-live">
              <div className="lb-live-dot" />
              LIVE
            </div>
          </div>

          {/* Search */}
          <div className="lb-search-wrap">
            <span className="lb-search-icon">🔍</span>
            <input
              ref={searchRef}
              className="lb-search"
              placeholder="Search team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Podium — only when not searching */}
          {!searchTerm && (
            <div className="lb-podium">
              {leaderboard.slice(0, 3).map((team, i) => (
                <div
                  key={team.rank}
                  className={`podium-card ${podiumColors[i].border} ${podiumColors[i].bg} ${podiumColors[i].glow} shadow-xl`}
                >
                  <span className="podium-medal">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </span>
                  <h2 className={`podium-name ${podiumColors[i].text}`}>{team.team}</h2>
                  {team.team === currentTeam && (
                    <span className="you-badge">YOU</span>
                  )}
                  <p className="podium-stat">Quiz Score: {team.quizScore}</p>
                  <p className={`podium-credits ${podiumColors[i].text}`}>
                    ◈ {team.credits} credits
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          <div className="lb-table-wrap">
            <table className="lb-table">
              <thead>
                <tr className="lb-thead-row">
                  <th style={{ textAlign: "left" }}>Rank</th>
                  <th style={{ textAlign: "left" }}>Team</th>
                  <th>Movement</th>
                  <th>Quiz Score</th>
                  <th>Credits</th>
                  <th>Assets</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="lb-empty">
                      No teams match &quot;{searchTerm}&quot;
                    </td>
                  </tr>
                ) : (
                  filtered.map((team) => {
                    const isMe = team.team === currentTeam;
                    const isTop10 = team.rank <= 10;
                    return (
                      <tr
                        key={team.rank}
                        className={`lb-row${isMe ? " is-me" : ""}${isTop10 ? " top-ten" : ""}`}
                      >
                        <td>
                          <RankBadge rank={team.rank} />
                        </td>
                        <td>
                          <span className="team-name-cell">
                            {team.team}
                            {isMe && <span className="you-badge">YOU</span>}
                          </span>
                        </td>
                        <td>
                          <MovementArrow current={team.rank} prev={team.prevRank} />
                        </td>
                        <td style={{ color: "#cbd5e1" }}>{team.quizScore}</td>
                        <td className="credits-cell">{team.credits}</td>
                        <td style={{ color: "#94a3b8" }}>{team.assets}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </>
  );
}