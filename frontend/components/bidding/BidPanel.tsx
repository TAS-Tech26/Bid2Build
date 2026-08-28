// BidPanel.tsx


import {Coins, Gavel, Trophy, XOctagon} from 'lucide-react'


interface Props {
    asset: {
        id: number
        name: string
        category: string
        price: number
        basePrice: number
        highestBidder: string
        userBid: number
        status: 'live' | 'won' | 'lost'
    }
    bidAmount: string
    setBidAmount: (v: string) => void
    availableCredits: number
    onPlaceBid: (amount: number) => void
    isExpired: boolean
    hasWithdrawn: boolean
    onBackOut: () => void
}


export default function BidPanel({asset, bidAmount, setBidAmount, availableCredits, onPlaceBid, isExpired, hasWithdrawn, onBackOut}: Props) {
  
    const minIncrement = 10
    const minimumBid = asset.price + minIncrement
  
    const handlePlaceBid = () => {
        const amount = Number(bidAmount)

        if (isNaN(amount) || amount < minimumBid) return

        onPlaceBid(amount)
    }

    return (
        
        <div className = 'space-y-6'>
            {/* Available Credits */}
            <div className = "rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <Coins className = "h-5 w-5 text-primary" />
                    <span className = "text-sm font-semibold text-foreground">
                        Available Credits
                    </span>
                </div>
                
                <div className = "mt-4 text-5xl font-black text-primary font-mono">
                    {availableCredits.toLocaleString()}
                </div>
            </div>

            {/* Highest Bidder */}
            <div className = "rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-sm">
                <div className = "flex items-center gap-3">
                    <Trophy className = "h-5 w-5 text-amber-400" />
                    
                    <span className = "font-semibold text-amber-400">
                        Current Leader
                    </span>
                </div>

                <div className = "mt-4 text-2xl font-black truncate text-foreground">
                    {asset.highestBidder || "No Bids Yet"}
                </div>

                <div className = "mt-1 text-sm text-muted-foreground">
                    {asset.highestBidder
                        ? `Winning with ${asset.price} Credits`
                        : `Base Price: ${asset.basePrice} CR`
                    }
                </div>

                {asset.userBid > 0 && (
                    <div className = "mt-3 pt-3 border-t border-amber-500/20 text-xs font-mono font-bold text-primary flex items-center justify-between">
                        <span>Your Active Bid:</span>

                        <span>{asset.userBid} CR</span>
                    </div>
                )}
            </div>

            {/* Place Bid Section */}
            <div className = "rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-sm">
                <div className = "flex items-center justify-between mb-5">
                    <div className = "flex items-center gap-3">
                        <Gavel className = "h-5 w-5 text-primary" />

                        <span className = "font-semibold text-foreground">
                            Place Custom Bid
                        </span>
                    </div>
                </div>

                <div className = "mb-4 rounded-xl border border-border bg-background p-4">
                    <div className = "text-xs uppercase text-muted-foreground font-mono">
                        Minimum Valid Bid (Min +10 CR)
                    </div>

                    <div className = "mt-2 text-3xl font-black text-primary font-mono">
                        {minimumBid} CR
                    </div>
                </div>

                {/* Quick Increment Buttons */}
                <div className = "grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map((value) => (
                        <button
                            key = {value}
                            disabled = {isExpired || hasWithdrawn}
                            onClick = {() => setBidAmount(String(asset.price + value))}
                            className = "rounded-xl border border-border py-2.5 text-xs font-mono font-bold text-foreground transition hover:border-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            +{value}
                        </button>
                    ))}
                </div>

                {/* Custom Input */}
                <input
                    type = 'number'
                    value = {bidAmount}
                    onChange = {(e) => setBidAmount(e.target.value)}
                    placeholder = {`Enter bid >= ${minimumBid}`}
                    disabled = {isExpired || hasWithdrawn}
                    className = "mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary font-mono font-bold text-foreground disabled:opacity-40"
                />

                {/* Place Bid Button */}
                <button
                    onClick = {handlePlaceBid}
                    disabled = {isExpired || hasWithdrawn || !bidAmount || Number(bidAmount) < minimumBid || Number(bidAmount) > availableCredits}
                    className = "mt-5 w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-mono tracking-widest uppercase"
                >
                    {isExpired
                        ? (asset.status === 'won' ? "AUCTION WON" : "AUCTION CLOSED")
                        : hasWithdrawn
                            ? "YOU WITHDREW"
                            : Number(bidAmount) > availableCredits
                                ? "INSUFFICIENT CREDITS"
                                : "PLACE BID"
                    }
                </button>

                <button
                    onClick = {onBackOut}
                    disabled = {isExpired || hasWithdrawn || (asset.userBid === asset.price && asset.userBid > 0)}
                    className = "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 transition hover:border-destructive hover:text-destructive text-muted-foreground cursor-pointer text-xs font-mono font-bold uppercase disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-muted-foreground"
                >
                    <XOctagon className = "h-4 w-4" />
                    
                    Withdraw from Auction
                </button>
            </div>
        </div>

    )
}
