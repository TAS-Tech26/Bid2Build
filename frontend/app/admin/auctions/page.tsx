"use client";

import { useMemo, useState } from "react";

const auctionRooms = [
  {
    id: 1,
    asset: "Artificial Intelligence",
    category: "Core Tech",
    highestBid: 420,
    leader: "TEAM007",
    participants: 8,
    backedOut: 2,
    timer: 11,
    status: "LIVE",
  },
  {
    id: 2,
    asset: "Computer Vision",
    category: "Core Tech",
    highestBid: 310,
    leader: "TEAM014",
    participants: 6,
    backedOut: 1,
    timer: 8,
    status: "LIVE",
  },
  {
    id: 3,
    asset: "Blockchain",
    category: "Core Tech",
    highestBid: 390,
    leader: "TEAM051",
    participants: 9,
    backedOut: 3,
    timer: 14,
    status: "LIVE",
  },
  {
    id: 4,
    asset: "Cloud Infrastructure",
    category: "Business",
    highestBid: 170,
    leader: "TEAM029",
    participants: 5,
    backedOut: 0,
    timer: 4,
    status: "LIVE",
  },
  {
    id: 5,
    asset: "Investor Network",
    category: "Special",
    highestBid: 260,
    leader: "TEAM041",
    participants: 7,
    backedOut: 2,
    timer: 10,
    status: "LIVE",
  },
  {
    id: 6,
    asset: "Cybersecurity",
    category: "Core Tech",
    highestBid: 280,
    leader: "TEAM066",
    participants: 8,
    backedOut: 5,
    timer: 2,
    status: "LIVE",
  },
];

export default function AuctionsPage() {

  const [search, setSearch] = useState("");

  const rooms = useMemo(() => {

    return auctionRooms.filter(room =>
      room.asset.toLowerCase().includes(search.toLowerCase())
    );

  }, [search]);

  return (

    <main className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-black bg-gradient-to-r from-white via-red-400 to-[#E8C07D] bg-clip-text text-transparent">
            Live Auctions
          </h1>

          <p className="text-slate-400 mt-2">
            Monitor every auction room in real time.
          </p>

        </div>

        <button
          className="
          rounded-2xl
          bg-gradient-to-r
          from-red-500
          to-[#E8C07D]
          px-8
          py-4
          font-bold
          text-black
          "
        >
          Open Marketplace
        </button>

      </div>

      {/* KPIs */}

      <div className="grid grid-cols-5 gap-6">

        <KPICard title="Live Rooms" value="15" />

        <KPICard title="Assets Sold" value="42" />

        <KPICard title="Teams Bidding" value="54" />

        <KPICard title="Average Bid" value="318" />

        <KPICard title="Marketplace" value="OPEN" />

      </div>

      {/* Search */}

      <input

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

        placeholder="Search auction room..."

        className="
        w-full
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
        outline-none
        focus:border-red-400
        "

      />

      {/* Auction Grid */}

      <div className="grid lg:grid-cols-2 gap-7">

        {rooms.map(room=>(

          <AuctionCard

            key={room.id}

            room={room}

          />

        ))}

      </div>

    </main>

  );

}
function AuctionCard({
  room,
}: {
  room: {
    id: number;
    asset: string;
    category: string;
    highestBid: number;
    leader: string;
    participants: number;
    backedOut: number;
    timer: number;
    status: string;
  };
}) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-xl
      p-7
      hover:border-red-500/30
      transition
      "
    >
      {/* Top */}

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-black">
            {room.asset}
          </h2>

          <p className="text-slate-400 mt-1">
            {room.category}
          </p>

        </div>

        <span
          className="
          px-4
          py-2
          rounded-full
          bg-red-500/20
          text-red-400
          font-bold
          text-sm
          animate-pulse
          "
        >
          ● LIVE
        </span>

      </div>

      {/* Divider */}

      <div className="border-t border-white/10 my-6"></div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-5">

        <Stat
          title="Highest Bid"
          value={`${room.highestBid} Credits`}
        />

        <Stat
          title="Leading Team"
          value={room.leader}
        />

        <Stat
          title="Participants"
          value={`${room.participants}`}
        />

        <Stat
          title="Backed Out"
          value={`${room.backedOut}`}
        />

      </div>

      {/* Timer */}

      <div className="mt-7">

        <div className="flex justify-between mb-2">

          <span className="text-slate-400">
            Bid Timer
          </span>

          <span className="font-bold text-[#E8C07D]">
            {room.timer}s
          </span>

        </div>

        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-red-500 to-[#E8C07D]"
            style={{
              width: `${(room.timer / 15) * 100}%`,
            }}
          />

        </div>

      </div>

      {/* Buttons */}

      <div className="grid grid-cols-3 gap-4 mt-8">

        <button
          className="
          rounded-xl
          bg-red-500
          py-3
          font-bold
          hover:bg-red-600
          transition
          "
        >
          Force End
        </button>

        <button
          className="
          rounded-xl
          bg-[#E8C07D]
          text-black
          py-3
          font-bold
          hover:opacity-90
          transition
          "
        >
          Award Asset
        </button>

        <button
          className="
          rounded-xl
          border
          border-white/10
          py-3
          font-bold
          hover:bg-white/5
          transition
          "
        >
          Enter Room
        </button>

      </div>

    </div>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="
      rounded-2xl
      bg-black/20
      border
      border-white/5
      p-4
      "
    >
      <p className="text-xs text-slate-500">
        {title}
      </p>

      <h3 className="text-lg font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}
function KPICard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  const isMarketplace = title === "Marketplace";

  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-xl
      p-6
      "
    >
      <p className="text-slate-400 text-sm">
        {title}
      </p>

      {isMarketplace ? (
        <div className="flex items-center gap-3 mt-4">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <h2 className="text-3xl font-black text-green-400">
            {value}
          </h2>
        </div>
      ) : (
        <h2 className="text-4xl font-black text-[#E8C07D] mt-4">
          {value}
        </h2>
      )}
    </div>
  );
}