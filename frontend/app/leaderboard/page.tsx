"use client"

import AppShell from "@/components/AppShell";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import b2bApi from "@/app/services/api";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span title="Gold" className="text-3xl">🥇</span>;
  if (rank === 2) return <span title="Silver" className="text-3xl">🥈</span>;
  if (rank === 3) return <span title="Bronze" className="text-3xl">🥉</span>;
  return <span className="font-bold text-muted-foreground text-lg">#{rank}</span>;
}

interface TeamData {
    rank: number;
    team: string;
    credits: number;
    assets: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [currentTeam, setCurrentTeam] = useState("");
  const [credits, setCredits] = useState("0");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<TeamData[]>([]);

  useEffect(() => {
    setMounted(true);
    const storedTeam = localStorage.getItem("team_name") || localStorage.getItem("teamName");
    const token = localStorage.getItem("token");
    if (!storedTeam || !token) {
      router.push("/login");
      return;
    } 
    try {
      setCurrentTeam(storedTeam);
      
      // Fetch credits
      b2bApi.get('fetchcredits/').then(res => {
          setCredits(res.data.available_credits);
      }).catch(err => console.log(err));

      // Fetch leaderboard
      b2bApi.get('leaderboard/').then(res => {
          const mapped = res.data.leaderboard.map((t: any, index: number) => ({
              rank: index + 1,
              team: t.team_name,
              credits: parseFloat(t.available_credits),
              assets: t.secured_technologies.length
          }));
          setLeaderboard(mapped);
      }).catch(err => console.log(err));

    } catch(error) {
      console.log("Invalid team data", error);
      router.push("/login");
    }
  }, [router]);

  const filtered = leaderboard.filter((t) =>
    t.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const podiumColors = [
    "border-amber-400 bg-amber-400/5 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.1)]", // Gold
    "border-slate-300 bg-slate-300/5 text-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.1)]", // Silver
    "border-orange-400 bg-orange-400/5 text-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.1)]" // Bronze
  ];

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <AppShell role="participant" active="leaderboard" overrideCredits={credits}>
      <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground m-0">Live Leaderboard</h1>
            <p className="mt-2 text-sm text-muted-foreground font-medium">Architect Phase • Round 2</p>
            <div className="flex gap-4 mt-4 flex-wrap">
              <div className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground">
                Teams <span className="text-primary font-bold ml-1">{leaderboard.length}</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground">
                Top Credits <span className="text-primary font-bold ml-1">{leaderboard.length > 0 ? Math.max(...leaderboard.map(t => t.credits)) : 0}</span>
              </div>
              {currentTeam && (
                <div className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground">
                  Your Rank <span className="text-primary font-bold ml-1">
                    #{leaderboard.find(t => t.team === currentTeam)?.rank ?? "—"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-sm tracking-widest shrink-0">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            LIVE
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 h-12 bg-card border-border placeholder:text-muted-foreground text-sm"
            placeholder="Search team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* PODIUM */}
        {!searchTerm && leaderboard.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {leaderboard.slice(0, 3).map((team, i) => (
              <Card key={team.rank} className={`text-center py-8 transition-transform hover:-translate-y-1 ${podiumColors[i]}`}>
                <CardContent className="p-0">
                  <div className="text-5xl mb-4">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                  <h2 className="text-xl font-black">{team.team}</h2>
                  {team.team === currentTeam && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase">YOU</span>
                  )}
                  <p className="mt-4 text-lg font-bold font-mono">◈ {team.credits} CR</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* TABLE */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest text-primary">Rank</th>
                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest text-primary">Team</th>
                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-widest text-primary">Credits</th>
                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-widest text-primary">Assets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No teams match "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filtered.map((team) => {
                  const isMe = team.team === currentTeam;
                  const isTop10 = team.rank <= 10;
                  return (
                    <tr
                      key={team.rank}
                      className={`transition-colors hover:bg-secondary/50 ${isMe ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-6 py-4 align-middle">
                        <RankBadge rank={team.rank} />
                      </td>
                      <td className={`px-6 py-4 align-middle font-semibold ${isTop10 ? "text-primary" : "text-foreground"}`}>
                        {team.team}
                        {isMe && (
                          <span className="inline-block ml-3 px-2 py-0.5 rounded-md bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold tracking-widest uppercase align-middle">
                            YOU
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle text-center font-bold font-mono text-primary">{team.credits}</td>
                      <td className="px-6 py-4 align-middle text-center text-muted-foreground">{team.assets}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
