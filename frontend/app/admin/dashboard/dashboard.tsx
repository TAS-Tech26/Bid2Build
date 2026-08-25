// dashboard.tsx


"use client"


import {b2bApi} from '@/app/services/api'

import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'


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
            const res = await b2bApi.get('admin/dashboard-data/')

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

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'ACTIVE':

                return "bg-green-500/10 text-green-400 border-green-500/30"

            case 'SOLD':

                return "bg-purple-500/10 text-purple-400 border-purple-500/30"

            case 'UNSOLD':

                return "bg-slate-500/10 text-slate-400 border-slate-500/30"
            
            default:

                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
        }
    }

    if (loading) {

        return (

            <div className = "min-h-screen bg-[#070b18] flex items-center justify-center text-white text-xl font-bold">
                Synchronizing Data...
            </div>

        )

    }

    return (

        <div className = 'space-y-8'>
            <div className = "flex justify-between items-end">
                <div>
                    <h1 className = "text-4xl font-black bg-linear-to-r from-white via-red-400 to-[#e8c07d] bg-clip-text text-transparent">
                        Auction Control
                    </h1>

                    <p className = "text-slate-400 mt-2 text-sm font-bold tracking-widest uppercase">
                        Master Dashboard Overview
                    </p>
                </div>

                <div className = "flex gap-4">
                    <button
                        onClick = {fetchDashboardData}
                        className = "px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 font-bold hover:bg-white/10 hover:text-white transition-all text-sm"
                    >
                        REFRESH DATA
                    </button>

                    <button
                        onClick = {handleEndTournament}
                        className = "px-5 py-2.5 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all text-sm"
                    >
                        END TOURNAMENT
                    </button>
                </div>
            </div>

            {error && (
                <div className = "p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold">
                    {error}
                </div>
            )}

            <div className = "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {technologies.map((tech) => (
                    <div
                        key = {tech.id}
                        className = "rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6 flex flex-col justify-between"
                    >
                        <div className = "flex justify-between items-start mb-6">
                            <div>
                                <h2 className = "text-xl font-bold text-white mb-1">
                                    {tech.name}
                                </h2>

                                <p className = "text-xs text-slate-500 font-bold tracking-widest uppercase">
                                    Tech ID: {tech.id}
                                </p>
                            </div>

                            <span className = {`px-3 py-1 rounded-full text-[0.65rem] font-black tracking-widest uppercase border ${getStatusStyle(tech.status)}`}>
                                {tech.status}
                            </span>
                        </div>

                        <div className = "space-y-4 mb-8">
                            <div className = "flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                                <span className = "text-xs text-slate-400 font-bold uppercase">
                                    Base Price
                                </span>

                                <span className = "font-black text-slate-200">
                                    {tech.base_price} CR
                                </span>
                            </div>

                            <div className = "flex justify-between items-center p-3 rounded-xl bg-black/20 border border-[#e8c07d]/20">
                                <span className = "text-xs text-[#e8c07d] font-bold uppercase">
                                    Highest Bid
                                </span>

                                <span className = "font-black text-[#e8c07d] text-lg">
                                    {tech.current_highest_bid} CR
                                </span>
                            </div>

                            <div className = "flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                                <span className = "text-xs text-slate-400 font-bold uppercase">
                                    Leader
                                </span>

                                <span className = "font-bold text-white truncate max-w-37.5">
                                    {tech.highest_bidder_name || "No Bids"}
                                </span>
                            </div>
                        </div>

                        <div className = "grid grid-cols-2 gap-3 mt-auto">
                            {tech.status === 'QUEUED' && (
                                <button
                                    onClick = {() => handleAction('start-auction', tech.id)}
                                    className = "col-span-2 py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 font-bold text-sm tracking-wide hover:bg-green-500 hover:text-black transition-all"
                                >
                                    START AUCTION
                                </button>
                            )}

                            {tech.status === 'ACTIVE' && (
                                <button
                                    onClick = {() => handleAction('settle-auction', tech.id)}
                                    className = "col-span-2 py-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold text-sm tracking-wide hover:bg-purple-500 hover:text-white transition-all"
                                >
                                    SETTLE AUCTION
                                </button>
                            )}

                            <button
                                onClick = {() => handleAction('emergency-reset', tech.id)}
                                className = {`
                                    py-3 rounded-xl border border-red-500/30 text-red-400 font-bold text-sm tracking-wide hover:bg-red-500 hover:text-white transition-all
                                    ${tech.status !== 'QUEUED' && tech.status !== 'ACTIVE'
                                        ? 'col-span-2'
                                        : "col-span-2 mt-2"    
                                    }
                                `}
                            >
                                EMERGENCY RESET
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )

}