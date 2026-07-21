import Countdown from "@/components/Countdown";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070B18] text-white px-8">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 -z-10">

        <div
          className="
          absolute inset-0
          bg-[radial-gradient(circle_at_70%_40%,rgba(232,192,125,0.14),transparent_45%)]
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
          absolute
          inset-0
          bg-gradient-to-b
          from-transparent
          via-[#070B18]/30
          to-[#070B18]
          "
        />

      </div>



      {/* ================= HEADER ================= */}

      <header
        className="
        absolute
        top-8
        left-10
        right-10
        flex
        justify-between
        items-center
        "
      >

        <Image
          src="/pes-logo.png"
          alt="PES University"
          width={100}
          height={100}
          className="opacity-85"
        />

        <Image
          src="/tams-logo.png"
          alt="TAMS"
          width={100}
          height={100}
          className="opacity-85"
        />

      </header>



      {/* ================= HERO ================= */}

      <section
        className="
        min-h-screen
        flex
        items-center
        justify-center
        "
      >

        <div
          className="
          w-full
          max-w-7xl
          grid
          md:grid-cols-[1fr_0.7fr]
          gap-20
          items-center
          "
        >


          {/* LEFT SIDE */}

          <div
            className="
            -translate-x-12
            "
          >

            <div className="flex items-center gap-5">

              <h1
                className="
                font-[family:var(--font-orbitron)]

                text-[4rem]
                md:text-[6.3rem]

                font-black

                leading-[0.9]

                tracking-tight

                bg-gradient-to-r
                from-white
                via-white
                to-[#E8C07D]

                bg-clip-text
                text-transparent
                "
              >
                BID2BUILD
              </h1>


              <Image
                src="/bid2build-logo.png"
                alt="Bid2Build Logo"
                width={95}
                height={95}
                className="shrink-0"
              />

            </div>



            <h2
              className="
              mt-8
              text-3xl
              md:text-4xl
              text-slate-300
              font-medium
              "
            >
              Where Ideas Become Ventures
            </h2>



            <Link
              href="/login"
              className="
              mt-12
              inline-flex

              rounded-full

              bg-gradient-to-r
              from-[#E8C07D]
              to-[#8B5CF6]

              px-10
              py-4

              text-lg
              font-semibold

              text-black

              transition

              hover:-translate-y-1
              hover:shadow-[0_0_40px_rgba(232,192,125,.35)]
              "
            >
              Enter Bid2Build →
            </Link>

            <Link
  href="/admin-login"
  className="
    px-8
    py-4
    rounded-xl
    border
    border-red-500/40
    text-red-400
    font-bold
    hover:bg-red-500
    hover:text-white
    transition
  "
>
    Admin Portal
</Link>


          </div>





          {/* RIGHT SIDE */}

          <div
            className="
            flex
            justify-center
            translate-x-10
            "
          >

            <div
              className="
              rounded-2xl

              border
              border-[#E8C07D]/20

              bg-white/[0.03]

              backdrop-blur-sm

              px-12
              py-9

              "
            >

              <p
                className="
                text-xs
                uppercase
                tracking-[0.35em]
                text-[#E8C07D]/80
                mb-6
                text-center
                "
              >
                EVENT BEGINS IN
              </p>


              <Countdown />


            </div>


          </div>


        </div>


      </section>





      {/* ================= FOOTER ================= */}

      <footer
        className="
        absolute
        bottom-8
        left-0
        right-0
        text-center
        "
      >

        <p
          className="
          text-sm
          tracking-[0.3em]
          text-slate-400
          "
        >
          TAMS 2026
        </p>


        <p
          className="
          mt-2
          text-slate-500
          "
        >
          PES University
        </p>


      </footer>


    </main>
  );
}