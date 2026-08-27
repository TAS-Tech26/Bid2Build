// AuctionStats.tsx


import {Clock3, Gavel, Package, Trophy, Users} from 'lucide-react'


interface Props {
    price: number
    basePrice?: number
    stock?: number
    maxStock?: number
    highestBidder: string
    teamsBidding: number
    timeLeft: number // in seconds
}


export default function AuctionStats({price, basePrice, stock, maxStock, highestBidder, teamsBidding, timeLeft}: Props) {

    // Format time (MM:SS)
    const formatTime = (secs: number) => {
        if (secs <= 0) return 'CLOSED'

        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')

        return `${m}:${s}`
    }

    // Determine color/animation for countdown timer
    const isTimeLow = timeLeft > 0 && timeLeft <= 10
    const timerColor =
        timeLeft <= 0
        ? 'text-slate-500'
        : isTimeLow
            ? "text-red-500 animate-pulse"
            : 'text-amber-500'

    return (

        <div className = "mb-8 grid gap-5 grid-cols-2 lg:grid-cols-5 text-white">
            {/* Current Bid */}
            <div className = "rounded-2xl border border-white/10 bg-white/2 p-5 shadow-sm relative overflow-hidden group hover:border-[#e8c07d]/30 transition-all">
                <div className = "absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Gavel className = "h-20 w-20 text-[#e8c07d]" />
                </div>

                <Gavel className = "mb-2 h-5 w-5 text-[#e8c07d]" />

                <div className = "text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Current Price
                </div>

                <div className = "mt-2 text-3xl sm:text-4xl font-black text-[#e8c07d] font-mono-tabular">
                    {price.toLocaleString()}
                </div>

                <div className = "text-[10px] font-mono text-slate-400 mt-0.5">
                    {basePrice ? `Base: ${basePrice} CR` : "Credits (CR)"}
                </div>
            </div>

            {/* Stock Remaining */}
            <div className = "rounded-2xl border border-white/10 bg-white/2 p-5 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                <div className = "absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Package className = "h-20 w-20 text-emerald-400" />
                </div>

                <Package className = "mb-2 h-5 w-5 text-emerald-400" />

                <div className = "text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Stock Remaining
                </div>
                
                <div className = "mt-2 text-3xl sm:text-4xl font-black text-white font-mono-tabular">
                    {stock !== undefined && maxStock !== undefined ? `${stock}/${maxStock}` : stock ?? "N/A"}
                </div>

                <div className = "text-[10px] font-mono text-slate-400 mt-0.5">
                    Copies Available
                </div>
            </div>

            {/* Highest Bidder */}
            <div className="rounded-2xl border border-white/10 bg-white/2 p-5 shadow-sm relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                <div className = "absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Trophy className="h-20 w-20 text-yellow-400" />
                </div>

                <Trophy className = "mb-2 h-5 w-5 text-yellow-400" />

                <div className = "text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Highest Bidder
                </div>

                <div className = "mt-2.5 text-lg sm:text-xl font-bold truncate">
                    {highestBidder || "No Bids Yet"}
                </div>

                <div className = "text-[10px] font-mono text-slate-400 mt-2">
                    Leading Position
                </div>
            </div>

            {/* Teams Bidding */}
            <div className = "rounded-2xl border border-white/10 bg-white/2 p-5 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all">
                <div className = "absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Users className = "h-20 w-20 text-blue-400" />
                </div>

                <Users className = "mb-2 h-5 w-5 text-blue-400" />
                
                <div className = "text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Active Bidders
                </div>

                <div className = "mt-2 text-3xl sm:text-4xl font-black font-mono-tabular">
                    {teamsBidding.toString().padStart(2, '0')}
                </div>

                <div className = "text-[10px] font-mono text-slate-400 mt-0.5">
                    Competing Teams
                </div>
            </div>

            {/* Time Remaining */}
            <div className = "rounded-2xl border border-white/10 bg-white/2 p-5 shadow-sm relative overflow-hidden group hover:border-red-500/30 transition-all col-span-2 lg:col-span-1">
                <div className = "absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Clock3 className = "h-20 w-20 text-red-500" />
                </div>

                <Clock3
                    className = {`
                        mb-2 h-5 w-5
                        ${isTimeLow
                            ? "text-red-500 animate-bounce"
                            : "text-slate-400"
                        }
                    `}
                />

                <div className = "text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Time Remaining
                </div>

                <div className = {`mt-2 text-3xl sm:text-4xl font-black font-mono-tabular ${timerColor}`}>
                    {formatTime(timeLeft)}
                </div>

                <div className = "text-[10px] font-mono text-slate-400 mt-0.5">
                    Minutes : Seconds
                </div>
            </div>
        </div>
    );
}

