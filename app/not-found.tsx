"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Floating particle component
interface ParticleProps {
  delay: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

const Particle = ({ delay, x, y, size, duration }: ParticleProps) => (
  <motion.div
    animate={{
      y: [0, -30, 0],
      opacity: [0.2, 0.8, 0.2],
      scale: [0.8, 1.2, 0.8],
    }}
    className="absolute rounded-full bg-brand/20"
    initial={{ opacity: 0 }}
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

// Animated glitch text
const GlitchText = ({ children }: { children: string }) => (
  <div className="relative">
    <motion.h1
      animate={{ opacity: 1, scale: 1 }}
      className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-brand/10 select-none"
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.h1>

    {/* Glitch layers */}
    <motion.h1
      animate={{
        x: [0, -3, 3, -1, 0],
        opacity: [0, 0.7, 0, 0.5, 0],
      }}
      className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-brand/30 select-none"
      transition={{
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.h1>

    <motion.h1
      animate={{
        x: [0, 3, -3, 1, 0],
        opacity: [0, 0.5, 0, 0.3, 0],
      }}
      className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-cyan-500/20 select-none"
      transition={{
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 3.1,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.h1>
  </div>
);

// Animated line decoration
const AnimatedLine = ({
  delay = 0,
  width,
}: {
  delay?: number;
  width: string;
}) => (
  <motion.div
    animate={{ scaleX: 1, opacity: 1 }}
    className="h-[2px] bg-gradient-to-r from-transparent via-brand/40 to-transparent rounded-full"
    initial={{ scaleX: 0, opacity: 0 }}
    style={{ width }}
    transition={{ duration: 1.2, delay, ease: "easeOut" }}
  />
);

export default function NotFound() {
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      delay: number;
      size: number;
      duration: number;
    }[]
  >([]);

  useEffect(() => {
    // Generate random particles on client only to avoid hydration mismatch
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 3 + 3,
    }));

    setParticles(generated);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white">
      {/* Gradient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 20, 0],
          }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/5 blur-3xl"
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -20, 0],
          }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl"
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/3 blur-3xl"
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p) => (
          <Particle
            key={p.id}
            delay={p.delay}
            duration={p.duration}
            size={p.size}
            x={p.x}
            y={p.y}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,130,121,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,130,121,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* 404 number */}
        <GlitchText>404</GlitchText>

        {/* Decorative lines */}
        <div className="flex flex-col items-center gap-2 -mt-6 mb-8">
          <AnimatedLine delay={0.5} width="200px" />
          <AnimatedLine delay={0.7} width="140px" />
        </div>

        {/* Message */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Halaman Tidak Ditemukan
          </h2>
          <p className="max-w-md text-base text-gray-500 md:text-lg">
            Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
          </p>
        </motion.div>

        {/* Animated compass icon */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="my-10"
          initial={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            type: "spring",
            stiffness: 200,
          }}
        >
          <motion.svg
            animate={{ rotate: [0, 10, -10, 5, 0] }}
            className="h-16 w-16 text-brand/40"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon
              fill="currentColor"
              opacity={0.2}
              points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
            />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </motion.svg>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-brand px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand/30 hover:-translate-y-0.5"
            href="/"
          >
            {/* Button shine effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          animate={{ opacity: 1 }}
          className="mt-12 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Error Code: 404 &middot; Veritrust Academy
        </motion.p>
      </div>
    </div>
  );
}
