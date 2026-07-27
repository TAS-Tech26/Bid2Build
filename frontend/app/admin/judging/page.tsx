"use client";

import { useMemo, useState } from "react";

const teams = Array.from({ length: 90 }, (_, i) => ({
  id: `TEAM${String(i + 1).padStart(3, "0")}`,
  proposal: Math.floor(Math.random() * 61),
  visualization: Math.floor(Math.random() * 31),
  innovation: Math.floor(Math.random() * 11),
}));

export default function JudgingPage() {
  const [search, setSearch] = useState("");

  const leaderboard = useMemo(() => {
    return teams
      .map((team) => ({
        ...team,
        total:
          team.proposal +
          team.visualization +
          team.innovation,
      }))
      .filter((team) =>
        team.id
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => b.total - a.total);
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
            Judging Portal
          </h1>

          <p className="text-slate-400 mt-2">
            Live scoring dashboard for all judges.
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-5">

          <p className="text-slate-400 text-sm">
            Teams Evaluated
          </p>

          <h2 className="text-4xl font-black text-[#E8C07D]">
            90
          </h2>

        </div>

      </div>

      {/* KPI */}

      <div className="grid grid-cols-4 gap-6">

        <KPICard
          title="Teams"
          value="90"
        />

        <KPICard
          title="Top Score"
          value="98"
        />

        <KPICard
          title="Average"
          value="81"
        />

        <KPICard
          title="Judges"
          value="5"
        />

      </div>

      {/* Search */}

      <input
        placeholder="Search Team..."

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

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
            {/* Leaderboard */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-white/5">

            <tr className="text-slate-400">

              <th className="text-left p-5">Rank</th>

              <th className="text-left">Team</th>

              <th className="text-center">
                Proposal
              </th>

              <th className="text-center">
                Visualization
              </th>

              <th className="text-center">
                Innovation
              </th>

              <th className="text-center">
                Total
              </th>

              <th className="text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {leaderboard.map((team, index)=>(

              <tr
                key={team.id}
                className="
                border-t
                border-white/5
                hover:bg-white/5
                transition
                "
              >

                <td className="p-5 font-bold text-[#E8C07D]">
                  #{index+1}
                </td>

                <td className="font-semibold">
                  {team.id}
                </td>

                <td className="text-center">
                  <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300">
                    {team.proposal}/60
                  </span>
                </td>

                <td className="text-center">
                  <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-300">
                    {team.visualization}/30
                  </span>
                </td>

                <td className="text-center">
                  <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300">
                    {team.innovation}/10
                  </span>
                </td>

                <td className="text-center">

                  <span
                    className="
                    text-xl
                    font-black
                    text-[#E8C07D]
                    "
                  >
                    {team.total}
                  </span>

                </td>

                <td className="text-center">

                  <button
                    className="
                    px-5
                    py-2

                    rounded-xl

                    bg-gradient-to-r
                    from-red-500
                    to-[#E8C07D]

                    text-black
                    font-bold

                    hover:scale-105

                    transition
                    "
                  >
                    Score
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>

  );

}
function KPICard({
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

      <h2
        className="
        text-4xl
        font-black
        mt-3
        text-[#E8C07D]
        "
      >
        {value}
      </h2>
    </div>
  );
}