"use client"

import { b2bApi } from '@/app/services/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Technology {
    id: number
    name: string
    status: 'QUEUED' | 'ACTIVE' | 'SOLD' | 'UNSOLD'
    base_price: string
    current_highest_bid: string
    highest_bidder_name: string
    end_time: string | null
}

export default function AdminDashboard() {
    const router = useRouter()
    const [technologies, setTechnologies] = useState<Technology[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    
    const fetchDashboardData = async () => {
        try {
            const res = await b2bApi.get('items/')
            setTechnologies(res.data.technologies)
            setError('')
        } catch (err : any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token')
                localStorage.removeItem('adminId')
                localStorage.removeItem('role')
                router.replace('/admin-login')
            } else {
                setError("Failed to fetch dashboard data. Check backend connection")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/admin-login')
        } else {
            fetchDashboardData()
        }
    }, [router])

    const handleAction = async (action: string, techId: number) => {
        const confirmMsg = `Execute ${action.toUpperCase().replace('-', ' ')} on Tech #${techId}`
        if (!window.confirm(confirmMsg)) return
        try {
            await b2bApi.post(`admin/${action}/${techId}/`)
            fetchDashboardData()
        } catch (err : any) {
            alert(err.response?.data?.error || `Failed to execute ${action}`)
        }
    }

    const handleEndTournament = async () => {
        if (!window.confirm("WARNING: This will end the Bid2Build tournament & push final results to the Hub. Proceed?")) return
        try {
            await b2bApi.post('admin/end-tournament/')
            alert("Tournament locked & results successfully synced to Hub.")
        } catch (err : any) {
            alert(err.response?.data?.error || "Failed to sync final results")
        }
    }

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'ACTIVE':
                return <Badge variant="default" className="bg-primary/15 text-primary border-primary/20">ACTIVE</Badge>
            case 'SOLD':
                return <Badge variant="outline" className="text-purple-400 border-purple-500/30">SOLD</Badge>
            case 'UNSOLD':
                return <Badge variant="outline" className="text-muted-foreground">UNSOLD</Badge>
            default:
                return <Badge variant="outline" className="text-amber-500 border-amber-500/30">QUEUED</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground font-mono font-bold text-xs uppercase tracking-widest">
                Synchronizing Data...
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Auction Control
                    </h1>
                    <p className="text-muted-foreground mt-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                        Master Dashboard Overview
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={fetchDashboardData}
                        variant="outline"
                        className="font-bold text-xs uppercase tracking-widest"
                    >
                        Refresh Data
                    </Button>
                    <Button
                        onClick={handleEndTournament}
                        variant="destructive"
                        className="font-bold text-xs uppercase tracking-widest"
                    >
                        End Tournament
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive font-mono text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {technologies.map((tech) => (
                    <Card key={tech.id} className="flex flex-col bg-card/60 backdrop-blur-xl border-border">
                        <CardHeader className="flex flex-row justify-between items-start pb-4">
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight mb-1">
                                    {tech.name}
                                </CardTitle>
                                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase font-mono">
                                    Tech ID: {tech.id.toString().padStart(3, "0")}
                                </p>
                            </div>
                            {getStatusBadge(tech.status)}
                        </CardHeader>

                        <CardContent className="space-y-4 flex-grow">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    Base Price
                                </span>
                                <span className="font-black font-mono text-foreground">
                                    {tech.base_price} CR
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
                                    Highest Bid
                                </span>
                                <span className="font-black font-mono text-primary text-lg">
                                    {tech.current_highest_bid} CR
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    Leader
                                </span>
                                <span className="font-bold text-foreground truncate max-w-[150px]">
                                    {tech.highest_bidder_name || "No Bids"}
                                </span>
                            </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                            {tech.status === 'QUEUED' && (
                                <Button
                                    onClick={() => handleAction('start-auction', tech.id)}
                                    className="col-span-2 font-bold text-xs tracking-widest uppercase bg-primary hover:bg-primary text-white"
                                >
                                    Start Auction
                                </Button>
                            )}
                            {tech.status === 'ACTIVE' && (
                                <Button
                                    onClick={() => handleAction('settle-auction', tech.id)}
                                    className="col-span-2 font-bold text-xs tracking-widest uppercase bg-purple-500 hover:bg-purple-600 text-white"
                                >
                                    Settle Auction
                                </Button>
                            )}
                            <Button
                                onClick={() => handleAction('emergency-reset', tech.id)}
                                variant="outline"
                                className={`font-bold text-xs tracking-widest uppercase text-destructive border-destructive/30 hover:bg-destructive hover:text-white ${tech.status !== 'QUEUED' && tech.status !== 'ACTIVE' ? 'col-span-2' : 'col-span-2'}`}
                            >
                                Emergency Reset
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
