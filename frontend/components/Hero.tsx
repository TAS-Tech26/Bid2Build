"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Countdown from "./Countdown";

export default function Hero() {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Title */}
      <motion.div
        className="flex items-center justify-center gap-5"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1
          className="
          text-[5rem]
          md:text-[8rem]
          font-black
          tracking-[-0.04em]
          leading-none
          bg-gradient-to-r
          from-white
          via-cyan-200
          to-fuchsia-200
          bg-clip-text
          text-transparent
          "
        >
          BID2BUILD
        </h1>

        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.08,
          }}
        >
          <Image
            src="/bid2build-logo.png"
            alt="logo"
            width={82}
            height={82}
            className="drop-shadow-[0_0_30px_rgba(34,211,238,.4)]"
          />
        </motion.div>
      </motion.div>

      <motion.h2
        className="mt-6 text-3xl md:text-4xl font-semibold text-slate-300"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        Where Ideas Become Ventures
      </motion.h2>

      <motion.div
        className="mt-16"
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        <p className="uppercase tracking-[0.35em] text-sm text-slate-400">
          EVENT BEGINS IN
        </p>

        <Countdown />
      </motion.div>

      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          href="/login"
          className="
          mt-14
          inline-flex
          items-center
          rounded-full

          bg-gradient-to-r
          from-fuchsia-600
          via-violet-600
          to-cyan-500

          px-10
          py-4

          text-lg
          font-semibold

          transition-all
          duration-300

          hover:scale-105
          hover:shadow-[0_0_45px_rgba(168,85,247,.45)]
          "
        >
          Enter Competition →
        </Link>
      </motion.div>

      <motion.div
        className="mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-slate-400 font-medium">TAMS 2026</p>
        <p className="text-slate-600">PES University</p>
      </motion.div>
    </motion.div>
  );
}