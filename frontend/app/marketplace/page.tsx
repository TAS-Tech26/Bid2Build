// marketplace/page.tsx


"use client"


import AppShell from '@/components/AppShell'
import {MarketplaceCard, Technology} from '@/components/bidding/MarketplaceCard'
import {Card} from '@/components/ui/card'

import {Loader2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

import b2bApi from '../services/api'


export default function MarketplacePage() {
  
    const router = useRouter()
  
    const [credits, setCredits] = useState<any>()
    const [tech, setTech] = useState<Technology[]>([])
    const [teamName, setTeamName] = useState('')
    const [loading, setLoading] = useState(true)
    const [watchedAssets, setWatchedAssets] = useState<Set<number>>(new Set())
    // Per-auction countdown timers (keyed by id)
    const [timers, setTimers] = useState<Record<number, number>>({})

    useEffect(() => {
        const token = localStorage.getItem('token')
        const storedTeam = localStorage.getItem('team_name') || localStorage.getItem('teamName')
        
        const fetch_credits = async () => {
            try {
                if (token) {
                    const response = await b2bApi.get('fetchcredits/', {headers: {Authorization: `Bearer ${token}`}})
                    
                    setCredits(response.data.available_credits)
                }
            } catch (e) {
                console.log("Failed to fetch team credits, error:", e)
            }
        }
        fetch_credits()

        try {
            setTeamName(storedTeam || "Your Team")
        } catch (error) {
            console.log("Invalid team data", error)
            
            router.push('/login')
        }
    }, [router])

    useEffect(() => {
        const fetchTech = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await b2bApi.get('items/', {headers: {Authorization: `Bearer ${token}`}})

                setTech(response.data.technologies)

                const initialTimers: Record<number, number> = {}
                
                response.data.technologies.forEach((item: Technology) => {
                    if (item.end) {
                        initialTimers[item.id] = Math.max(0, Math.floor((new Date(item.end).getTime() - Date.now())/1000))
                    }
                })

                setTimers(initialTimers)
            } catch (e) {
                console.log("Failed to fetch technologies:", e)
            } finally {
                setLoading(false)
            }
        }

        fetchTech()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prev) => {
                const updated = {...prev}

                Object.keys(updated).forEach((id) => {
                    if (updated[Number(id)] > 0) {
                        updated[Number(id)] -= 1
                    }
                })

                return updated
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const liveCount = tech.filter((a) => a.status === 'ACTIVE').length

    const toggleWatch = (id: number) => {
        setWatchedAssets(prev => {
            const next = new Set(prev)

            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }

            return next
        })
    }

    const joinRoom = (asset: Technology) => {
        router.push(`/bidding/${asset.id}`)
    }

    if (loading) {

        return (
            <AppShell
                role = 'participant'
                active = 'marketplace'
                overrideCredits = {credits}
            >
                <div className = "flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
                    <Loader2 className = "h-8 w-8 animate-spin text-primary" />

                    <p className = "font-mono text-xs uppercase tracking-widest">
                        Syncing Marketplace Data...
                    </p>
                </div>
            </AppShell>
        )

    }

    return (

        <AppShell
            role = 'participant'
            active = 'marketplace'
            overrideCredits = {credits}
        >
            <div className = "flex flex-col gap-8 max-w-350 mx-auto w-full">
                {/* HEADER */}
                <div className = "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className = "flex items-center gap-3">
                            <h1 className = "text-3xl font-black tracking-tight text-foreground m-0">
                                Live Marketplace
                            </h1>
                            
                            {liveCount > 0 ? (
                                <span className = "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono font-bold text-primary">
                                
                                <span className = "h-2 w-2 animate-ping rounded-full bg-primary" />
                                    MARKET OPEN
                                </span>
                            ) : (
                                <span className = "inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-mono font-bold text-red-400">
                                    MARKETPLACE CLOSED
                                </span>
                            )}
                        </div>

                        <p className = "mt-2 text-sm text-muted-foreground">
                            Join dedicated auction rooms and compete for strategic B2B startup assets.
                        </p>
                    </div>
                </div>

                {/* Categories Tabs (UI Only) */}
                <div className = "flex flex-wrap gap-3">
                    {["Core Technologies", "Business Resources", "Premium Assets"].map((item, i) => (
                        <button
                            key = {item}
                            className = {`
                                rounded-xl border px-5 py-3 text-sm font-semibold transition-all cursor-pointer
                                ${i === 0
                                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                                    : "border-border hover:border-primary/50 bg-secondary text-muted-foreground"
                                }
                            `}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Auction Grid */}
                {tech.length === 0 ? (
                    <Card className = "border-dashed bg-transparent p-12 text-center">
                        <div className = "text-muted-foreground font-mono text-sm uppercase tracking-wider">
                            No active auctions
                        </div>
                    </Card>
                ) : (
                    <div className = "grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {tech.map((technology) => (
                            <MarketplaceCard
                                key = {technology.id}
                                asset = {technology}
                                timeLeft = {timers[technology.id] ?? 0}
                                onJoinRoom = {joinRoom}
                                isWatched = {watchedAssets.has(technology.id)}
                                onToggleWatch = {toggleWatch}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppShell>

    )
}
