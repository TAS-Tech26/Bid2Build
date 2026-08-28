// bidding/[id]/page.tsx


"use client"


import b2bApi from '@/app/services/api'

import AppShell from '@/components/AppShell'
import NotificationStack from '@/components/NotificationToast'
import AuctionHeader from '@/components/bidding/AuctionHeader'
import AuctionStats from '@/components/bidding/AuctionStats'
import AssetDetails from '@/components/bidding/AssetDetails'
import BidPanel from '@/components/bidding/BidPanel'
import LiveActivity, {HistoryEntry} from '@/components/bidding/LiveActivity'
import {Notifications, useNotifications} from '@/hooks/useNotifications'

import {useParams, useRouter} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'


type TeamStatus = 'ACTIVE' | "HIGHEST BIDDER" | "BACKED OUT"


interface Team {
    name: string
    status: TeamStatus
}


function nowTime() {

    return new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})

}

export default function BiddingRoom() {

    const {notifications, push, dismiss} = useNotifications()
    const params  = useParams()
    const router  = useRouter()
    
    const id = String(params.id)

    const [credits, setCredits] = useState('0')
    const [teamName, setTeamName] = useState('')
    
    const [asset, setAsset] = useState<any>(null)
    const [timer, setTimer] = useState(0)
    const [highestBid, setHighestBid] = useState(0)
    const [leader, setLeader] = useState('')
    const [hasWithdrawn, setHasWithdrawn] = useState(false)
    const [teams, setTeams] = useState<Team[]>([])
    const [bidFeed, setBidFeed] = useState<HistoryEntry[]>([])
    const [bidAmount, setBidAmount] = useState('')
    const bidIdRef = useRef(1)

    // Initialize data and join room
    useEffect(() => {
        const token = localStorage.getItem('token')
        const storedTeam = localStorage.getItem('team_name') || localStorage.getItem('teamName')
        
        if (storedTeam) setTeamName(storedTeam)

        const init = async () => {
            try {
                if (!token) return

                // Fetch credits
                const creditRes = await b2bApi.get('fetchcredits/')

                setCredits(creditRes.data.available_credits)

                // Fetch all tech to find this one
                const itemsRes = await b2bApi.get('items/')
                const tech = itemsRes.data.technologies.find((t: any) => t.id === Number(id))

                if (tech) {
                    setAsset({
                        name: tech.name,
                        category: tech.category,
                        startingBid: parseFloat(tech.base_price),
                        description: tech.description,
                        purpose: tech.purpose,
                        status: tech.status,
                        stock: tech.stock,
                        maxStock: tech.max_stock
                    })
                    setHighestBid(parseFloat(tech.current_highest_bid) > 0 ? parseFloat(tech.current_highest_bid) : parseFloat(tech.base_price))
                    setLeader(tech.highest_bidder ? tech.highest_bidder.name : '')
                    
                    if (tech.end) {
                        const timeLeft = Math.max(0, Math.floor((new Date(tech.end).getTime() - Date.now())/1000))
                        
                        setTimer(timeLeft)
                    }
                }

                // Join the room
                await b2bApi.post('join/', {tech_id: Number(id)})

                // Fetch room details
                const roomRes = await b2bApi.get(`items/${id}/room/`)
                const roomTeams = roomRes.data.teams_in_room.map((t: any) => ({name: t.team_name, status: 'ACTIVE'}))
                setTeams(roomTeams)
                
                const history = roomRes.data.bid_history.map((h: any, idx: number) => ({
                    id: bidIdRef.current++,
                    team: h.team_name,
                    bid: parseFloat(h.amount),
                    time: new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
                    isYou: h.team_name === storedTeam
                })).reverse()
                
                setBidFeed(history)
            } catch (err) {
                console.error("Failed to initialize room", err)
            }
        }
        
        init()

        // Cleanup when leaving room
        return () => {
            // Don't auto back-out if they are just navigating away? 
            // The rules say they stay in unless they explicitly back out, or maybe we do back out? 
            // Actually, if we want them to stay active, we don't back out on unmount.
        }
    }, [id])

    // WebSocket Connection
    useEffect(() => {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8002/'
        const ws = new WebSocket(`${wsUrl}ws/bids/${id}/`)

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data)

            if (msg.type === 'bid_update') {
                const {highest_bidder_name, new_highest_bid, end_time} = msg.data
                const newBid = parseFloat(new_highest_bid)
                
                setHighestBid(newBid)
                setLeader(highest_bidder_name)
                
                setBidFeed(prev => [
                    {id: bidIdRef.current++, team: highest_bidder_name, bid: newBid, time: nowTime(), isYou: highest_bidder_name === teamName},
                    ...prev
                ])
                
                if (end_time) {
                    const timeLeft = Math.max(0, Math.floor((new Date(end_time).getTime() - Date.now())/1000))
                    setTimer(timeLeft)
                }
                
                if (highest_bidder_name !== teamName) push(Notifications.outbid(asset?.name || 'Asset', newBid))
            } else if (msg.type === 'participant_update') {
                const { team_name, status } = msg.data

                setTeams(prev => {
                    if (status === 'JOINED') {
                        if (!prev.find(t => t.name === team_name)) {

                            return [...prev, {name: team_name, status: 'ACTIVE'}]

                        }
                    } else if (status === 'BACKED_OUT') {

                        return prev.map(t => t.name === team_name ? {...t, status: "BACKED OUT"} : t)

                    }

                    return prev
                })
            } else if (msg.type === 'auction_started') {
                const {end_time} = msg.data
                const timeLeft = Math.max(0, Math.floor((new Date(end_time).getTime() - Date.now())/1000))

                setTimer(timeLeft)
                setAsset((prev: any) => ({...prev, status: 'ACTIVE'}))
            } else if (msg.type === 'auction_ended') {
                const {status, winner_name} = msg.data

                setTimer(0)
                setAsset((prev: any) => ({...prev, status}))

                if (winner_name === teamName) push(Notifications.auctionWon(asset?.name || 'Asset', highestBid))
            }
        }

        return () => ws.close()
    }, [id, teamName, asset])

    // Timer Countdown
    useEffect(() => {
        if (timer <= 0) return

        const iv = setInterval(() => setTimer(p => p - 1), 1000)

        return () => clearInterval(iv)
    }, [timer])

    const remaining = teams.filter(t => t.status !== "BACKED OUT").length
    const isExpired = timer <= 0 || (asset?.status === 'SOLD' || asset?.status === 'UNSOLD')

    async function placeBid(amount: number) {
        if (hasWithdrawn) return

        try {
            await b2bApi.post('bid/', {tech_id: Number(id), bid_amount: amount})
            setBidAmount('')
            
            // Optimistically update credits
            setCredits(String(Number(credits) - amount))
        } catch (err: any) {
            const errMsg = err.response?.data?.error || "Failed to place bid"

            // Show error toast
            push({type: 'market_event', title: "Bid Failed", message: errMsg})
        }
    }

    async function backOut() {
        if (leader === teamName) {
            alert("You cannot back out while holding the highest bid")

            return
        }
        
        try {
            await b2bApi.post('back-out/', {tech_id: Number(id)})

            setHasWithdrawn(true)
            setTeams(prev => prev.map(t => t.name === teamName ? {...t, status: "BACKED OUT"} : t))
        } catch (err: any) {
            const errMsg = err.response?.data?.error || "Failed to back out"

            push({type: 'market_event', title: 'Error', message: errMsg})
        }
    }

    const userBid = leader === teamName ? highestBid : 0
  
    if (!asset) return null // loading state

    return (
        
        <>
            <NotificationStack
                notifications = {notifications}
                onDismiss = {dismiss}
            />

            <AppShell
                role = 'participant'
                active = 'marketplace'
                overrideCredits = {credits}
            >
                <div className = "mx-auto w-full max-w-7xl pb-20">
                    <AuctionHeader
                        assetName = {asset.name}
                        category = {asset.category}
                        onClose = {() => router.push('/marketplace')}
                    />

                    <AuctionStats
                        price = {highestBid}
                        basePrice = {asset.startingBid}
                        stock = {asset.stock}
                        maxStock = {asset.maxStock}
                        highestBidder = {leader}
                        teamsBidding = {remaining}
                        timeLeft = {timer}
                    />

                    <div className = "grid gap-8 lg:grid-cols-[1.4fr_380px]">
                        <div className = 'space-y-8'>
                            <LiveActivity
                                history = {bidFeed} 
                                status = {isExpired ? (leader === teamName ? 'won' : 'lost') : 'live'}
                            />
                            
                            <AssetDetails 
                                asset = {{
                                    name: asset.name,
                                    description: asset.description,
                                    purpose: asset.purpose,
                                    price: asset.startingBid,
                                    teams: remaining,
                                    time: timer
                                }} 
                            />
                        </div>

                        <div>
                            <BidPanel 
                                asset={{
                                    id: Number(id),
                                    name: asset.name,
                                    category: asset.category,
                                    price: highestBid,
                                    basePrice: asset.startingBid,
                                    highestBidder: leader,
                                    userBid: userBid,
                                    status: isExpired ? (leader === teamName ? 'won' : 'lost') : 'live'
                                }}
                                bidAmount = {bidAmount}
                                setBidAmount = {setBidAmount}
                                availableCredits = {Number(credits)}
                                onPlaceBid = {placeBid}
                                isExpired = {isExpired}
                                hasWithdrawn = {hasWithdrawn}
                                onBackOut = {backOut}
                            />
                        </div>
                    </div>
                </div>
            </AppShell>
        </>

    )
}
