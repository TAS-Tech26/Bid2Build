"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-mono font-bold uppercase tracking-widest text-xs">
        Loading Mission Control...
      </div>
    );
  }

  // extract the active page from pathname (e.g. /admin/dashboard -> admin-dashboard)
  const activePage = pathname.split("/").filter(Boolean).join("-");

  return (
    <AppShell role="admin" active={activePage}>
      {children}
    </AppShell>
  );
}