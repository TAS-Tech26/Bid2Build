"use client";

import { useMemo, useState } from "react";

const teams = Array.from({ length: 90 }, (_, i) => ({

  id: `TEAM${String(i + 1).padStart(3, "0")}`,

  ppt: Math.random() > 0.2,

  prototype: Math.random() > 0.35,

  website: Math.random() > 0.55,

  submitted: Math.random() > 0.25,

  time: `${10 + Math.floor(Math.random() * 4)}:${String(
    Math.floor(Math.random() * 60)
  ).padStart(2, "0")}`,

}));

export default function SubmissionsPage() {

  const [search, setSearch] = useState("");

  const filteredTeams = useMemo(() => {

    return teams.filter(team =>

      team.id.toLowerCase().includes(search.toLowerCase())

    );

  }, [search]);

  return (

    <main className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-black bg-gradient-to-r from-white via-red-400 to-[#E8C07D] bg-clip-text text-transparent">

            Team Submissions

          </h1>

          <p className="text-slate-400 mt-2">

            Monitor all final Round 2 submissions.

          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-5">

          <p className="text-slate-400 text-sm">

            Submitted

          </p>

          <h2 className="text-4xl font-black text-[#E8C07D]">

            72

          </h2>

        </div>

      </div>

      {/* KPI */}

      <div className="grid grid-cols-4 gap-6">

        <KPICard title="PowerPoints" value="74" />

        <KPICard title="Prototypes" value="66" />

        <KPICard title="Websites" value="39" />

        <KPICard title="Pending" value="18" />

      </div>

      <input

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

        placeholder="Search Team..."

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
            {/* Submission Table */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-white/5">

            <tr className="text-slate-400">

              <th className="text-left p-5">
                Team
              </th>

              <th className="text-center">
                PPT
              </th>

              <th className="text-center">
                Prototype
              </th>

              <th className="text-center">
                Website
              </th>

              <th className="text-center">
                Submitted
              </th>

              <th className="text-center">
                Time
              </th>

              <th className="text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredTeams.map((team)=>(

              <tr
                key={team.id}
                className="
                border-t
                border-white/5
                hover:bg-white/5
                transition
                "
              >

                <td className="p-5 font-bold">
                  {team.id}
                </td>

                <td className="text-center">

                  <StatusBadge
                    active={team.ppt}
                    label="PPT"
                  />

                </td>

                <td className="text-center">

                  <StatusBadge
                    active={team.prototype}
                    label="Prototype"
                  />

                </td>

                <td className="text-center">

                  <StatusBadge
                    active={team.website}
                    label="Website"
                  />

                </td>

                <td className="text-center">

                  {team.submitted ? (

                    <span
                      className="
                      px-4
                      py-2

                      rounded-full

                      bg-green-500/20

                      text-green-400

                      text-sm

                      font-semibold
                      "
                    >
                      Submitted
                    </span>

                  ) : (

                    <span
                      className="
                      px-4
                      py-2

                      rounded-full

                      bg-red-500/20

                      text-red-400

                      text-sm

                      font-semibold
                      "
                    >
                      Pending
                    </span>

                  )}

                </td>

                <td className="text-center font-semibold">

                  {team.time}

                </td>

                <td className="text-center">

                  <div className="flex justify-center gap-3">

                    <button
                      className="
                      px-4
                      py-2

                      rounded-xl

                      bg-blue-500

                      font-semibold

                      hover:bg-blue-600

                      transition
                      "
                    >
                      Preview
                    </button>

                    <button
                      className="
                      px-4
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
                      Download
                    </button>

                  </div>

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
      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h2
        className="
        mt-3
        text-4xl
        font-black
        text-[#E8C07D]
        "
      >
        {value}
      </h2>
    </div>
  );
}

function StatusBadge({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
  return active ? (
    <span
      className="
      inline-flex
      items-center
      justify-center

      rounded-full

      bg-green-500/20

      border
      border-green-500/30

      px-4
      py-2

      text-sm
      font-semibold
      text-green-400
      "
    >
      ✓ {label}
    </span>
  ) : (
    <span
      className="
      inline-flex
      items-center
      justify-center

      rounded-full

      bg-red-500/20

      border
      border-red-500/30

      px-4
      py-2

      text-sm
      font-semibold
      text-red-400
      "
    >
      ✕ Missing
    </span>
  );
}