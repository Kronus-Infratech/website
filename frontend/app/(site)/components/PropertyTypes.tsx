"use client";

import { useRef } from "react";
import {
    motion,
    useMotionValue,
    useTransform,
    useMotionTemplate,
} from "framer-motion";
import { Building, Home, TreePine, Landmark, Crown, ArrowRight } from "lucide-react";

interface CategoryCard {
    Icon: React.ComponentType<{ className?: string }>;
    label: string;
    tagline: string;
    count: number;
    image: string;
    span: string;
}

const TYPES: CategoryCard[] = [
    {
        Icon: Home,
        label: "Apartments",
        tagline: "Where families begin new chapters",
        count: 12,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        span: "md:col-span-2 md:row-span-2",
    },
    {
        Icon: Building,
        label: "Commercial",
        tagline: "Spaces that power ambitions",
        count: 5,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
        span: "",
    },
    {
        Icon: Crown,
        label: "Villas",
        tagline: "Privacy wrapped in grandeur",
        count: 8,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
        span: "",
    },
    {
        Icon: TreePine,
        label: "Plots",
        tagline: "Your ground, your legacy",
        count: 15,
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
        span: "",
    },
    {
        Icon: Landmark,
        label: "Penthouses",
        tagline: "Sky-high living above the ordinary",
        count: 3,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
        span: "md:col-span-2",
    },
];

/* ── 3D Tilt card with mouse-tracking spotlight ── */
function TiltCard({ data, index }: { data: CategoryCard; index: number }) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);

    const rotateX = useTransform(my, [0, 1], [8, -8]);
    const rotateY = useTransform(mx, [0, 1], [-8, 8]);
    const spotX = useTransform(mx, [0, 1], [0, 100]);
    const spotY = useTransform(my, [0, 1], [0, 100]);
    const spotlight = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`;

    function onMove(e: React.MouseEvent) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
    }

    function onLeave() {
        mx.set(0.5);
        my.set(0.5);
    }

    const { Icon } = data;

    return (
        <motion.a
            ref={cardRef}
            href="#"
            title={`Browse ${data.label} properties`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            className={`group relative overflow-hidden rounded-lg cursor-pointer ${data.span}`}
        >
            <img
                src={data.image}
                alt={`${data.label} properties by Kronus Infratech in Sonipat`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 group-hover:via-black/40 transition-all duration-500" />
            {/* Mouse spotlight */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: spotlight }}
            />
            {/* Content pinned to bottom */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/10">
                        <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-xs text-white/50 font-medium">{data.count} listings</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 font-heading">{data.label}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{data.tagline}</p>
                <span className="mt-3 flex items-center gap-1.5 text-teal text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Explore <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </motion.a>
    );
}

/* ── Section ── */
export default function PropertyTypes() {
    return (
        <section aria-label="Property categories" className="py-20 px-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-xl mb-14"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Explore by Type</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        Every Kind of Space, One Trusted Name
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
                    {TYPES.map((t, i) => (
                        <TiltCard key={t.label} data={t} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
