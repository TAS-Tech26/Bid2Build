"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Coins, ShieldAlert, Award } from "lucide-react";

interface NavbarProps {
  overrideCredits?: number | string;
}

export default function Navbar({ overrideCredits }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [credits, setCredits] = useState("1150");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTeam = localStorage.getItem("teamName");
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

    // Listener for storage updates across tabs
    const handleStorageChange = () => {
      const updatedCredits = localStorage.getItem("credits");
      const updatedTeam = localStorage.getItem("teamName");
      if (updatedCredits) setCredits(updatedCredits);
      if (updatedTeam) setTeamName(updatedTeam);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("teamName");
    router.push("/login");
  };

  if (!isMounted) {
    // Avoid hydration mismatch by rendering a skeleton structure matching design dimensions
    return (
      <header className="sticky top-0 z-50 w-full h-[88px] border-b border-white/10 bg-[#070B18]/70 backdrop-blur-md px-10" />
    );
  }

  const navLinks = [
    { name: "Dashboard", href: "/stu_dashboard" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  const displayCredits = overrideCredits !== undefined ? String(overrideCredits) : credits;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070B18]/70 backdrop-blur-md px-10 py-4 flex items-center justify-between">
      {/* LEFT: LOGO & TITLE */}
      <Link href="/stu_dashboard" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]">
        <Image
          src="/bid2build-logo.png"
          alt="Bid2Build Logo"
          width={40}
          height={40}
          className="drop-shadow-[0_0_15px_rgba(232,192,125,.3)] transition-transform duration-300 group-hover:rotate-6"
        />
        <h1 className="font-[family:var(--font-orbitron)] text-2xl font-black tracking-wider bg-gradient-to-r from-white via-white to-[#E8C07D] bg-clip-text text-transparent">
          BID2BUILD
        </h1>
      </Link>

      {/* CENTER: NAV LINKS */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-2 text-sm font-semibold tracking-wider transition-all duration-300 hover:text-white ${
                isActive ? "text-[#E8C07D]" : "text-slate-400"
              }`}
            >
              {link.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E8C07D] to-[#8B5CF6] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* RIGHT: USER STATS & ACTIONS */}
      <div className="flex items-center gap-5">
        {/* Market Status Badge */}
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-[#E8C07D] border border-[#E8C07D]/20 shadow-[0_0_15px_rgba(232,192,125,0.05)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E8C07D] animate-pulse" />
          Build Phase
        </span>

        {/* Dynamic Credits Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
          <Coins className="h-4 w-4 text-[#E8C07D] drop-shadow-[0_0_5px_rgba(232,192,125,.5)]" />
          <span className="text-[#E8C07D] font-extrabold text-sm tracking-wide">
            {Number(displayCredits).toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 font-medium">Credits</span>
        </div>

        {/* Team Name display */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">TEAM</span>
          <span className="text-sm text-white font-bold tracking-wide">
            {teamName || "FOUNDER"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign out of panel"
          className="flex items-center justify-center p-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-all duration-300 hover:scale-105"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
