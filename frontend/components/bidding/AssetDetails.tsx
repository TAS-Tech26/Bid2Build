import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    asset: {
        name: string
        description?: string
        purpose?: string
        benefit?: string
        price: number
        teams: number
        time: number
    }
}

// Format seconds as MM:SS
function formatTime(secs: number): string {
    if (secs <= 0) return 'CLOSED'
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

export default function AssetDetails({asset}: Props) {
    return (
        <div className="space-y-6">
            {/* Description */}
            <Card className="bg-card/60 backdrop-blur-xl border-border">
                <CardHeader>
                    <CardTitle>About this Asset</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="leading-7 text-muted-foreground">
                        {asset.description ?? "This strategic asset strengthens your startup during Round 2. Purchasing it unlocks additional capabilities that can improve your proposal, business model & final judging score."}
                    </p>
                </CardContent>
            </Card>

            {/* Purpose */}
            <Card className="bg-card/60 backdrop-blur-xl border-border">
                <CardHeader>
                    <CardTitle>Purpose</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="leading-7 text-muted-foreground">
                        {asset.purpose ?? "Integrate this asset into your startup solution to solve real-world problems more effectively."}
                    </p>
                </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-card/60 backdrop-blur-xl border-border">
                <CardHeader>
                    <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                        <li>• Improves feasibility of your startup.</li>
                        <li>• Strengthens business execution.</li>
                        <li>• Helps during market disruptions.</li>
                        <li>• Can improve judging scores when used properly.</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Live Statistics */}
            <Card className="bg-card/60 backdrop-blur-xl border-border">
                <CardHeader>
                    <CardTitle>Live Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-border bg-secondary/50 p-4">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                Starting Price
                            </div>
                            <div className="mt-2 text-2xl font-black text-primary font-mono">
                                {asset.price} CR
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-secondary/50 p-4">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                Teams Watching
                            </div>
                            <div className="mt-2 text-2xl font-black font-mono">
                                {asset.teams}
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-secondary/50 p-4">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                Auction Ends
                            </div>
                            <div className="mt-2 text-2xl font-black text-destructive font-mono">
                                {formatTime(asset.time)}
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-secondary/50 p-4">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                Status
                            </div>
                            <div className="mt-2 text-xl font-black text-primary font-mono tracking-widest">
                                LIVE
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rules */}
            <Card className="border-amber-500/30 bg-amber-500/10">
                <CardHeader>
                    <CardTitle className="text-amber-500">Auction Rules</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-sm text-foreground">
                        <li>• Highest bid at timer expiry wins.</li>
                        <li>• Once submitted, bids cannot be withdrawn.</li>
                        <li>• Credits are deducted only if your team wins.</li>
                        <li>• Purchased assets must be used in your final startup.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
