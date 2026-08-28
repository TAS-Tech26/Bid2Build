"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import NotificationStack from "@/components/NotificationToast";
import { Notifications, useNotifications } from "@/hooks/useNotifications";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEMO_TRIGGERS = [
  {
    key: "auction_won",
    label: "Auction Won",
    icon: "🏆",
    description: "Fires when your team holds the highest bid when the round closes.",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    fire: () => Notifications.auctionWon("Computer Vision", 620),
  },
  {
    key: "outbid",
    label: "Outbid",
    icon: "⚡",
    description: "Fires the instant another team places a higher bid than yours.",
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    borderClass: "border-destructive/30",
    fire: () => Notifications.outbid("Investor Network", 475),
  },
  {
    key: "market_event",
    label: "Market Event",
    icon: "📣",
    description: "Broadcast for game-wide events announced by the facilitator.",
    colorClass: "text-accent",
    bgClass: "bg-accent/10",
    borderClass: "border-accent/30",
    fire: () => Notifications.marketEvent("Volatility Spike", "All tech prices dropped 15%"),
  },
  {
    key: "marketplace_closing",
    label: "Marketplace Closing",
    icon: "🔒",
    description: "Warning dispatched when the market is about to shut down.",
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    fire: () => Notifications.marketplaceClosing(5),
  },
  {
    key: "submission_reminder",
    label: "Submission Reminder",
    icon: "📋",
    description: "Nudges teams to upload their business plan before the deadline.",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    fire: () => Notifications.submissionReminder("3:30 PM today"),
  },
];

export default function NotificationsDemo() {
  const router = useRouter();
  const [credits, setCredits] = useState("1150");
  const { notifications, push, dismiss } = useNotifications();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setCredits(localStorage.getItem("credits") || "1150");
  }, [router]);

  function fireAll() {
    DEMO_TRIGGERS.forEach((t, i) => {
      setTimeout(() => push(t.fire()), i * 350);
    });
  }

  return (
    <>
      <NotificationStack notifications={notifications} onDismiss={dismiss} />

      <AppShell role="participant" active="notifications" overrideCredits={credits}>
        <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-10">
          
          <div className="flex flex-col gap-4 text-center md:text-left animate-fade-up">
            <h1 className="text-4xl font-black tracking-tight text-foreground m-0">
              Notification System
            </h1>
            <p className="text-muted-foreground text-sm">
              Standardized Toast component with 5 preset notification types, fully integrated with the Build-Scale design system.
            </p>
          </div>

          <div className="flex justify-center md:justify-start">
            <Button 
              onClick={fireAll} 
              className="px-8 h-12 text-sm font-bold tracking-widest uppercase shadow-glow hover:-translate-y-0.5 transition-transform"
            >
              dYs? Fire All Notifications
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_TRIGGERS.map((t) => (
              <Card key={t.key} className="flex flex-col bg-card/60 backdrop-blur-xl border-border hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-start gap-4 pb-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${t.bgClass} ${t.borderClass} ${t.colorClass} text-2xl`}>
                    {t.icon}
                  </div>
                  <div>
                    <CardDescription className={`text-[10px] font-bold tracking-widest uppercase ${t.colorClass}`}>
                      Notification Type
                    </CardDescription>
                    <CardTitle className="text-xl font-black mt-1">
                      {t.label}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50">
                  <Button 
                    onClick={() => push(t.fire())}
                    variant="secondary"
                    className={`w-full text-xs font-bold tracking-widest uppercase border ${t.borderClass} hover:${t.bgClass}`}
                  >
                    Trigger {t.label}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-4">
              Usage in any page
            </h2>
            <div className="rounded-xl border border-border bg-black/50 p-6 font-mono text-xs leading-loose text-muted-foreground overflow-x-auto">
              <span className="text-slate-500">// 1. Import</span><br />
              <span className="text-accent">import</span> NotificationStack <span className="text-accent">from</span> <span className="text-primary">"@/components/NotificationToast"</span>;<br />
              <span className="text-accent">import</span> {'{ useNotifications, Notifications }'} <span className="text-accent">from</span> <span className="text-primary">"@/hooks/useNotifications"</span>;<br />
              <br />
              <span className="text-slate-500">// 2. In your component</span><br />
              <span className="text-accent">const</span> {'{ notifications, push, dismiss }'} = <span className="text-primary">useNotifications</span>();<br />
              <br />
              <span className="text-slate-500">// 3. Render the stack</span><br />
              {'<NotificationStack notifications={notifications} onDismiss={dismiss} />'}<br />
              <br />
              <span className="text-slate-500">// 4. Fire notifications</span><br />
              push(Notifications.<span className="text-primary">auctionWon</span>(<span className="text-primary">"Computer Vision"</span>, 620));<br />
              push(Notifications.<span className="text-primary">outbid</span>(<span className="text-primary">"Investor Network"</span>, 475));<br />
              push(Notifications.<span className="text-primary">marketEvent</span>(<span className="text-primary">"Volatility Spike"</span>, <span className="text-primary">"..."</span>));
            </div>
          </div>

        </div>
      </AppShell>
    </>
  );
}
