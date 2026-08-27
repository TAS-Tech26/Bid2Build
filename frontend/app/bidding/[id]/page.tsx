"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import NotificationStack from "@/components/NotificationToast";
import { Notifications, useNotifications } from "@/components/useNotifications";
import AuctionHeader from "@/components/bidding/AuctionHeader";
import AuctionStats from "@/components/bidding/AuctionStats";
import LiveActivity, { HistoryEntry } from "@/components/bidding/LiveActivity";
import AssetDetails from "@/components/bidding/AssetDetails";
import BidPanel from "@/components/bidding/BidPanel";

/* ─────────────────────────────────────────────
   Asset catalogue  (unchanged)
───────────────────────────────────────────── */
const assets: any = {
  "1": { name: "Computer Vision", category: "Core Tech", startingBid: 300, description: "Advanced computer vision system capable of detecting, classifying, and interpreting images in real time.", purpose: "Enable image recognition, object detection, smart surveillance, and visual analytics." },
  "2": { name: "Automation Technology", category: "Core Tech", startingBid: 300, description: "Streamline workflows with smart automation.", purpose: "Reduce manual effort and increase productivity." },
  "3": { name: "AI Systems", category: "Core Tech", startingBid: 350, description: "Powerful AI systems to boost operations.", purpose: "Data analytics, conversational AI, and predictions." },
  "4": { name: "Data Centers", category: "Business Resource", startingBid: 150, description: "Scalable cloud infrastructure.", purpose: "Deploy websites, store data, and run online services." },
};

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type TeamStatus = "ACTIVE" | "HIGHEST BIDDER" | "BACKED OUT";

interface Team {
  name: string;
  status: TeamStatus;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
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
    if (!localStorage.getItem("team_name")) {
      // Allow for dev testing if empty, normally would route to login
    }
    const s = localStorage.getItem("credits");
    if (s) { setCredits(s); }
    else   { localStorage.setItem("credits", "1150"); setCredits("1150"); }
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
  const [bidFeed, setBidFeed] = useState<HistoryEntry[]>([
    { id: 1, team: "TEAM 023", bid: asset.startingBid, time: nowTime(), isYou: false },
  ]);
  const bidIdRef   = useRef(2);
  const [bidAmount, setBidAmount] = useState("");

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
  const isExpired  = timer <= 0;

  /* ── placeBid (unchanged logic + feed entry) ── */
  function placeBid(amount: number) {
    if (hasWithdrawn) return;
    const cur = Number(credits);
    if (cur < amount) { alert("Insufficient credits to place this increment!"); return; }

    const newCredits = cur - amount;
    setCredits(String(newCredits));
    localStorage.setItem("credits", String(newCredits));

    const newBid = amount; // It's an absolute amount from the panel
    setHighestBid(newBid);
    setLeader("TEAM 001");
    setTimer(15);
    setBidAmount("");

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
      { id: bidIdRef.current++, team: "Your Team", bid: newBid, time: nowTime(), isYou: true },
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

  const userBid = leader === "TEAM 001" ? highestBid : 0;
  
  return (
    <>
      {/* ── Notification portal ── */}
      <NotificationStack notifications={notifications} onDismiss={dismiss} />

      <main className="min-h-screen bg-[#070B18] text-white">
        <Navbar overrideCredits={credits} />

        <div className="mx-auto max-w-7xl p-6 sm:p-8 pb-20">
          
          <AuctionHeader 
            assetName={asset.name}
            category={asset.category}
            onClose={() => router.push("/marketplace")}
          />

          <AuctionStats 
            price={highestBid}
            basePrice={asset.startingBid}
            stock={1}
            maxStock={1}
            highestBidder={leader}
            teamsBidding={remaining}
            timeLeft={timer}
          />

          <div className="grid gap-8 lg:grid-cols-[1.4fr_380px]">
            <div className="space-y-8">
              <LiveActivity 
                history={bidFeed} 
                status={isExpired ? (leader === "TEAM 001" ? "won" : "lost") : "live"}
              />
              
              <AssetDetails 
                asset={{
                  name: asset.name,
                  description: asset.description,
                  purpose: asset.purpose,
                  price: asset.startingBid,
                  teams: remaining,
                  time: timer
                }} 
              />
            </div>

            <div>
              <BidPanel 
                asset={{
                  id: Number(id),
                  name: asset.name,
                  category: asset.category,
                  price: highestBid,
                  basePrice: asset.startingBid,
                  highestBidder: leader,
                  userBid: userBid,
                  status: isExpired ? (leader === "TEAM 001" ? "won" : "lost") : "live"
                }}
                bidAmount={bidAmount}
                setBidAmount={setBidAmount}
                availableCredits={Number(credits)}
                onPlaceBid={placeBid}
                isExpired={isExpired}
                hasWithdrawn={hasWithdrawn}
                onBackOut={backOut}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}