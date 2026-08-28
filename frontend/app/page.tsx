"use client"

import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { Ticker } from "@/components/site/Ticker";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useEffect, useState } from "react";

const ROUNDS = [
  {
    n: "01",
    title: "Market Intelligence",
    body: "Every participant takes an individual, timed quiz on their own device. Team scores aggregate automatically. The top 60% qualify with a base of 1,000 credits plus ranking bonuses up to 200 credits.",
  },
  {
    n: "02",
    title: "The Architect Phase",
    body: "Qualified teams enter a live marketplace to acquire Core Technologies, Business Resources, and Special Assets. Live disruption events force teams to adapt before final submission.",
  },
  {
    n: "03",
    title: "Shark Tank Pitch",
    body: "The competition concludes with the Shark Tank Pitch, where the top five teams present their startups in a five-minute live pitch before an expert judging panel.",
  },
];

const MARKETPLACE = [
  {
    category: "Core Technology",
    name: "AI Assistant",
    price: "250",
    body: "Enable intelligent features such as chatbots, smart assistants, automation, and content generation.",
    tag: "Starting Bid",
  },
  {
    category: "Business Resource",
    name: "Customer Data",
    price: "150",
    body: "Access anonymized customer insights and data to improve analytics, personalization, and AI-driven solutions.",
    tag: "Starting Bid",
  },
  {
    category: "Premium Asset",
    name: "Global Expansion",
    price: "400",
    body: "Unlock international market opportunities and scale your startup beyond the domestic market.",
    tag: "Premium · Limited",
  },
];

const CREDIT_TIERS = [
  { rank: "1", bonus: "+400" },
  { rank: "2 – 3", bonus: "+350" },
  { rank: "4 – 5", bonus: "+300" },
  { rank: "6 – 8", bonus: "+250" },
  { rank: "9 – 12", bonus: "+200" },
  { rank: "13 – 16", bonus: "+150" },
  { rank: "17 – 20", bonus: "+100" },
  { rank: "21 – 25", bonus: "+50" },
  { rank: "26 – 30", bonus: "BASE" },
];

