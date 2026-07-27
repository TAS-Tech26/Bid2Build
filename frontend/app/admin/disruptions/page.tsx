"use client";

import { useMemo, useState } from "react";

const disruptions = [
  {
    id: 1,
    title: "CEO Swap",
    type: "Team",
    description:
      "Presenter must swap roles with the quietest teammate.",
    status: "READY",
    responded: 52,
  },
  {
    id: 2,
    title: "Cloud Outage",
    type: "Infrastructure",
    description:
      "Teams without Cloud Infrastructure must design an offline mode.",
    status: "READY",
    responded: 47,
  },
  {
    id: 3,
    title: "Deepfake Panic",
    type: "Security",
    description:
      "Teams must adapt their startup to restore user trust.",
    status: "READY",
    responded: 41,
  },
];

export default function DisruptionsPage() {

  const [search, setSearch] = useState("");

  const cards = useMemo(() => {

    return disruptions.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

  }, [search]);

  return (

    <main className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1
            className="
            text-5xl
            font-black
            bg-gradient-to-r
            from-white
            via-red-400
            to-[#E8C07D]
            bg-clip-text
            text-transparent
            "
          >
            Market Disruptions
          </h1>

          <p className="text-slate-400 mt-2">
            Control every live disruption from one place.
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
          Broadcast Announcement
        </button>

      </div>

      {/* KPIs */}

      <div className="grid grid-cols-4 gap-6">

        <KPICard
          title="Disruptions"
          value="3"
        />

        <KPICard
          title="Teams Responded"
          value="52"
        />

        <KPICard
          title="Time Left"
          value="15:00"
        />

        <KPICard
          title="Status"
          value="READY"
        />

      </div>

      {/* Search */}

      <input

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

        placeholder="Search disruption..."

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

      {/* Cards */}

      <div className="grid lg:grid-cols-3 gap-7">

        {cards.map((item)=>(

          <DisruptionCard

            key={item.id}

            disruption={item}

          />

        ))}

      </div>

    </main>

  );

}
function DisruptionCard({
  disruption,
}: {
  disruption: {
    id: number;
    title: string;
    type: string;
    description: string;
    status: string;
    responded: number;
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
            {disruption.title}
          </h2>

          <p className="text-slate-400 mt-1">
            {disruption.type}
          </p>

        </div>

        <span
          className="
          px-4
          py-2
          rounded-full
          bg-yellow-500/20
          text-yellow-300
          font-bold
          text-sm
          "
        >
          {disruption.status}
        </span>

      </div>

      {/* Description */}

      <div className="mt-6 rounded-2xl bg-black/20 border border-white/5 p-5">

        <p className="text-slate-300 leading-7">
          {disruption.description}
        </p>

      </div>

      {/* Response Counter */}

      <div className="grid grid-cols-2 gap-4 mt-6">

        <Stat
          title="Responses"
          value={`${disruption.responded}/90`}
        />

        <Stat
          title="Completion"
          value={`${Math.round(
            (disruption.responded / 90) * 100
          )}%`}
        />

      </div>

      {/* Progress */}

      <div className="mt-6">

        <div className="flex justify-between mb-2">

          <span className="text-slate-400">
            Team Progress
          </span>

          <span className="font-bold text-[#E8C07D]">
            {disruption.responded}/90
          </span>

        </div>

        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-red-500 to-[#E8C07D]"
            style={{
              width: `${(disruption.responded / 90) * 100}%`,
            }}
          />

        </div>

      </div>

      {/* Controls */}

      <div className="grid grid-cols-3 gap-4 mt-8">

        <button
          className="
          rounded-xl
          bg-gradient-to-r
          from-red-500
          to-red-600
          py-3
          font-bold
          hover:opacity-90
          transition
          "
        >
          Launch
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
          Preview
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
          End
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
  const isStatus = title === "Status";

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

      {isStatus ? (
        <div className="flex items-center gap-3 mt-4">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <h2 className="text-3xl font-black text-green-400">
            {value}
          </h2>
        </div>
      ) : (
        <h2 className="text-4xl font-black text-[#E8C07D] mt-3">
          {value}
        </h2>
      )}
    </div>
  );
}