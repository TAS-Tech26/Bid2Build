"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import b2bApi from '../services/api';
import { MarketplaceCard, Technology } from "@/components/bidding/MarketplaceCard";

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function MarketplacePage() {
  const router = useRouter();
  const [credits, setCredits] = useState<any>();
  const [tech, setTech] = useState<Technology[]>([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading]=useState(true);
  const [watchedAssets, setWatchedAssets] = useState<Set<number>>(new Set());

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
    const token = localStorage.getItem("token");
    const storedTeam = localStorage.getItem("team_name");
    
    // For dev testing, bypass redirect if needed
    // if (!storedTeam || !token) {
    //   router.push("/login");
    //   return;
    // }

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
      // Fallback for UI testing
      setCredits("1150");
    }
  }
  fetch_credits();
    try{
      setTeamName(storedTeam || "Your Team");
    }
    catch(error){
      console.log("Invalid team data", error);
      localStorage.removeItem("team_name");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  useEffect(()=>{
    const fetchTech=async()=>{
      try{
        const token=localStorage.getItem("token");
        const response=await b2bApi.get("/api/items/",{
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
        // Fallback for UI testing
        setTech([
          { id: 1, name: "Computer Vision", description: "Test", status: "ACTIVE", base_price: 300, current_price: 350, highest_bidder_id: 1, end: new Date(Date.now() + 60000).toISOString() },
          { id: 2, name: "Data Center", description: "Test", status: "QUEUED", base_price: 150, current_price: 150, highest_bidder_id: null, end: new Date(Date.now() + 120000).toISOString() },
        ]);
        setTimers({ 1: 60, 2: 120 });
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

  const toggleWatch = (id: number) => {
    setWatchedAssets(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const joinRoom = (asset: Technology) => {
    router.push(`/bidding/${asset.id}`);
  }

  if (loading) {
  return (
    <div className="min-h-screen bg-[#070B18] flex items-center justify-center text-white">
      Loading Technologies...
    </div>
  );
}

  return (
    <>
      <main
        style={{ minHeight: "100vh", background: "#070B18", color: "#fff" }}
      >
        <Navbar overrideCredits={credits} />

        <div style={{ padding: "40px 40px 80px", maxWidth: 1400, margin: "0 auto" }}>
          {/* ── Header ── */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-white m-0">Live Marketplace</h1>
                
                {liveCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                    <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                    MARKET OPEN
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-mono font-bold text-red-400">
                    MARKETPLACE CLOSED
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Join dedicated auction rooms and compete for strategic B2B startup assets.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                  Available Credits
                </div>
                <div className="mt-0.5 text-2xl font-black text-[#E8C07D] font-mono-tabular">
                  {Number(credits).toLocaleString()} CR
                </div>
              </div>
            </div>
          </div>

          {/* ── Categories Tabs (UI Only) ── */}
          <div className="flex flex-wrap gap-3 mb-8">
            {["Core Technologies", "Business Resources", "Premium Assets"].map((item, i) => (
              <button
                key={item}
                className={`rounded-xl border px-5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                  i === 0
                    ? "border-[#E8C07D] bg-[#E8C07D] text-black shadow-[0_0_15px_rgba(232,192,125,0.3)]"
                    : "border-white/10 hover:border-[#E8C07D]/50 bg-white/[0.02] text-slate-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* ── Auction Grid ── */}
          <section
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {tech.map((technology) => (
              <MarketplaceCard
                key={technology.id}
                asset={technology}
                timeLeft={timers[technology.id] ?? 0}
                onJoinRoom={joinRoom}
                isWatched={watchedAssets.has(technology.id)}
                onToggleWatch={toggleWatch}
              />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}