export default function LandingPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setRole(localStorage.getItem("role") || "participant");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteNav />
      <Ticker />
      {/* Hero */}
      <header className="relative overflow-hidden px-6 pb-32 pt-24">
        {/* Dual Cyberpunk Orbs */}
        <div className="pointer-events-none absolute left-[35%] top-1/2 -z-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute left-[65%] top-1/2 -z-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center animate-fade-up">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-accent">●</span> BID2BUILD A 2026
          </div>
          <h1 className="mb-8 text-balance text-6xl font-black leading-[0.9] tracking-tighter md:text-8xl">
            BUILD THE FUTURE.
            <br />
            <span className="bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">
              OWN THE MARKET.
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg font-medium text-muted-foreground">
            A high-stakes startup simulation. Three rounds. One marketplace. One live pitch. Every
            decision shapes the future of your startup.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={
                role
                  ? role === "admin"
                    ? "/admin/dashboard"
                    : "/stu_dashboard"
                  : "/login"
              }
              className="w-full rounded-sm bg-gradient-to-r from-primary to-accent px-8 py-4 font-bold uppercase tracking-widest text-white shadow-glow hover:scale-105 transition-all sm:w-auto"
            >
              {role ? "Continue to Console" : "Enter the Arena"}
            </Link>
            <a
              href="#rounds"
              className="w-full rounded-sm border border-border px-8 py-4 font-bold uppercase tracking-widest transition-all hover:bg-white/5 sm:w-auto"
            >
              Explore the Competition
            </a>
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <section className="mx-auto max-w-7xl border-t border-border px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
          {[
            { k: "Teams", v: "30", note: "maximum teams" },
            { k: "Participants", v: "X", note: "teams of four" },
            { k: "Qualified", v: "ALL", note: "advance to Round 2" },
            { k: "Prize Pool", v: "₹15K", note: "cash + prizes" },
          ].map((s) => (
            <div key={s.k} className="bg-background p-8">
              <div className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {s.k}
              </div>
              <div className="mt-2 font-black text-4xl tracking-tighter font-sans">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Rounds */}
      <section id="rounds" className="mx-auto max-w-7xl border-t border-border px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">The Challenge</h2>
            <p className="text-sm text-muted-foreground">
              Three rounds. Three unique challenges. One ultimate winner.
            </p>
          </div>
          <span className="hidden font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:inline">
            R1 → R2 → R3
          </span>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border shadow-2xl lg:grid-cols-3">
          {ROUNDS.map((r) => (
            <div
              key={r.n}
              className="group bg-background p-10 transition-colors hover:bg-white/[0.02]"
            >
              <div className="mb-6 font-mono-tabular text-sm text-primary">PHASE {r.n}</div>
              <h3 className="mb-4 text-2xl font-black tracking-tight transition-colors group-hover:text-primary">
                {r.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Credits & qualification */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl border border-border bg-white/[0.02] p-10">
            <div className="mb-6 font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-primary">
              Round 1 → Round 2 · Credit Allocation
            </div>
            <h3 className="mb-4 text-3xl font-black tracking-tighter">
              Every qualified team gets <span className="text-primary">1,000 credits</span> base.
            </h3>
            <p className="mb-8 max-w-lg text-sm text-muted-foreground">
              Ranking bonuses reward top performers on the Market Intelligence quiz.
            </p>
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {CREDIT_TIERS.map((t) => (
                <div key={t.rank} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium">{t.rank}</span>
                  <span className="font-mono-tabular text-sm text-primary">{t.bonus} credits</span>
                </div>
              ))}
            </div>
          </div>

          <div
            id="scoring"
            className="rounded-xl border border-border bg-gradient-to-br from-background to-primary/5 p-10"
          >
            <div className="mb-6 font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-primary">
              Round 2 · Judging Rubric
            </div>
            <h3 className="mb-8 text-3xl font-black tracking-tighter">What Judges Look For</h3>
            <div className="space-y-4">
              {[
                { label: "Startup Proposal", pts: 50 },
                { label: "Product Visualization", pts: 20 },
                { label: "Innovation & Creativity", pts: 30 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{s.label}</span>
                    <span className="font-mono-tabular text-muted-foreground">{s.pts} pts</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${s.pts}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs text-muted-foreground">
              Tie-break: highest Innovation score, then Product Visualization.
            </p>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Live Marketplace</h2>
            <p className="text-sm text-muted-foreground">
              Three categories. Real-time inventory during The Architect Phase.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {MARKETPLACE.map((m) => (
            <div
              key={m.name}
              className="rounded-lg border border-border bg-white/[0.02] p-6 transition-all hover:border-primary/50"
            >
              <div className="mb-6 grid aspect-video w-full place-items-center rounded-md border border-border bg-gradient-to-br from-white/[0.03] to-primary/5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {m.category}
                </span>
              </div>
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-bold">{m.name}</h4>
                <span className="font-mono-tabular text-xs text-primary">{m.price} CR</span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">{m.body}</p>
              <span className="inline-block border border-border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                {m.tag}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { k: "Core Technologies", v: "AI · Blockchain · IoT · Cybersecurity · AR/VR · more" },
            { k: "Business Resources", v: "Cloud · Talent · Legal · Mentors · Partnerships" },
            {
              k: "Special Assets",
              v: "Government Funding · Investor Networks · Enterprise Contracts",
            },
          ].map((c) => (
            <div key={c.k} className="rounded-lg border border-border p-4">
              <div className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-primary">
                {c.k}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{c.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Role CTA */}
      <section className="border-t border-border bg-gradient-to-b from-background to-primary/5 py-24">
        <div className="grid gap-4 sm:grid-cols-2 mx-auto max-w-7xl px-6">
          {[
            {
              role: "participant" as const,
              tone: "text-primary",
              title: "Participant",
              body: "Login with your team credentials and compete in BID2BUILD.",
              link: "/login"
            },
            {
              role: "admin" as const,
              tone: "text-accent",
              title: "Admin",
              body: "Manage rounds, teams, marketplace, and the event.",
              link: "/admin-login"
            },
          ].map((c) => (
            <Link
              key={c.role}
              href={c.link}
              className="rounded-xl border border-border bg-background p-6 text-left transition-all hover:border-primary/50 hover:bg-white/5"
            >
              <p className={`mb-1 text-[10px] font-bold uppercase ${c.tone}`}>{c.title}</p>

              <p className="mb-4 text-xs text-muted-foreground">{c.body}</p>

              <span className="border-b border-foreground text-xs font-bold uppercase">
                Login →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}