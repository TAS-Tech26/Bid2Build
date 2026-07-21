"use client";

import { useMemo, useState } from "react";

const statuses = [
  "Online",
  "Auction",
  "Building",
  "Offline",
] as const;

const rooms = [
  "Computer Vision",
  "Artificial Intelligence",
  "Blockchain",
  "Cloud Infrastructure",
  "Investor Network",
  "Cybersecurity",
  "AR/VR",
  "IoT Systems",
  "Predictive Analytics",
  "None",
];

const assetPool = [
  "AI",
  "Cloud",
  "Investor",
  "CV",
  "IoT",
  "Cyber",
  "AR",
  "Data",
  "Market",
  "Legal",
];

const teams = Array.from({ length: 90 }, (_, i) => {

  const rank = i + 1;

  let credits = 1000;

  if (rank <= 10) credits += 200;
  else if (rank <= 25) credits += 150;
  else if (rank <= 45) credits += 100;
  else if (rank <= 65) credits += 50;

  const assetCount = Math.floor(Math.random() * 5);

  return {
    id: `TEAM${String(rank).padStart(3, "0")}`,
    rank,
    credits,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    room: rooms[Math.floor(Math.random() * rooms.length)],
    assets: assetPool.slice(0, assetCount),
  };

});

export default function TeamsPage() {

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const filteredTeams = useMemo(() => {

    return teams.filter((team) => {

      const matchesSearch = team.id
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All"
          ? true
          : team.status === filter;

      return matchesSearch && matchesFilter;

    });

  }, [search, filter]);

  return (

    <main className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-black bg-gradient-to-r from-white via-red-400 to-[#E8C07D] bg-clip-text text-transparent">
            Teams
          </h1>

          <p className="text-slate-400 mt-2">
            Manage all participating teams
          </p>

        </div>

        <div className="text-right">

          <p className="text-slate-400">
            Registered
          </p>

          <h2 className="text-4xl font-black text-[#E8C07D]">
            90
          </h2>

        </div>

      </div>

      {/* KPI */}

      <div className="grid grid-cols-4 gap-6">

        <KPICard
          title="Qualified"
          value="90"
        />

        <KPICard
          title="Disqualified"
          value="0"
        />

        <KPICard
          title="Average Credits"
          value="1128"
        />

        <KPICard
          title="Assets Sold"
          value="61"
        />

      </div>

      {/* Search */}

      <div className="flex justify-between items-center">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Team..."
          className="
          w-96
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-5
          py-4
          outline-none
          focus:border-red-400
          "
        />

        <div className="flex gap-3">

          {[
            "All",
            "Online",
            "Auction",
            "Building",
            "Offline",
          ].map((item) => (

            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`

              px-5
              py-3
              rounded-xl
              transition

              ${
                filter === item
                  ? "bg-red-500 text-white"
                  : "bg-white/5 hover:bg-white/10"
              }

              `}
            >
              {item}
            </button>

          ))}

        </div>

      </div>
            {/* Teams */}

      <div className="space-y-4">

        {filteredTeams.map((team) => (

          <div
            key={team.id}
            className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-xl

            px-8
            py-6

            hover:border-red-500/30
            hover:bg-white/[0.06]

            transition
            "
          >

            <div className="grid grid-cols-7 gap-6 items-center">

              {/* Rank */}

              <div>

                <p className="text-slate-500 text-sm">
                  Rank
                </p>

                <h2 className="text-2xl font-black text-[#E8C07D]">
                  #{team.rank}
                </h2>

              </div>

              {/* Team */}

              <div>

                <p className="text-slate-500 text-sm">
                  Team
                </p>

                <h2 className="text-xl font-bold">
                  {team.id}
                </h2>

              </div>

              {/* Credits */}

              <div>

                <p className="text-slate-500 text-sm">
                  Credits
                </p>

                <h2 className="text-xl font-bold text-green-400">
                  {team.credits}
                </h2>

              </div>

              {/* Assets */}

              <div>

                <p className="text-slate-500 text-sm mb-2">
                  Assets
                </p>

                <div className="flex flex-wrap gap-2">

                  {team.assets.length === 0 ? (

                    <span className="text-slate-500">
                      —
                    </span>

                  ) : (

                    <>
                      {team.assets.slice(0,3).map(asset => (

                        <span
                          key={asset}
                          className="
                          px-3
                          py-1

                          rounded-full

                          bg-[#E8C07D]/15

                          text-[#E8C07D]

                          text-xs
                          "
                        >
                          {asset}
                        </span>

                      ))}

                      {team.assets.length > 3 && (

                        <span
                          className="
                          px-3
                          py-1

                          rounded-full

                          bg-white/10

                          text-xs
                          "
                        >
                          +{team.assets.length-3}
                        </span>

                      )}

                    </>

                  )}

                </div>

              </div>

              {/* Status */}

              <div>

                <p className="text-slate-500 text-sm">
                  Status
                </p>

                <StatusBadge status={team.status} />

              </div>

              {/* Room */}

              <div>

                <p className="text-slate-500 text-sm">
                  Current Room
                </p>

                <h2 className="font-semibold">
                  {team.room}
                </h2>

              </div>

              {/* Action */}

              <div className="flex justify-end">

                <button
                  className="
                  rounded-xl

                  bg-gradient-to-r
                  from-red-500
                  to-[#E8C07D]

                  px-6
                  py-3

                  font-bold

                  text-black

                  hover:scale-105

                  transition
                  "
                >
                  ▶ Manage
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Pagination */}

      <div className="flex justify-center gap-3 pt-6">

        <button className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10">
          ← Previous
        </button>

        <button className="px-5 py-3 rounded-xl bg-red-500">
          1
        </button>

        <button className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10">
          Next →
        </button>

      </div>

    </main>

  );

}function KPICard({
  title,
  value,
}: {
  title: string;
  value: string;
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
      "
    >
      <p className="text-slate-400">
        {title}
      </p>

      <h2 className="text-4xl font-black text-[#E8C07D] mt-3">
        {value}
      </h2>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const colors: Record<string, string> = {
    Online: "bg-green-500/20 text-green-400 border-green-500/30",
    Auction: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Building: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Offline: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  return (
    <span
      className={`
      inline-flex
      items-center
      gap-2

      rounded-full

      border

      px-4
      py-2

      text-sm
      font-semibold

      ${colors[status] || "bg-white/10 text-white border-white/10"}
      `}
    >
      <span
        className={`
        w-2.5
        h-2.5
        rounded-full

        ${
          status === "Online"
            ? "bg-green-400"
            : status === "Auction"
            ? "bg-blue-400"
            : status === "Building"
            ? "bg-yellow-400"
            : "bg-slate-400"
        }
        `}
      />

      {status}
    </span>
  );
}