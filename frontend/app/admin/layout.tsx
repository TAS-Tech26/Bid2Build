"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("adminId");

    if (!id) {
      router.replace("/admin-login");
      return;
    }

    setAdminId(id);
    setLoading(false);
  }, [router]);

  function logout() {
    localStorage.removeItem("adminId");
    router.push("/admin-login");
  }

  const navigation = [
    { title: "Dashboard", icon: "🛰", href: "/admin/dashboard" },
    { title: "Teams", icon: "👥", href: "/admin/teams" },
    { title: "Auctions", icon: "🔨", href: "/admin/auctions" },
    { title: "Disruptions", icon: "⚠️", href: "/admin/disruptions" },
    { title: "Judging", icon: "🏆", href: "/admin/judging" },
    { title: "Submissions", icon: "📁", href: "/admin/submissions" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B18] flex items-center justify-center text-white text-xl font-bold">
        Loading Mission Control...
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#070B18] text-white">

      {/* Background */}

      <div className="absolute inset-0 -z-10">

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top, rgba(239,68,68,0.15), transparent 45%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
          }}
        />

      </div>

      {/* Sidebar */}

      <aside
        className="
        w-72
        border-r
        border-white/10
        bg-black/20
        backdrop-blur-xl
        flex
        flex-col
        justify-between
        shadow-2xl
      "
      >

        <div>

          {/* Logo */}

          <div className="px-8 py-8 border-b border-white/10">

            <h1
              className="
              text-3xl
              font-black
              bg-gradient-to-r
              from-white
              via-red-400
              to-[#E8C07D]
              bg-clip-text
              text-transparent
            "
            >
              BID2BUILD
            </h1>

            <p className="text-slate-400 mt-2">
              Mission Control
            </p>

          </div>

          {/* Navigation */}

          <div className="px-4 py-6 space-y-2">

            {navigation.map((item) => (

              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  px-5
                  py-4
                  transition-all
                  duration-300
                  ${
                    pathname === item.href
                      ? "bg-red-500/20 border border-red-500/30 text-red-400 shadow-lg shadow-red-500/20"
                      : "hover:bg-white/5 text-slate-300"
                  }
                `}
              >
                <span className="text-xl">
                  {item.icon}
                </span>

                <span className="font-semibold">
                  {item.title}
                </span>

              </Link>

            ))}

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-white/10 p-6">

          <div
            className="
            rounded-xl
            border
            border-red-500/30
            bg-gradient-to-br
            from-red-500/10
            to-[#E8C07D]/10
            p-4
          "
          >

            <p className="text-xs uppercase tracking-widest text-slate-400">
              Logged in as
            </p>

            <h2 className="mt-2 text-lg font-bold text-red-400">
              {adminId}
            </h2>

          </div>

          <button
            onClick={logout}
            className="
            mt-5
            w-full
            rounded-xl
            bg-gradient-to-r
            from-red-500
            to-[#E8C07D]
            py-3
            font-bold
            text-black
            transition-all
            duration-300
            hover:scale-[1.03]
          "
          >
            Logout
          </button>

        </div>

      </aside>

      {/* Main Content */}

      <section
        className="
        flex-1
        overflow-y-auto
        p-8
      "
      >
        {children}
      </section>

    </main>
  );
}