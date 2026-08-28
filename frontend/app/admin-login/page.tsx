// admin-login/page.tsx


"use client"


import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

import {ShieldAlert} from 'lucide-react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

import {hubApi} from '../services/api'


export default function AdminLoginPage() {

    const router = useRouter()

    const [adminId, setAdminId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        if (localStorage.getItem('adminId') && localStorage.getItem('token')) {
            router.replace('/admin/dashboard')
        }
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

    if (!mounted) {

        return <div className = "min-h-screen bg-background" />

    }

    return (

        <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative">
            <Link
                href = '/'
                className = "absolute top-8 left-8 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
            >
                ← Back
            </Link>

            <div className = "absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <div className = "size-125 rounded-full bg-destructive/10 blur-[100px]" />
            </div>

            <Card className = "w-full max-w-md bg-card/60 backdrop-blur-xl border-destructive/20 shadow-[0_0_80px_rgba(239, 68, 68, 0.1)] animate-fade-up">
                <CardHeader className = "text-center pb-8 pt-8">
                    <div className = "mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-destructive">
                        <ShieldAlert className = "h-3 w-3" />
                        
                        ADMIN CONTROL PANEL
                    </div>

                    <CardTitle className = "text-3xl font-black tracking-tight text-foreground">
                        Bid2Build
                    </CardTitle>
                    
                    <CardDescription className = "text-muted-foreground mt-2">
                        Administrator Access Only
                    </CardDescription>
                </CardHeader>

                <CardContent className = "space-y-6 pb-8">
                    <div className = 'space-y-4'>
                        <div className = 'space-y-2'>
                            <label className = "text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">
                                Admin ID
                            </label>

                            <Input
                                type = 'text'
                                placeholder = "e.g. ADMIN-001"
                                value = {adminId}
                                onChange = {(e) => {
                                    setAdminId(e.target.value)
                                    setError('')
                                }}
                                className = "h-12 bg-background border-border font-mono uppercase focus-visible:ring-destructive/50"
                            />
                        </div>

                        <div className = 'space-y-2'>
                            <label className = "text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">
                                Password
                            </label>
                            
                            <Input
                                type = 'password'
                                placeholder = "Enter admin password"
                                value = {password}
                                onChange = {(e) => {
                                    setPassword(e.target.value)
                                    setError('')
                                }}
                                className = "h-12 bg-background border-border font-mono focus-visible:ring-destructive/50"
                                onKeyDown = {(e) => {
                                    if (e.key === 'Enter') handleLogin()
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className = "p-3 text-xs font-mono bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick = {handleLogin}
                        disabled = {loading}
                        variant = 'destructive'
                        className = "w-full h-12 font-bold uppercase tracking-widest mt-2"
                    >
                        {loading ? 'Authenticating...' : "Access Control Panel"}
                    </Button>
                    
                    <div className = "pt-6 mt-6 border-t border-border flex justify-center">
                         <Link
                            href = '/login'
                            className = "text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground no-underline transition-colors"
                        >
                            Team / Student login →
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>

    )
}