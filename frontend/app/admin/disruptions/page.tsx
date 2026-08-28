"use client"

import { useState } from 'react'
import AppShell from '@/components/AppShell'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { b2bApi } from '@/app/services/api'
import { ShieldAlert, AlertTriangle } from 'lucide-react'

const DISRUPTIONS = [
  {
    id: "ai-trust",
    title: "AI Trust Crisis",
    description: "A massive wave of AI-generated misinformation and deepfakes has caused public distrust and stricter regulations.",
    affected_teams: "AI Assistant, Secure Login, Legal Team",
    expected_adaptation: "Introduce AI safety measures, content verification, user authentication, or a human-first trust strategy."
  },
  {
    id: "cloud-outage",
    title: "Cloud Server Outage",
    description: "A major cloud provider suffers a global outage, making many online services inaccessible.",
    affected_teams: "Cloud Servers, Smart Devices",
    expected_adaptation: "Design an offline mode, backup infrastructure, or local data storage solution."
  },
  {
    id: "data-privacy",
    title: "New Data Privacy Law",
    description: "The government introduces strict data privacy regulations overnight, limiting data collection and usage.",
    affected_teams: "Customer Data, AI Assistant, Legal Team",
    expected_adaptation: "Modify data collection policies, obtain user consent, redesign workflows for compliance."
  },
  {
    id: "competitor-launch",
    title: "Major Competitor Launch",
    description: "A global tech company launches a product almost identical to yours just before your release.",
    affected_teams: "All Teams",
    expected_adaptation: "Differentiate your startup through unique features, pricing, branding, customer experience, or niche targeting."
  },
  {
    id: "funding-crisis",
    title: "Funding Crisis",
    description: "An economic downturn causes investors to withdraw funding, forcing startups to operate on tighter budgets.",
    affected_teams: "Government Funding, Investor Access",
    expected_adaptation: "Reduce costs, prioritise core features, revise the business model, or identify alternative revenue streams."
  },
  {
    id: "viral-success",
    title: "Overnight Viral Success",
    description: "Your startup unexpectedly gains millions of users overnight after going viral on social media.",
    affected_teams: "Cloud Servers, Marketing Team, Business Mentor",
    expected_adaptation: "Explain how your startup will scale infrastructure, customer support, operations, and long-term growth while maintaining service quality."
  }
]

export default function AdminDisruptions() {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const triggerDisruption = async (disruption: typeof DISRUPTIONS[0]) => {
    if (!window.confirm(`Are you sure you want to trigger "${disruption.title}"? This will broadcast to all teams immediately.`)) {
      return
    }

    setLoadingId(disruption.id)
    try {
      await b2bApi.post('admin/trigger-disruption/', {
        title: disruption.title,
        description: disruption.description,
        affected_teams: disruption.affected_teams,
        expected_adaptation: disruption.expected_adaptation
      })
      alert(`Successfully broadcasted: ${disruption.title}`)
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to trigger disruption.")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <AppShell role="admin" active="admin-disruptions">
      <div className="space-y-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
          <div>
            <h1 className="text-4xl font-black text-destructive flex items-center gap-3">
              <ShieldAlert className="w-10 h-10" />
              Market Disruptions
            </h1>
            <p className="text-muted-foreground mt-2 text-[10px] font-bold tracking-[0.2em] uppercase">
              Global Event Triggers
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive font-mono text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            <strong>WARNING:</strong> Triggering a disruption will immediately broadcast a global notification to all participants currently online. 
            Only ONE disruption should be triggered on the day of the event.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {DISRUPTIONS.map((disruption) => (
            <Card key={disruption.id} className="flex flex-col bg-card/60 backdrop-blur-xl border-border hover:border-destructive/50 transition-colors">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                  {disruption.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-6 flex-grow">
                <p className="text-sm text-muted-foreground">
                  {disruption.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest block">
                    Most Affected Teams (Assets)
                  </span>
                  <span className="font-mono text-xs text-foreground block">
                    {disruption.affected_teams}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block">
                    Expected Adaptation
                  </span>
                  <span className="font-mono text-xs text-foreground block">
                    {disruption.expected_adaptation}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-border">
                <Button
                  onClick={() => triggerDisruption(disruption)}
                  disabled={loadingId !== null}
                  variant="destructive"
                  className="w-full font-bold text-xs tracking-widest uppercase"
                >
                  {loadingId === disruption.id ? "Broadcasting..." : "Trigger Event"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
