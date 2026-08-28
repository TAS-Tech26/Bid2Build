"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export function SiteNav() {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Basic session check based on how Bid2Build handles auth
    if (localStorage.getItem("token")) {
      const storedRole = localStorage.getItem("role") || "participant";
      setRole(storedRole);
    }
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link href="/" className="font-black text-xl uppercase tracking-tighter">
            BID2BUILD
          </Link>
        </div>

        {/* Center */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/#rounds"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            The Challenge
          </Link>

          <Link
            href="/#marketplace"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Marketplace
          </Link>

          <Link
            href="/#scoring"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Scoring
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {role ? (
            <Link
              href={role === "admin" ? "/admin/dashboard" : "/stu_dashboard"}
              className="rounded-md bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
            >
              {role === "admin" ? "Admin Console" : "Participant Console"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
