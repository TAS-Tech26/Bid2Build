"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Coins, LayoutDashboard, Store, Trophy, Bell, ShieldAlert, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
}

interface Props {
  role: "participant" | "admin";
  active?: string;
  overrideCredits?: number | string;
  children: ReactNode;
}

const roleAccent = {
  participant: {
    label: "PARTICIPANT CONSOLE",
    color: "text-primary",
  },
  admin: {
    label: "ADMIN CONSOLE",
    color: "text-foreground",
  },
};

export default function AppShell({ role, active, overrideCredits, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [credits, setCredits] = useState("1150");
  const [isMounted, setIsMounted] = useState(false);

  // Global Disruption State
  const [disruption, setDisruption] = useState<{title: string, description: string, expected_adaptation: string, affected_teams: string} | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedTeam = localStorage.getItem("teamName") || localStorage.getItem("team_name");
    const storedCredits = localStorage.getItem("credits");

    if (storedTeam) {
      setTeamName(storedTeam);
    }
    if (storedCredits) {
      setCredits(storedCredits);
    } else {
      localStorage.setItem("credits", "1150");
      setCredits("1150");
    }

    const handleStorageChange = () => {
      const updatedCredits = localStorage.getItem("credits");
      const updatedTeam = localStorage.getItem("teamName") || localStorage.getItem("team_name");
      if (updatedCredits) setCredits(updatedCredits);
      if (updatedTeam) setTeamName(updatedTeam);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Global WebSocket Listener for Disruptions
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8002/';
    const ws = new WebSocket(`${wsUrl}ws/global/`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'market_disruption') {
        setDisruption(msg.data);
      }
    };

    return () => ws.close();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("teamName");
    localStorage.removeItem("team_name");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const nav: NavItem[] = role === "participant" ? [
    { id: "dashboard", label: "Dashboard", href: "/stu_dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "marketplace", label: "Marketplace", href: "/marketplace", icon: <Store className="w-5 h-5" /> },
    { id: "leaderboard", label: "Leaderboard", href: "/leaderboard", icon: <Trophy className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", href: "/notifications", icon: <Bell className="w-5 h-5" /> },
  ] : [
    { id: "admin-dashboard", label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "admin-teams", label: "Teams", href: "/admin/teams", icon: <Store className="w-5 h-5" /> },
    { id: "admin-auctions", label: "Auctions", href: "/admin/auctions", icon: <Trophy className="w-5 h-5" /> },
    { id: "admin-disruptions", label: "Disruptions", href: "/admin/disruptions", icon: <ShieldAlert className="w-5 h-5" /> },
    { id: "admin-judging", label: "Judging", href: "/admin/judging", icon: <Bell className="w-5 h-5" /> },
  ];

  const displayCredits = overrideCredits !== undefined ? String(overrideCredits) : credits;

  if (!isMounted) {
    return <div className="min-h-screen bg-background text-foreground flex flex-col" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* GLOBAL DISRUPTION OVERLAY */}
      {disruption && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_100px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-500 relative">
            <button 
              onClick={() => setDisruption(null)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-6 text-destructive">
              <AlertTriangle className="w-12 h-12 animate-pulse" />
              <div>
                <h2 className="text-sm font-bold tracking-[0.3em] uppercase opacity-80">
                  Critical Market Disruption
                </h2>
                <h1 className="text-4xl font-black tracking-tight leading-none mt-1">
                  {disruption.title}
                </h1>
              </div>
            </div>

            <p className="text-lg text-foreground/90 mb-8 leading-relaxed">
              {disruption.description}
            </p>

            <div className="space-y-6">
              <div className="bg-background/50 rounded-xl p-4 border border-border">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Affected Technologies</h3>
                <p className="font-mono text-sm">{disruption.affected_teams}</p>
              </div>

              <div className="bg-background/50 rounded-xl p-4 border border-border">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Adaptation Required</h3>
                <p className="font-mono text-sm">{disruption.expected_adaptation}</p>
              </div>
            </div>

            <Button 
              onClick={() => setDisruption(null)}
              variant="destructive" 
              className="w-full mt-8 h-12 font-bold tracking-widest uppercase text-sm"
            >
              Acknowledge & Adapt
            </Button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1700px] items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link
              href={role === "admin" ? "/admin/dashboard" : "/marketplace"}
              className="font-black text-xl uppercase tracking-tighter hover:text-primary transition-colors font-sans"
            >
              BID2BUILD
            </Link>

            <span
              className={`hidden font-mono text-[10px] uppercase tracking-[0.2em] md:inline ${roleAccent[role].color}`}
            >
              {roleAccent[role].label}
            </span>
          </div>

          <div className="flex items-center gap-6">
             {role === "participant" && (
                <div className="flex items-center gap-5">
                    {/* Market Status Badge */}
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-[#E8C07D] border border-[#E8C07D]/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E8C07D] animate-pulse" />
                    BUILD PHASE
                    </span>

                    {/* Dynamic Credits Pill */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <Coins className="h-4 w-4 text-primary drop-shadow-[0_0_5px_rgba(191,255,0,0.5)]" />
                        <span className="text-primary font-mono font-extrabold text-sm tracking-wide">
                            {Number(displayCredits).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium font-sans">CR</span>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4">
              <span className="hidden text-sm font-bold text-muted-foreground sm:block">
                {teamName || (role === "admin" ? "ADMIN" : "TEAM")}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest transition hover:bg-white/5 active:bg-white/10 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="mx-auto flex-grow grid max-w-[1700px] grid-cols-[80px_1fr] gap-8 px-6 py-6 w-full">
        {/* SIDEBAR */}
        <aside className="flex flex-col items-center">
          <div className="sticky top-24 space-y-4 flex flex-col items-center w-full">
            <div className="w-8 h-[1px] bg-border/60 mb-2" />

            <div className="space-y-3.5 flex flex-col items-center w-full">
              {nav.map((item) => {
                const selected = active === item.id || pathname.startsWith(item.href);

                return (
                  <div
                    key={item.id}
                    className="relative group flex items-center justify-center w-full"
                  >
                    {/* Left Sliding Pill */}
                    <div
                      className={`absolute left-0 w-1 bg-primary rounded-r-md transition-all duration-300 ${
                        selected
                          ? "h-8 opacity-100"
                          : "h-0 opacity-0 group-hover:h-4 group-hover:opacity-100"
                      }`}
                    />

                    {/* Navigation Icon Button */}
                    <Link
                      href={item.href}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all duration-300 relative cursor-pointer
                      ${
                        selected
                          ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(191,255,0,0.25)] rounded-xl"
                          : "border-transparent bg-white/[0.02] text-muted-foreground hover:border-border hover:bg-white/[0.06] hover:text-white hover:rounded-xl"
                      }`}
                    >
                      {item.icon}
                    </Link>

                    {/* Tooltip */}
                    <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all duration-200 origin-left bg-black border border-border px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="animate-fade-up min-w-0 w-full">{children}</main>
      </div>
    </div>
  );
}
