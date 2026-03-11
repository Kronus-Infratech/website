"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface StatItem {
    value: number;
    suffix: string;
    label: string;
}

const STATS: StatItem[] = [
    { value: 150, suffix: "+", label: "Homes Delivered to Families Across Sonipat" },
    { value: 12, suffix: " Yrs", label: "Of Rooted Presence in Haryana's Real Estate" },
    { value: 20, suffix: " Lac+", label: "Sq. Ft. Developed with Precision Engineering" },
    { value: 500, suffix: "+", label: "Families Who Chose Kronus for Their Future" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let cur = 0;
        const steps = 50;
        const inc = target / steps;
        const timer = setInterval(() => {
            cur += inc;
            if (cur >= target) { cur = target; clearInterval(timer); }
            setCount(Math.floor(cur));
        }, 30);
        return () => clearInterval(timer);
    }, [inView, target]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection() {
    return (
        <section aria-label="Company statistics" className="py-20 px-10 bg-warm-bg">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6"
                >
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            className="text-center lg:text-left"
                        >
                            <p className="text-3xl sm:text-4xl font-bold text-teal mb-2 font-heading">
                                <Counter target={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-sm text-dark-gray/70 leading-snug">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
