"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import b2bApi from '../services/api';
import { 
  ShoppingBag, 
  Hammer, 
  Flame, 
  CheckCircle2, 
  Coins, 
  Trophy, 
  Briefcase, 
  Award, 
  ArrowRight,
  Cpu,
  Cloud,
  Users,
  TrendingUp,
  Sparkles
} from "lucide-react";

const ownedAssets = [
  {
    name: "Computer Vision",
    category: "Core Tech",
    cost: 300,
    marketValue: 390,
    status: "Active",
    iconCode: "cpu",
  },
  {
    name: "Cloud Infrastructure",
    category: "Business Resource",
    cost: 150,
    marketValue: 185,
    status: "Operational",
    iconCode: "cloud",
  },
  {
    name: "Investor Network",
    category: "Special Asset",
    cost: 200,
    marketValue: 260,
    status: "Active",
    iconCode: "users",
  },
];
const teamData = {
  rank: 12,
  credits: 1150,
  round: "Architect Phase",
};


export default function StudentDashboard() {

  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [credits, setCredits] = useState("1150");


  useEffect(() => {

    const storedTeam = localStorage.getItem("team_name");
    const token=localStorage.getItem("token");
    if(!token){
      router.push("/login");
      return;
    }
    if(!storedTeam){
      router.push("/login");
      return;
    }
    const fetch_credits=async()=>{
      try{
        const response=await b2bApi.get('api/fetchcredits/',{
                   headers:{
                    Authorization:`Bearer ${token}`,
                  }},);
        setCredits(response.data.available_credits);
      }catch(e){
        console.log("Error fetching credits, error:", e);
      }
    }
    fetch_credits();
    try{
        setTeamName(storedTeam);
    }
    catch(error){
      console.log("Invalid team data", error);
      //localStorage.removeItem("team");
      //localStorage.removeItem("token");
      //router.push("/login");
    }
    
  },[router]);

  const getAssetIcon = (iconCode: string) => {
    switch (iconCode) {
      case "cpu":
        return <Cpu className="h-5 w-5 text-amber-400 animate-pulse" />;
      case "cloud":
        return <Cloud className="h-5 w-5 text-cyan-400" />;
      case "users":
        return <Users className="h-5 w-5 text-[#8B5CF6]" />;
      default:
        return <Briefcase className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case "Operational":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Operational
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-[#E8C07D] border border-[#E8C07D]/20">
            Acquired
          </span>
        );
    }
  };



  return (

    <main
      className="
      relative
      min-h-screen
      bg-[#070B18]
      text-white
      overflow-hidden
      "
    >



      {/* BACKGROUND */}

      <div className="absolute inset-0 -z-10">

        <div
          className="
          absolute inset-0
          bg-[radial-gradient(circle_at_50%_10%,rgba(232,192,125,0.15),transparent_45%)]
          "
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:`
            linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)
            `,
            backgroundSize:"70px 70px",
          }}
        />

      </div>

      <Navbar overrideCredits={credits} />

      <div className="px-10 py-10">





      {/* HEADER */}

      <header
        className="
        flex
        justify-between
        items-center
        mb-14
        "
      >


        <div>

          <h1
            className="
            text-5xl
            font-black

            bg-gradient-to-r
            from-white
            to-[#E8C07D]

            bg-clip-text
            text-transparent
            "
          >
            {teamName || "TEAM"}
          </h1>


          <p className="text-slate-400 mt-3 text-lg">
            Welcome back, founders.
          </p>


        </div>

      </header>








      {/* PROGRESS TIMELINE */}
      <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#E8C07D] mb-6">
          Venture Progress
        </h2>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-4">
          {/* Step 1: Marketplace */}
          <div className="flex-1 flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Marketplace</p>
              <p className="text-xs text-slate-400">Completed • Asset Bidding</p>
            </div>
          </div>

          <div className="h-[2px] flex-1 bg-gradient-to-r from-emerald-500 to-[#E8C07D] hidden lg:block" />
          <div className="w-[2px] h-6 bg-gradient-to-b from-emerald-500 to-[#E8C07D] ml-6 block lg:hidden" />

          {/* Step 2: Build Phase */}
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex items-center justify-center h-12 w-12 rounded-2xl bg-[#E8C07D]/10 border border-[#E8C07D]/50 text-[#E8C07D] shadow-[0_0_20px_rgba(232,192,125,0.25)] shrink-0">
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#E8C07D] border border-[#070B18] animate-ping" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#E8C07D] border border-[#070B18]" />
              <Hammer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[#E8C07D] font-extrabold text-sm tracking-wide">Build Phase</p>
              <p className="text-xs text-[#E8C07D]/70 font-medium">Active • Architect Phase</p>
            </div>
          </div>

          <div className="h-[2px] flex-1 bg-gradient-to-r from-[#E8C07D]/40 to-white/5 border-t border-dashed border-white/10 hidden lg:block" />
          <div className="w-[2px] h-6 bg-gradient-to-b from-[#E8C07D]/40 to-white/5 border-l border-dashed border-white/10 ml-6 block lg:hidden" />

          {/* Step 3: Disruption Phase */}
          <div className="flex-1 flex items-center gap-4 opacity-40">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 shrink-0">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-slate-400 font-semibold text-sm">Disruption Phase</p>
              <p className="text-xs text-slate-500">Locked • Event Simulation</p>
            </div>
          </div>

          <div className="h-[2px] flex-1 bg-white/5 border-t border-dashed border-white/10 hidden lg:block" />
          <div className="w-[2px] h-6 bg-white/5 border-l border-dashed border-white/10 ml-6 block lg:hidden" />

          {/* Step 4: Submission */}
          <div className="flex-1 flex items-center gap-4 opacity-40">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-slate-400 font-semibold text-sm">Submission</p>
              <p className="text-xs text-slate-500">Locked • Evaluation & Pitch</p>
            </div>
          </div>
        </div>
      </section>







      {/* MAIN */}

      <section
        className="
        grid
        grid-cols-1
        lg:grid-cols-[1.4fr_0.6fr]
        gap-8
        items-start
        "
      >

        {/* LEFT COLUMN: TEAM OVERVIEW & ACQUIRED ASSETS */}
        <div className="flex flex-col gap-8">
          
          {/* TEAM OVERVIEW CARD */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#E8C07D]/10 blur-3xl -z-10" />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-[#8B5CF6]/5 blur-3xl -z-10" />

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-white to-[#E8C07D] bg-clip-text text-transparent">
                  Team Overview
                </h2>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                  Real-Time Diagnostics
                </p>
              </div>
              <Award className="h-7 w-7 text-[#E8C07D] opacity-80" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Stat 1: Credits */}
              <div className="flex items-center gap-4 bg-black/20 border border-white/5 rounded-2xl p-5 hover:border-[#E8C07D]/30 transition-all duration-300">
                <div className="p-3 bg-[#E8C07D]/10 rounded-xl text-[#E8C07D]">
                  <Coins className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Credits</p>
                  <p className="text-xl font-black text-[#E8C07D] mt-1">{Number(credits).toLocaleString()}</p>
                </div>
              </div>

              {/* Stat 2: Rank */}
              <div className="flex items-center gap-4 bg-black/20 border border-white/5 rounded-2xl p-5 hover:border-[#8B5CF6]/30 transition-all duration-300">
                <div className="p-3 bg-[#8B5CF6]/10 rounded-xl text-[#8B5CF6]">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Rank</p>
                  <p className="text-xl font-black text-[#8B5CF6] mt-1">#{teamData.rank}</p>
                </div>
              </div>

              {/* Stat 3: Assets Owned */}
              <div className="flex items-center gap-4 bg-black/20 border border-white/5 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300">
                <div className="p-3 bg-cyan-400/10 rounded-xl text-cyan-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assets Owned</p>
                  <p className="text-xl font-black text-cyan-400 mt-1">{ownedAssets.length}</p>
                </div>
              </div>

              {/* Stat 4: Auction Wins */}
              <div className="flex items-center gap-4 bg-black/20 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Auction Wins</p>
                  <p className="text-xl font-black text-emerald-400 mt-1">{ownedAssets.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ASSETS */}
          <div
            className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.05]
            backdrop-blur-xl
            p-8
            "
          >
            <h2
              className="
              text-2xl
              font-bold
              text-[#E8C07D]
              mb-6
              "
            >
              Acquired Assets
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {ownedAssets.map((asset) => (
                <div
                  key={asset.name}
                  className="
                  relative
                  overflow-hidden
                  flex
                  flex-col
                  justify-between
                  rounded-2xl
                  bg-black/35
                  border
                  border-white/10
                  p-6
                  hover:border-[#E8C07D]/40
                  hover:-translate-y-1
                  hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]
                  transition-all
                  duration-300
                  "
                >
                  {/* Card background detail */}
                  <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/[0.02] blur-lg -z-10" />

                  {/* Header Row: Category Icon & Status Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-2.5 bg-white/[0.04] border border-white/10 rounded-xl">
                      {getAssetIcon(asset.iconCode)}
                    </div>
                    {getStatusBadge(asset.status)}
                  </div>

                  {/* Body: Asset Title & Category Tag */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white tracking-wide truncate" title={asset.name}>
                      {asset.name}
                    </h3>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md">
                      {asset.category}
                    </span>
                  </div>

                  {/* Footer Row: Purchase Cost vs Market Value */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Purchase</p>
                      <p className="text-sm font-extrabold text-slate-300 mt-0.5">{asset.cost} <span className="text-xs text-slate-500 font-medium">CR</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#E8C07D] font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                        Value
                        <TrendingUp className="h-3 w-3 text-emerald-400" />
                      </p>
                      <p className="text-sm font-extrabold text-[#E8C07D] mt-0.5">{asset.marketValue} <span className="text-xs text-[#E8C07D]/50 font-medium">CR</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTION PANEL */}
        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-gradient-to-br from-white/[0.04] to-white/[0.01]
          backdrop-blur-xl
          p-8
          shadow-[0_20px_50px_rgba(0,0,0,0.3)]
          "
        >
          <h2
            className="
            text-2xl
            font-bold
            text-[#E8C07D]
            mb-6
            "
          >
            Actions
          </h2>

          <div className="flex flex-col gap-4">
            <Link
              href="/marketplace"
              className="
              flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-[#E8C07D]
              to-[#8B5CF6]
              py-5
              text-lg
              font-black
              text-black
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_0_40px_rgba(232,192,125,.4)]
              "
            >
              <ShoppingBag className="h-5 w-5 text-black" />
              Enter Marketplace
              <ArrowRight className="h-5 w-5 text-black" />
            </Link>

            <Link
              href="/leaderboard"
              className="
              flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              border
              border-white/10
              py-5
              text-lg
              font-semibold
              text-slate-300
              transition-all
              duration-300
              hover:bg-white/5
              hover:text-white
              hover:border-white/20
              "
            >
              <Trophy className="h-5 w-5 text-[#8B5CF6]" />
              View Leaderboard
            </Link>
          </div>

        </div>

      </section>

      </div>
    </main>

  );
}