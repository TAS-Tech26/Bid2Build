// MarketplaceCard.tsx


import {ArrowUpRight, Briefcase, Cloud, Cpu, Eye, Users} from 'lucide-react'


export interface Technology {
    id: number
    name: string
    description: string
    status: string // 'QUEUED' | 'ACTIVE' | 'SOLD' | 'UNSOLD'
    base_price: number
    current_price: number
    highest_bidder_id: number | null
    end: string // ISO string
}

interface MarketplaceCardProps {
    asset: Technology
    timeLeft: number
    onJoinRoom: (asset: Technology) => void
    isWatched: boolean
    onToggleWatch: (assetId: number) => void
}


export function MarketplaceCard({asset, timeLeft, onJoinRoom, onToggleWatch, isWatched}: MarketplaceCardProps) {
    // Format time (MM:SS)
    const formatTime = (secs: number) => {
        if (secs <= 0) return 'CLOSED'

        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')
        
        return `${m}:${s}`;
    };

    const getTimerColor = (secs: number) => {
        if (secs <= 0) return 'text-muted-foreground'
        if (secs < 60) return "text-destructive animate-pulse"
        if (secs < 120) return 'text-amber-500'
        
        return 'text-accent'
    }

    const Icon = asset.name.includes('Vision') ? Cpu : asset.name.includes('Cloud') ? Cloud : asset.name.includes('Investor') ? Users : Briefcase

    return (

        <div
            className = {`
                relative group rounded-none border transition-all duration-300 bg-card flex flex-col justify-between
                ${isWatched
                    ? "border-primary/50 shadow-glow"
                    : "border-border hover:border-primary/30"
                }
            `}
        >
            <div className = "flex items-center justify-between border-b border-border bg-white/1 px-4 py-2 text-[10px] font-mono tracking-wider">
                <div className = "flex items-center gap-2">
                    {asset.status === 'ACTIVE' && timeLeft > 0 ? (
                        <>
                            <span className = "relative flex h-2 w-2">
                                <span className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className = "relative inline-flex rounded-full h-2 w-2 bg-primary" />
                            </span>

                            <span className = "text-primary font-bold">
                                LIVE AUCTION
                            </span>
                        </>
                    ) : (
                        <span className = 'text-muted-foreground'>
                            {asset.status}
                        </span>
                    )}
                </div>

                {isWatched && (
                    <span className = "flex items-center gap-1 text-primary font-bold">
                        <Eye className = "h-3 w-3" />
                        
                        WATCHING
                    </span>
                )}
            </div>

            <div className = "p-5 grow">
                <div className = "flex items-start gap-4 mb-4">
                    <div className = "rounded-none border border-primary/20 bg-primary/5 p-3 shrink-0 text-primary">
                        <Icon className = "h-6 w-6" />
                    </div>

                    <div className = 'min-w-0'>
                        <h3 className = "text-base font-bold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                            {asset.name}
                        </h3>

                        <p className = "text-xs text-muted-foreground mt-1 line-clamp-2">
                            {asset.description}
                        </p>
                    </div>
                </div>

                <div className = "grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-dashed border-border/60">
                    <div>
                        <div className = "text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
                            Highest Bid
                        </div>

                        <div className = "mt-1 font-mono text-lg font-black text-primary">
                            {Number(asset.current_price || 0).toLocaleString()}
                            
                            <span className = "text-[10px] font-bold">
                                CR
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className = "text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
                            Base Price
                        </div>

                        <div className = "mt-1 font-mono text-lg font-black text-foreground">
                            {Number(asset.base_price || 0).toLocaleString()}
                            
                            <span className = "text-[10px] font-bold">
                                CR
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                    <span className = "text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
                        Time Remaining
                    </span>

                    <span className = {`font-mono text-sm font-black ${getTimerColor(timeLeft)}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className = "grid grid-cols-2 border-t border-border bg-white/1">
                <button
                    onClick = {() => onToggleWatch(asset.id)}
                    className = {`
                        flex items-center justify-center gap-1.5 py-3 text-xs font-mono font-bold uppercase border-r border-border hover:bg-white/5 transition-colors cursor-pointer
                        ${isWatched
                            ? 'text-primary'
                            : "text-muted-foreground hover:text-foreground"
                        }
                    `}
                >
                    <Eye className = "h-3.5 w-3.5" />
                    
                    {isWatched ? 'Unwatch' : 'Watch'}
                </button>

                <button
                    onClick = {() => onJoinRoom(asset)}
                    disabled = {asset.status === 'SOLD'}
                    className = {`
                        flex items-center justify-center gap-1.5 py-3 text-xs font-mono font-bold uppercase transition-colors
                        ${asset.status === 'SOLD'
                            ? "bg-secondary text-muted-foreground cursor-not-allowed"
                            : "bg-linear-to-r from-primary to-accent text-white hover:opacity-90 active:opacity-100 cursor-pointer shadow-glow"
                        }
                    `}
                >
                    {asset.status === 'SOLD' ? "SOLD OUT" : "Join Room"}
                    
                    {asset.status !== 'SOLD' && <ArrowUpRight className = "h-3.5 w-3.5" />}
                </button>
            </div>
        </div>
    
    )
}
