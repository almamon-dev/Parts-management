import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    ChevronRight,
    Star,
    Users,
    Award,
    Clock,
    Code2,
    Cpu,
} from "lucide-react";

export default function HeroSection() {
    const [count, setCount] = useState({ enrolled: 0, rating: 4.9 });

    // Count animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setCount((prev) => ({ ...prev, enrolled: 1247 }));
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0c] text-white">
            {/* 1. Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            {/* 2. Floating Tech Elements (Senior Dev Aesthetic) */}
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-1/4 left-10 hidden xl:block p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
            >
                <Code2 className="w-8 h-8 text-cyan-400" />
                <div className="mt-2 h-1.5 w-12 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: -50 }}
                        animate={{ x: 50 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="h-full w-1/2 bg-cyan-400"
                    />
                </div>
            </motion.div>

            <div className="container relative z-10 mx-auto px-6 py-20 text-center">
                {/* Badge */}
                <motion.div
                    {...fadeInUp}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-10"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-6 h-6 rounded-full border-2 border-[#0a0a0c] bg-gradient-to-tr from-indigo-500 to-purple-500"
                            />
                        ))}
                    </div>
                    <span className="text-xs font-medium text-indigo-200">
                        Join{" "}
                        <span className="text-white font-bold">
                            {count.enrolled}+
                        </span>{" "}
                        elite developers
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
                >
                    <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        BUILD THE
                    </span>
                    <br />
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                        FUTURE WEB
                    </span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    {...fadeInUp}
                    transition={{ delay: 0.2 }}
                    className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                >
                    A comprehensive journey through{" "}
                    <span className="text-white">Fullstack Engineering</span>.
                    Master the stack used by world-class teams at Vercel,
                    Stripe, and Airbnb.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    {...fadeInUp}
                    transition={{ delay: 0.3 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95">
                        Start Learning Now
                        <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity" />
                    </button>

                    <button className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                        </div>
                        <span className="font-semibold text-gray-300">
                            View Curriculum
                        </span>
                    </button>
                </motion.div>

                {/* Tech Stack Bar */}
                <motion.div
                    {...fadeInUp}
                    transition={{ delay: 0.5 }}
                    className="mt-24 pt-10 border-t border-white/5"
                >
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-8">
                        Powered by modern architecture
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                        {[
                            "Next.js",
                            "TypeScript",
                            "PostgreSQL",
                            "Docker",
                            "GraphQL",
                        ].map((tech) => (
                            <span
                                key={tech}
                                className="text-xl font-bold tracking-tighter text-white"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-400 to-transparent" />
            </motion.div>
        </section>
    );
}
