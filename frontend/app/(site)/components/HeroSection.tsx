"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SearchBar from "./SearchBar";

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

    return (
        <section
            ref={sectionRef}
            id="home"
            className="relative h-screen min-h-150 flex items-center justify-center overflow-hidden"
        >
            {/* Video background — parallax layer */}
            <motion.div
                className="absolute inset-0 will-change-transform"
                style={{ y: videoY, scale: videoScale }}
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

            {/* Content — moves faster for depth illusion */}
            <motion.div
                className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center"
                style={{ y: contentY, opacity: contentOpacity }}
            >
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-xs sm:text-sm tracking-widest uppercase text-white/70 mb-5"
                >
                    Sonipat &middot; Haryana
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight max-w-4xl font-heading"
                >
                    An Address That
                    <br />
                    <span className="text-sunshade">Outlives Time</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mt-6 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed"
                >
                    Kronus Infratech builds homes that families grow into, streets that
                    neighbourhoods remember, and landmarks Sonipat takes pride in.
                </motion.p>

                <div className="mt-10 w-full">
                    <SearchBar />
                </div>
            </motion.div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent" aria-hidden="true" />
        </section>
    );
}
