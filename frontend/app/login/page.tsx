"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { hubApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const [roomCode, setRoomCode] = useState('');
    const [teamCode, setTeamCode] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        if (!roomCode.trim() || !teamCode.trim()) {
            setError("Please enter both Room Code & Team PIN.");
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await hubApi.post('client/login/', {room_code : roomCode, team_code : teamCode});
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('team_name', response.data.team_name);
            localStorage.setItem('event_name', response.data.event_name);
            router.push('/stu_dashboard');
        } catch (error: any) {
            console.log("LOGIN FAILED:", error);
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    setError(error.response.data.error || "Invalid Room Code or Team PIN");
                } else {
                    setError("Server error. Please try again.");
                }
            } else if (error.request) {
                setError("Could not connect to the authentication server.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative">
            <Link
                href="/"
                className="absolute top-8 left-8 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
            >
                ← Back
            </Link>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <div className="size-[500px] rounded-full bg-primary/10 blur-[100px]" />
            </div>

            <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-border shadow-2xl animate-fade-up">
                <CardHeader className="text-center pb-8 pt-8">
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="text-primary animate-pulse">●</span> PARTICIPANT LOGIN
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight">Bid2Build</CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                        Enter your credentials to access the console.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Room Code</label>
                            <Input
                                type="text"
                                placeholder="Enter Room Code"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                className="h-12 bg-background border-border font-mono uppercase"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Team PIN</label>
                            <Input
                                type="password"
                                placeholder="Enter Team PIN"
                                value={teamCode}
                                onChange={(e) => setTeamCode(e.target.value)}
                                className="h-12 bg-background border-border font-mono"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleLogin();
                                  }
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 text-xs font-mono bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full h-12 font-bold uppercase tracking-widest mt-2"
                    >
                        {loading ? "Authenticating..." : "Enter Console"}
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}