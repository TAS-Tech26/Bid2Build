// admin-login.tsx


"use client"


import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

import {hubApi} from '../services/api'


export default function AdminLoginPage() {
  
    const router = useRouter()

    const [adminId, setAdminId] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [mounted, setMounted] = useState(false)

    /* Hydration guard */
    useEffect(() => {
        setMounted(true)
    }, [])

    /* Redirect if already logged in */
    useEffect(() => {
        if (!mounted) return

        if (localStorage.getItem('adminId') && localStorage.getItem('token')) router.replace('/admin/dashboard')
    }, [mounted, router])

    async function handleLogin() {
        setError('')

        if (!adminId.trim() || !password.trim()) {
            setError("Please enter both Admin ID & password.")
        
            return
        }

        setLoading(true)

        try {
            const response = await hubApi.post('host/login/', {username: adminId.trim(), password: password})

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('adminId', response.data.username)
            localStorage.setItem('role', response.data.role)

            router.push('/admin/dashboard')
        } catch (err : any) {
            localStorage.removeItem('token')
            localStorage.removeItem('role')

            setLoading(false)

            setError(err.response?.data?.error || "Invalid credentials. Access denied.")
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleLogin()
    }

    if (!mounted) {

        return (
            
            <div className = "min-h-screen bg-[#070b18]" />
        
        )
    
    }

    return (
        <main className = "relative min-h-screen overflow-hidden bg-[#070b18] text-white flex items-center justify-center px-6">
            {/* ── Back to Home ── */}
            <Link
                href = '/'
                className = "absolute top-7 left-9 text-sm font-semibold text-slate-500 hover:text-[#e8c07d]">
                ← Back to Home
            </Link>

            <div className = "absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_30%, rgba(239, 68, 68, 0.11)_0%, transparent_65%)] pointer-events-none" />
            <div className = "absolute inset-0 z-0 bg-[radial-gradient(ellipse_45%_40%_at_85%_85%, rgba(232, 192, 125, 0.07)_0%, transparent_60%)] pointer-events-none" />
            <div className = "absolute -inset-10 z-0 opacity-3 bg-[linear-gradient(to_right, rgba(255, 255, 255, 0.5)_1px, transparent_1px), linear-gradient(to_bottom, rgba(255, 255, 255, 0.5)_1px, transparent_1px)] bg-size-[50px_50px] animate-grid-drift pointer-events-none" />
            <div className = "absolute inset-0 z-0 bg-linear-to-b from-transparent via-transparent to-[#070b18] pointer-events-none" />

            {/* Secondary gold shimmer bottom-right */}
            <div className = "relative animate-card-in w-full max-w-110 rounded-[28px] border border-red-500/10 bg-[#0a0a0a]/82 backdrop-blur-2xl p-10 shadow-[0_24px_80px_rgba(0, 0, 0, 0.55), 0_0_0_1px_rgba(255, 255, 255, 0.03)_inset]">
                {/* ── Admin badge strip ── */}
                <div className = "flex items-center justify-center gap-2 mb-7">
                    <span className = "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/12 border border-red-500/28 text-[0.65rem] font-extrabold tracking-[0.14em] text-red-500 uppercase">
                        <span className = "h-1.5 w-1.5 rounded-full bg-red-500 animate-blink inline-block"/>
                        
                        ADMIN CONTROL PANEL
                    </span>
                </div>

                {/* ── Logo + Title ── */}
                <div className = "text-center mb-8">
                    <h1 className = "text-[1.85rem] font-black mb-1.5 bg-linear-to-br from-white via-red-400 to-[#e8c07d] bg-clip-text text-transparent leading-tight">
                        BID2BUILD
                    </h1>

                    <p className = "text-[0.75rem] font-bold tracking-[0.2em] text-slate-500 uppercase">
                        Administrator Access
                    </p>
                </div>

                {/* ── Form ── */}
                <div
                    className={`
                        flex flex-col gap-3.5
                        ${error ?
                            'animate-error-shake'
                            : ''
                        }
                    `}
                    onKeyDown = {handleKeyDown}
                >
                    {/* Admin ID */}
                    <div>
                        <label className = "block text-[0.7rem] font-bold tracking-widest text-slate-400 uppercase mb-2">
                            Admin ID
                        </label>
                        
                        <input
                            type = 'text'
                            placeholder = "e.g. ADMIN-001"
                            className = "w-full px-4 py-3.5 rounded-xl bg-white/4 border border-white/9 text-slate-100 text-[0.95rem] outline-none focus:border-red-500/55 focus:ring-3 focus:ring-red-500/10 focus:bg-red-500/3 transition-all disabled:opacity-50"
                            value = {adminId}
                            onChange = {e => {
                                setAdminId(e.target.value);
                                setError('')
                            }}
                            disabled = {loading}
                            autoComplete = 'username'
                            spellCheck = {false}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className = "block text-[0.7rem] font-bold tracking-widest text-slate-400 uppercase mb-2">
                            Password
                        </label>

                        <div className = 'relative'>
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder = "Enter admin password"
                                className = "w-full pl-4 pr-11 py-3.5 rounded-xl bg-white/4 border border-white/9 text-slate-100 text-[0.95rem] outline-none focus:border-red-500/55 focus:ring-3 focus:ring-red-500/10 focus:bg-red-500/3 transition-all disabled:opacity/50"
                                value = {password}
                                onChange = {e => {
                                    setPassword(e.target.value)
                                    setError('')
                                }}
                                disabled = {loading}
                                autoComplete = "current-password"
                            />

                            <button
                                type = "button"
                                className = "absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-slate-500 hover:text-slate-300 cursor-pointer text-base p-1 transition-colors"
                                onClick = {() => setShowPass(p => !p)}
                                tabIndex = {-1}
                            >
                                {showPass ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className = "flex items-center gap-2.5 mt-0.5">
                        <input
                            type = 'checkbox'
                            className = "w-4 accent-red-500 cursor-pointer shrink-0"
                            checked = {rememberMe}
                            onChange = {e => setRememberMe(e.target.checked)}
                            disabled = {loading}
                            id = 'remember'
                        />

                        <label
                            htmlFor = 'remember'
                            className = "text-[0.82rem] text-slate-400 cursor-pointer select-none font-semibold"
                        >
                            Remember my Admin ID on this device
                        </label>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className = "flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/9 border border-red-500/25">
                            <p className = "m-0 text-[0.8rem] text-red-400 font-semibold leading-relaxed">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Login button */}
                    <button
                        className = "w-full mt-1.5 py-3.5 rounded-xl border-none bg-linear-to-br from-red-500 to-[#e8c07d] text-black text-[0.95rem] font-black tracking-[0.08em] cursor-pointer flex items-center justify-center gap-2.5 hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(239, 68, 68, 0.45)] hover:brightness-108 active:scale-98 transition-all disabled:opacity-70"
                        onClick = {handleLogin}
                        disabled = {loading}
                    >
                    {loading ? (
                        <>
                            <span className = "h-4 w-4 border-2 border-black/25 border-t-black rounded-full animate-spin-slow inline-block" />
                            
                            Authenticating...
                        </>
                    ) : (
                        "🔐 ACCESS CONTROL PANEL"
                    )}
                    </button>
                </div>

                {/* ── Divider ── */}
                <div
                    className = "flex items-center gap-3 text-slate-800 text-[0.72rem] font-bold tracking-widest my-7 before:content-[''] before:flex-1 before:h-px before:bg-white/6 after:content-[''] after:flex-1 after:h-px after:bg-white/6"
                >
                    SECURITY NOTICE
                </div>

                {/* ── Footer note ── */}
                <p className = "m-0 text-center text-[0.72rem] text-slate-700 leading-relaxed tracking-[0.02em]">
                    This portal is restricted to authorised BID2BUILD administrators only. Unauthorized access attempts are logged and monitored.
                </p>

                {/* ── Student login link ── */}
                <div className = "text-center mt-5">
                    <Link
                        href = '/login'
                        className = "text-[0.78rem] text-slate-600 hover:text-[#e8c07d] no-underline font-semibold transition-colors"
                    >
                        Team / Student login →
                    </Link>
                </div>
            </div>
        </main>

    )
    
}
