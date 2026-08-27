import React from "react";
import { Coins, Trophy, Package, Gavel, ShieldAlert } from "lucide-react";

interface Props {
  asset: {
    id: number;
    name: string;
    category: string;
    price: number;
    basePrice: number;
    highestBidder: string;
    userBid: number;
    status: "live" | "won" | "lost";
  };
  bidAmount: string;
  setBidAmount: (v: string) => void;
  availableCredits: number;
  onPlaceBid: (amount: number) => void;
  isExpired: boolean;
  hasWithdrawn: boolean;
  onBackOut: () => void;
}

export default function BidPanel({
  asset,
  bidAmount,
  setBidAmount,
  availableCredits,
  onPlaceBid,
  isExpired,
  hasWithdrawn,
  onBackOut
}: Props) {
  const minIncrement = 10;
  const minimumBid = asset.price + minIncrement;
  
  const handlePlaceBid = () => {
    const amount = Number(bidAmount);
    if (isNaN(amount) || amount < minimumBid) return;
    if (asset.userBid > 0 && amount <= asset.userBid) return;
    onPlaceBid(amount);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Available Credits */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coins className="h-5 w-5 text-[#E8C07D]" />
            <span className="text-sm font-semibold">Available Credits</span>
          </div>
        </div>
        <div className="mt-4 text-5xl font-black text-[#E8C07D] font-mono-tabular">
          {availableCredits.toLocaleString()}
        </div>
      </div>

      {/* Highest Bidder & Your Current Bid */}
      <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span className="font-semibold">Current Leader</span>
        </div>
        <div className="mt-4 text-2xl font-black truncate">
          {asset.highestBidder || "No Bids Yet"}
        </div>
        <div className="mt-1 text-sm text-slate-400">
          {asset.highestBidder
            ? `Winning with ${asset.price} Credits`
            : `Base Price: ${asset.basePrice} CR`}
        </div>
        {asset.userBid > 0 && (
          <div className="mt-3 pt-3 border-t border-yellow-500/20 text-xs font-mono font-bold text-emerald-400 flex items-center justify-between">
            <span>Your Active Bid:</span>
            <span>{asset.userBid} CR</span>
          </div>
        )}
      </div>

      {/* Place Bid Section */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Gavel className="h-5 w-5 text-[#E8C07D]" />
            <span className="font-semibold">Place Custom Bid</span>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-white/10 bg-black/40 p-4">
          <div className="text-xs uppercase text-slate-400 font-mono">
            Minimum Valid Bid (Min +10 CR)
          </div>
          <div className="mt-2 text-3xl font-black text-[#E8C07D] font-mono-tabular">
            {minimumBid} CR
          </div>
        </div>

        {/* Quick Increment Buttons (+50, +100, +250) */}
        <div className="grid grid-cols-3 gap-2">
          {[50, 100, 250].map((value) => (
            <button
              key={value}
              disabled={isExpired || hasWithdrawn}
              onClick={() => {
                setBidAmount(String(asset.price + value));
                onPlaceBid(asset.price + value); // Auto place bid on quick increment
              }}
              className="rounded-xl border border-white/10 py-3 text-xs font-mono font-bold transition hover:border-[#E8C07D] hover:bg-[#E8C07D]/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              +{value}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder={`Enter bid >= ${minimumBid}`}
          disabled={isExpired || hasWithdrawn}
          className="mt-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-[#E8C07D] font-mono font-bold disabled:opacity-40"
        />

        {/* Validation Errors & Warnings */}
        {asset.userBid > 0 && Number(bidAmount) > 0 && Number(bidAmount) <= asset.userBid && (
          <div className="mt-3 text-xs text-red-400 flex items-center gap-1.5 font-mono">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            Bid must exceed your active bid of {asset.userBid} CR
          </div>
        )}

        {/* Place Bid Button */}
        <button
          onClick={handlePlaceBid}
          disabled={
            isExpired ||
            hasWithdrawn ||
            !bidAmount ||
            Number(bidAmount) < minimumBid ||
            (asset.userBid > 0 && Number(bidAmount) <= asset.userBid)
          }
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#E8C07D] to-[#8B5CF6] py-4 font-bold text-black transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-mono shadow-[0_0_20px_rgba(232,192,125,0.3)]"
        >
          {isExpired
              ? "AUCTION CLOSED"
              : hasWithdrawn
                ? "BACKED OUT"
                  : "PLACE BID"}
        </button>

        {/* Back Out Button */}
        <button
          onClick={onBackOut}
          disabled={isExpired || hasWithdrawn || asset.highestBidder === "TEAM 001"}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/50 py-3 text-red-500 transition hover:bg-red-500/10 cursor-pointer text-xs font-mono font-bold uppercase disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {hasWithdrawn ? "Backed Out" : "Back Out of Auction"}
        </button>
      </div>
    </div>
  );
}

