import { Clock3, Gavel, Package, Trophy, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
    price: number
    basePrice?: number
    stock?: number
    maxStock?: number
    highestBidder: string
    teamsBidding: number
    timeLeft: number
}

export default function AuctionStats({price, basePrice, stock, maxStock, highestBidder, teamsBidding, timeLeft}: Props) {
    const formatTime = (secs: number) => {
        if (secs <= 0) return 'CLOSED'
        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const isTimeLow = timeLeft > 0 && timeLeft <= 10
    const timerColor =
        timeLeft <= 0
        ? 'text-muted-foreground'
        : isTimeLow
            ? "text-destructive animate-pulse"
            : 'text-primary'

    return (
        <div className="mb-8 grid gap-5 grid-cols-2 lg:grid-cols-5 text-foreground">
            {/* Current Bid */}
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all bg-card/60 backdrop-blur-xl">
                <CardContent className="p-5">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Gavel className="h-20 w-20 text-primary" />
                    </div>
                    <Gavel className="mb-2 h-5 w-5 text-primary" />
                    <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Current Price</div>
                    <div className="mt-2 text-3xl sm:text-4xl font-black text-primary font-mono">{price.toLocaleString()}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1">{basePrice ? `Base: ${basePrice} CR` : "Credits (CR)"}</div>
                </CardContent>
            </Card>

            {/* Stock Remaining */}
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all bg-card/60 backdrop-blur-xl">
                <CardContent className="p-5">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Package className="h-20 w-20 text-primary" />
                    </div>
                    <Package className="mb-2 h-5 w-5 text-primary" />
                    <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Stock Remaining</div>
                    <div className="mt-2 text-3xl sm:text-4xl font-black text-foreground font-mono">{stock !== undefined && maxStock !== undefined ? `${stock}/${maxStock}` : stock ?? "N/A"}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1">Copies Available</div>
                </CardContent>
            </Card>

            {/* Highest Bidder */}
            <Card className="relative overflow-hidden group hover:border-amber-500/50 transition-all bg-card/60 backdrop-blur-xl">
                <CardContent className="p-5">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Trophy className="h-20 w-20 text-amber-500" />
                    </div>
                    <Trophy className="mb-2 h-5 w-5 text-amber-500" />
                    <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Highest Bidder</div>
                    <div className="mt-2.5 text-lg sm:text-xl font-bold truncate">{highestBidder || "No Bids Yet"}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-2">Leading Position</div>
                </CardContent>
            </Card>

            {/* Teams Bidding */}
            <Card className="relative overflow-hidden group hover:border-blue-500/50 transition-all bg-card/60 backdrop-blur-xl">
                <CardContent className="p-5">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="h-20 w-20 text-blue-500" />
                    </div>
                    <Users className="mb-2 h-5 w-5 text-blue-500" />
                    <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Active Bidders</div>
                    <div className="mt-2 text-3xl sm:text-4xl font-black font-mono">{teamsBidding.toString().padStart(2, '0')}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1">Competing Teams</div>
                </CardContent>
            </Card>

            {/* Time Remaining */}
            <Card className="relative overflow-hidden group hover:border-destructive/50 transition-all col-span-2 lg:col-span-1 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-5">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Clock3 className="h-20 w-20 text-destructive" />
                    </div>
                    <Clock3 className={`mb-2 h-5 w-5 ${isTimeLow ? "text-destructive animate-bounce" : "text-muted-foreground"}`} />
                    <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Time Remaining</div>
                    <div className={`mt-2 text-3xl sm:text-4xl font-black font-mono ${timerColor}`}>{formatTime(timeLeft)}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1">Minutes : Seconds</div>
                </CardContent>
            </Card>
        </div>
    )
}
