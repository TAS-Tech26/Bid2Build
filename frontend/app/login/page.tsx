"use client";

import api from "../services/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [team_code, setteamcode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!team_code.trim()) {
      setError("Please enter team code/pin");
      return;
    }

    setError("");

    try{
      localStorage.clear();
      const response=await api.post("api/login/",{
        team_code:team_code
      });

      console.log(
      "login successful",
      response.data
    );

      localStorage.setItem(
      "access",
      response.data.access
      );

      localStorage.setItem(
          "refresh",
          response.data.refresh
      );

      localStorage.setItem('team', JSON.stringify(response.data.team));
      router.push("/stu_dashboard");
    }
    catch (error: any) {

      console.log("LOGIN FAILED:", error);

      if (error.response) {

          console.log(
              "STATUS:",
              error.response.status
          );

          console.log(
              "DATA:",
              error.response.data
          );

          if (error.response.status === 401) {

              setError(
                  "Invalid team code/pin"
              );

          } else {

              setError(
                  "Server error. Please try again."
              );
          }

      } else if (error.request) {

          console.log(
              "No response received from Django:",
              error.request
          );

          setError(
              "Could not connect to the backend server."
          );

      } else {

          console.log(
              "Request error:",
              error.message
          );

          setError(
              "An unexpected error occurred."
          );
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070B18] text-white flex items-center justify-center px-6">


      {/* BACK BUTTON */}

      <Link
        href="/"
        className="
        absolute
        top-8
        left-10

        text-sm
        text-slate-400

        hover:text-[#E8C07D]

        transition
        "
      >
         Back to Homepage
      </Link>



      {/* BACKGROUND */}

      <div className="absolute inset-0 -z-10">

        <div
          className="
          absolute inset-0
          bg-[radial-gradient(circle_at_50%_35%,rgba(232,192,125,0.12),transparent_45%)]
          "
        />


        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
          }}
        />


        <div
          className="
          absolute inset-0
          bg-gradient-to-b
          from-transparent
          via-[#070B18]/20
          to-[#070B18]
          "
        />

      </div>




      {/* LOGIN CARD */}

      <div
        className="
        w-full
        max-w-md

        rounded-3xl

        border
        border-white/10

        bg-white/[0.04]

        backdrop-blur-xl

        p-10

        shadow-[0_20px_80px_rgba(0,0,0,0.4)]
        "
      >


        <h1
          className="
          text-3xl
          font-bold
          text-center

          bg-gradient-to-r
          from-white
          to-[#E8C07D]

          bg-clip-text
          text-transparent

          mb-8
          "
        >
          Welcome To
          <br/>
          Bid2Build
        </h1>



        <div className="space-y-5">


          <input
            type="text"
            placeholder="Enter 4 character team code/pin"
            value={team_code}
            onChange={(e)=>setteamcode(e.target.value)}
            className="
            w-full
            p-4

            rounded-xl

            bg-white/[0.05]

            border
            border-white/10

            text-white

            outline-none

            focus:border-[#E8C07D]/60
            "
          />



         {/* <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="
            w-full
            p-4

            rounded-xl

            bg-white/[0.05]

            border
            border-white/10

            text-white

            outline-none

            focus:border-[#E8C07D]/60
            "
          />*/}



          {
            error &&
            <p className="text-red-400 text-sm">
              {error}
            </p>
          }



          <button
            onClick={handleLogin}
            className="
            w-full

            mt-4

            rounded-xl

            bg-gradient-to-r
            from-[#E8C07D]
            to-[#8B5CF6]

            p-4

            font-bold

            text-black

            transition-all

            hover:-translate-y-1

            hover:shadow-[0_0_40px_rgba(232,192,125,.35)]
            "
          >
            Enter Bid2Build
          </button>


        </div>


      </div>


    </main>
  );
}