import React from "react";
import { Eye, ArrowUpRight, Cpu } from "lucide-react";

export type Status = 'ACTIVE' | 'QUEUED' | 'INACTIVE';

export interface Technology {
  id: number;
  name: string;
  description: string;
  status: Status;
  base_price: number;
  current_price: number;
  highest_bidder_id: number | null;
  end: string;
}

interface MarketplaceCardProps {
  asset: Technology;
  timeLeft: number; // in seconds
  onJoinRoom: (asset: Technology) => void;
  isWatched: boolean;
  onToggleWatch: (assetId: number) => void;
}

export function MarketplaceCard({ asset, timeLeft, onJoinRoom, isWatched, onToggleWatch }: MarketplaceCardProps) {
  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    if (secs <= 0) return "CLOSED";
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Determine color for countdown timer
  const getTimerColor = (secs: number) => {
    if (secs <= 0) return "text-slate-500";
    if (secs < 60) return "text-red-500 animate-pulse";
    if (secs < 120) return "text-amber-500";
    return "text-emerald-400";
  };

  return (
    <div
      className={`relative group rounded-none border transition-all duration-300 bg-black/60 flex flex-col justify-between text-white ${
        isWatched
          ? "border-[#E8C07D]/50 shadow-[0_0_15px_rgba(232,192,125,0.1)]"
          : "border-white/10 hover:border-[#E8C07D]/30"
      }`}
    >
      {/* Top Bar with Live Indicator & Watch Badge */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.01] px-4 py-2 text-[10px] font-mono tracking-wider">
        <div className="flex items-center gap-2">
          {asset.status === 'ACTIVE' && timeLeft > 0 ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-emerald-400 font-bold">LIVE AUCTION</span>
            </>
          ) : asset.status === 'QUEUED' ? (
             <span className="text-amber-500 font-bold">QUEUED</span>
          ) : (
            <span className="text-slate-500 font-bold">AUCTION CLOSED</span>
          )}
        </div>
        {isWatched && (
          <span className="flex items-center gap-1 text-[#E8C07D] font-bold">
            <Eye className="h-3 w-3" /> WATCHING
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="p-5 flex-grow">
        <div className="flex items-start gap-4">
          <div className="rounded-none border border-[#E8C07D]/20 bg-[#E8C07D]/5 p-3 shrink-0 text-[#E8C07D]">
            <Cpu className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-white truncate group-hover:text-[#E8C07D] transition-colors">
              {asset.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mt-0.5">
              Ref: B2B-{asset.id.toString().padStart(3, "0")}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-dashed border-white/10">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              Highest Bid
            </div>
            <div className="mt-1 font-mono-tabular text-lg font-black text-[#E8C07D]">
              {asset.current_price.toLocaleString()} <span className="text-[10px] font-bold">CR</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              Starting Bid
            </div>
            <div className="mt-1 font-mono-tabular text-lg font-black text-white">
              {asset.base_price.toLocaleString()} <span className="text-[10px] font-bold">CR</span>
            </div>
          </div>
        </div>

        {/* Time Remaining Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Time Remaining
          </span>
          <span className={`font-mono-tabular text-sm font-black ${getTimerColor(timeLeft)}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 border-t border-white/10 bg-white/[0.01]">
        <button
          onClick={() => onToggleWatch(asset.id)}
          className={`flex items-center justify-center gap-1.5 py-3 text-xs font-mono font-bold uppercase border-r border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${
            isWatched ? "text-[#E8C07D]" : "text-slate-400 hover:text-white"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          {isWatched ? "Unwatch" : "Watch"}
        </button>
        
        {asset.status === 'ACTIVE' && timeLeft > 0 ? (
          <button
            onClick={() => onJoinRoom(asset)}
            className="flex items-center justify-center gap-1.5 py-3 text-xs font-mono font-bold uppercase bg-gradient-to-r from-[#E8C07D] to-[#8B5CF6] text-black hover:opacity-90 active:opacity-100 transition-colors cursor-pointer"
          >
            Join Room <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        ) : (
           <button
            disabled
            className="flex items-center justify-center gap-1.5 py-3 text-xs font-mono font-bold uppercase bg-white/5 text-slate-500 cursor-not-allowed"
          >
            {asset.status === 'QUEUED' ? "WAITING" : "CLOSED"}
          </button>
        )}
      </div>
    </div>
  );
}

