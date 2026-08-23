// useAuctionSocket.ts


import { parse } from 'path';
import {useEffect, useRef, useState} from 'react'
import { json } from 'stream/consumers';


interface AuctionState {
    currentHighestBid : string;
    highestBidderName : string;
    auctionStatus : string;
    endTime : string | null;
    recentEvents : string[];
}


export default function useAuctionSocket(techId : number) {

    const [auctionState, setAuctionState] = useState<AuctionState>({
        currentHighestBid : '0.00',
        highestBidderName : 'None',
        auctionStatus : 'QUEUED',
        endTime : null,
        recentEvents : [],
    })
    
    const ws = useRef<WebSocket | null>(null)

    useEffect(() => {
        if (!techId) return

        let reconnectInterval: NodeJS.Timeout

        const connect = () => {
            const wsUrl = process.env.PUBLIC_WS_URL || 'ws://127.0.0.1:8002'

            ws.current = new WebSocket(`${wsUrl}/ws/bid/${techId}/`)
            ws.current.onmessage = (event) => {
                const parsed = JSON.parse(event.data)
                const payload = parsed.data

                switch (parsed.type) {
                    case 'bid_update':
                        setAuctionState(prev => ({
                            ...prev,
                            currentHighestBid : payload.new_highest_bid,
                            highestBidderName : payload.highest_bidder_name,
                            recentEvents : [`${payload.highest_bidder_name} bid ${payload.new_highest_bid}`, ...prev.recentEvents].slice(0, 5)
                        }))

                        break
                    case 'auction_started':
                        setAuctionState(prev => ({...prev, auctionStatus : 'ACTIVE', endTime : payload.end_time}))

                        break
                    case 'auction_ended':
                        setAuctionState(prev => ({
                            ...prev,
                            auctionStatus : payload.status,
                            recentEvents : [`Auction ended. Winner : ${payload.winner_name || 'None'}`, ...prev.recentEvents]})
                        )

                        break
                    case 'participant_update':
                        setAuctionState(prev => ({...prev, recentEvents : [`${payload.team_name} ${payload.status}`, ...prev.recentEvents].slice(0, 5)}))

                        break
                }
            }

            ws.current.onclose = () => {
                console.warn("WebSocket disconnected. Attempting to reconnect...")

                reconnectInterval = setTimeout(connect, 2000)
            }
        }

        connect()

        return () => {
            clearTimeout(reconnectInterval)

            if (ws.current) {
                ws.current.onclose = null
                
                ws.current.close()
            }
        }
    }, [techId])

    return auctionState

}