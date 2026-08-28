// stu_dashboard/page.tsx


"use client"


import AppShell from '@/components/AppShell'
import {Badge} from '@/components/ui/badge'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

import b2bApi from '../services/api'

import {ArrowRight, Award, Briefcase, CheckCircle2, Cloud, Coins, Cpu, Hammer, ShoppingBag, Trophy, Users} from 'lucide-react'


export default function StudentDashboard() {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [credits, setCredits] = useState("0");
  const [teamRank, setTeamRank] = useState(0);
  const [ownedAssets, setOwnedAssets] = useState<any[]>([]);

  useEffect(() => {
    const storedTeam = localStorage.getItem("team_name") || localStorage.getItem("teamName");
    const token = localStorage.getItem("token");
    if(!token){
      router.push("/login");
      return;
    }
    if(!storedTeam){
      router.push("/login");
      return;
    }
    const fetchData = async () => {
      try{
        const [credRes, leadRes] = await Promise.all([
          b2bApi.get('fetchcredits/', { headers: { Authorization: `Bearer ${token}` } }),
          b2bApi.get('leaderboard/', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setCredits(credRes.data.available_credits);
        
        const leaderboard = leadRes.data.leaderboard;
        // Find current team
        const myTeamIndex = leaderboard.findIndex((t: any) => t.team_name === storedTeam);
        if (myTeamIndex !== -1) {
          const myTeam = leaderboard[myTeamIndex];
          setTeamRank(myTeamIndex + 1);
          
          // Map backend secured_technologies to the ownedAssets format
          const mappedAssets = myTeam.secured_technologies.map((tech: any) => ({
            name: tech.name,
            category: tech.category,
            cost: tech.winning_bid,
            status: "Acquired",
            iconCode: tech.name.includes("Vision") ? "cpu" : tech.name.includes("Cloud") ? "cloud" : tech.name.includes("Investor") ? "users" : "briefcase",
          }));
          setOwnedAssets(mappedAssets);
        }
      } catch(e) {
        console.log("Error fetching dashboard data:", e);
      }
    }
    fetchData();
    try {
        setTeamName(storedTeam);
    } catch(error) {
      console.log("Invalid team data", error);
    }
  }, [router]);

  const getAssetIcon = (iconCode: string) => {
    switch (iconCode) {
      case "cpu": return <Cpu className="h-5 w-5 text-amber-500" />;
      case "cloud": return <Cloud className="h-5 w-5 text-blue-500" />;
      case "users": return <Users className="h-5 w-5 text-purple-500" />;
      default: return <Briefcase className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-primary/15 text-primary hover:bg-primary/25 border-primary/20">Active</Badge>;
      case "Operational":
        return <Badge variant="outline" className="text-blue-400 border-blue-500/30">Operational</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Acquired</Badge>;
    }
  };

  return (
    <AppShell role="participant" active="dashboard" overrideCredits={credits}>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
        
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-black tracking-tight">{teamName || "TEAM"}</h1>
          <p className="text-muted-foreground mt-1">Welcome back, founders.</p>
        </div>

        {/* PROGRESS TIMELINE */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Venture Progress
            </h2>
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-4">
              <div className="flex-1 flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary shrink-0">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Marketplace</p>
                  <p className="text-xs text-muted-foreground">Completed • Asset Bidding</p>
                </div>
              </div>

              <div className="h-0.5 flex-1 bg-border hidden lg:block" />

              <div className="flex-1 flex items-center gap-4">
                <div className="relative flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/30">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <Hammer className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-primary font-bold text-sm tracking-wide">Build Phase</p>
                  <p className="text-xs text-primary/70 font-medium">Active • Architect Phase</p>
                </div>
              </div>

              <div className="h-0.5 flex-1 bg-border border-dashed hidden lg:block" />

              <div className="flex-1 flex items-center gap-4 opacity-40">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-muted text-muted-foreground shrink-0 border border-border">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold text-sm">Submission</p>
                  <p className="text-xs text-muted-foreground">Locked • Evaluation & Pitch</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8 items-start">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-8">
            
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Credits</p>
                    <p className="text-2xl font-black font-mono mt-1">{Number(credits).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-secondary/80 border border-border rounded-xl text-foreground">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Rank</p>
                    <p className="text-2xl font-black font-mono mt-1">#{teamRank || "-"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Assets Owned</p>
                    <p className="text-2xl font-black font-mono mt-1">{ownedAssets.length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Auction Wins</p>
                    <p className="text-2xl font-black font-mono mt-1">{ownedAssets.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ASSETS */}
            <Card>
              <CardHeader>
                <CardTitle>Acquired Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ownedAssets.map((asset) => (
                    <div
                      key={asset.name}
                      className="flex flex-col justify-between rounded-xl border bg-card/50 p-5 transition-all hover:border-primary/40 hover:shadow-glow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-secondary border border-border rounded-lg">
                          {getAssetIcon(asset.iconCode)}
                        </div>
                        {getStatusBadge(asset.status)}
                      </div>

                      <div className="mb-4">
                        <h3 className="text-base font-bold tracking-tight truncate" title={asset.name}>
                          {asset.name}
                        </h3>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {asset.category}
                        </span>
                      </div>

                      <div className="pt-3 border-t flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Purchase</p>
                          <p className="text-sm font-bold font-mono mt-0.5">{asset.cost} CR</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN */}
          <Card className="bg-card sticky top-24">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link
                href="/marketplace"
                className="flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-primary to-accent hover:opacity-90 text-white py-4 font-bold transition-all shadow-glow hover:scale-[1.02]"
              >
                <ShoppingBag className="h-5 w-5" />
                Enter Marketplace
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/leaderboard"
                className="flex items-center justify-center gap-3 rounded-xl border bg-secondary hover:bg-secondary/80 py-4 font-semibold transition-all hover:scale-[1.02]"
              >
                <Trophy className="h-5 w-5 text-muted-foreground" />
                View Leaderboard
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
