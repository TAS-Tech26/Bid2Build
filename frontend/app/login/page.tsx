"use client";

import { useState } from "react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    if(!teamName.trim() || !password.trim()) {
      setError("Please enter both team name and password.");
      return;
    }
    
    setError("");

    console.log({
      teamName,
      password,
    },
    "login successful"
  );

    router.push("/stu_dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-md mx-4 shadow-xl">
        <h1 className="text-3xl text-cyan-400 font-bold mb-6 text-center">
          WELCOME TO 
          BID2BUILD
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 text-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-cyan-500 hover:bg-cyan-600 p-3 rounded-lg font-semibold"
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
}