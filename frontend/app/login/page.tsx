// page.tsx


"use client";

import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

import {hubApi} from '../services/api'


export default function LoginPage() {

    const [roomCode, setRoomCode] = useState('')
    const [teamCode, setTeamCode] = useState('')
    const [error, setError] = useState("")

    const router = useRouter()

    const handleLogin = async () => {
        if (!roomCode.trim() || !teamCode.trim()) {
            setError("Please enter both Room Code & Team PIN.")

            return
        }

        setError('')

        try {
            const response = await hubApi.post('api/client/login/', {room_code : roomCode, team_pin : teamCode})

            console.log("login successful", response.data);

            localStorage.setItem('token', response.data.token) //To be commented later during deployment
            localStorage.setItem('team_name', response.data.team_name)
            localStorage.setItem('event_name', response.data.event_name)

            router.push('/stu_dashboard')
        } catch (error: any) {
            console.log("LOGIN FAILED:", error)

            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    setError(error.response.data.error || "Invalid Room Code or Team PIN")
                } else {
                    setError("Server error. Please try again.")
                }
            } else if (error.request) {
                setError("Could not connect to the authentication server.")
            } else {
                setError("An unexpected error occurred.")
            }
        }
    }

    return (
        
        <main className="relative min-h-screen overflow-hidden bg-[#070B18] text-white flex items-center justify-center px-6">
            {/* BACK BUTTON */}
            <Link
                href = '/'
                className = "absolute top-8 left-10 ext-sm text-slate-400 hover:text-[#E8C07D] transition"
            >
                Back to Homepage
            </Link>

            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-10">
                <div className = "absolute inset-0 bg-[radial-gradient(circle_at_50%_35%, rgba(232, 192, 125, 0.12), transparent_45%)]" />

                <div
                    className = "absolute inset-0 opacity-[0.035]"
                    style = {{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
                        backgroundSize: "70px 70px"
                    }}
                />

                <div className = "absolute inset-0 bg-gradient-to-b from-transparent via-[#070B18]/20 to-[#070B18]"/>
            </div>

            {/* LOGIN CARD */}
            <div className = "w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 shadow-[0_20px_80px_rgba(0, 0, 0, 0.4)]">
                <h1 className = "text-3xl font-bold text-center bg-gradient-to-r from-white to-[#E8C07D] bg-clip-text text-transparent mb-8">
                    Welcome To

                    <br/>

                    Bid2Build
                </h1>

                <div className = 'space-y-5'>
                    <input
                        type = 'text'
                        placeholder = "Room Code"
                        value = {roomCode}
                        onChange = {(e) => setRoomCode(e.target.value)}
                        className = "w-full p-4 rounded-xl bg-white/[0.05] border border-white/10 text-white outline-none focus:border-[#E8C07D]/60 uppercase"
                    />

                    <input
                        type = 'text'
                        placeholder = "Team PIN"
                        value = {teamCode}
                        onChange = {(e) => setTeamCode(e.target.value)}
                        className = "w-full p-4 rounded-xl bg-white/[0.05] border border-white/10 text-white outline-none focus:border-[#E8C07D]/60 uppercase"
                    />

                    {error && (
                        <p className = "text-red-400 text-sm">
                            {error}
                        </p>
                    )}

                    <button
                        onClick = {handleLogin}
                        className = "w-full mt-4 rounded-xl bg-gradient-to-r from-[#E8C07D] to-[#8B5CF6] p-4 font-bold text-black transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(232, 192, 125, 0.35)]"
                    >
                        Enter Bid2Build
                    </button>
                </div>
            </div>
        </main>
    
    )

}