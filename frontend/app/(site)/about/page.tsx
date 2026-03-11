"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Shield,
    Hammer,
    Compass,
    Users,
    TreePine,
    Award,
    Quote,
    Phone
} from "lucide-react";
import { AiOutlineWhatsApp } from "react-icons/ai";

const MILESTONES = [
    { year: "2014", title: "The First Foundation", text: "Kronus Infratech was born from a single residential project in Sonipat — 24 apartments, delivered ahead of schedule." },
    { year: "2016", title: "Word Spread Across the City", text: "Without a single hoarding, referrals brought us three new projects. Families trusted us because their neighbours did." },
    { year: "2018", title: "Commercial Horizons", text: "Our first commercial complex on GT Road opened doors for Sonipat's growing business community." },
    { year: "2020", title: "Township Vision", text: "Launched our flagship gated township — 20 acres, 300+ families, parks, a temple, and a school within walking distance." },
    { year: "2023", title: "RERA & Beyond", text: "100% RERA-compliant portfolio. Introduced earthquake-resistant RCC frameworks across every active project." },
    { year: "2025", title: "Legacy Continues", text: "Crossed 500 families served. Broke ground on Kronus Heights — Sonipat's first luxury high-rise." },
];

const VALUES = [
    { Icon: Shield, title: "Integrity First", text: "Transparent pricing, RERA compliance, and zero hidden costs. Every rupee you invest is accounted for." },
    { Icon: Hammer, title: "Engineering Over Shortcuts", text: "ISI-certified materials, earthquake-resistant structures, and 40+ quality checkpoints per floor." },
    { Icon: Compass, title: "Vastu-Aligned Design", text: "Every layout respects Vastu Shastra — not as an afterthought, but as the starting point of our blueprints." },
    { Icon: TreePine, title: "Green by Default", text: "Rainwater harvesting, solar-ready rooftops, and 30% green cover mandated across every Kronus township." },
    { Icon: Users, title: "Community Driven", text: "We build neighbourhoods, not just buildings. Common spaces for morning walks, festivals, and weekend cricket." },
    { Icon: Award, title: "After-Sale Accountability", text: "Dedicated maintenance teams for 2 years post-possession. We stay long after the keys are handed over." },
];

const TEAM = [
    { name: "Anuraj Antil", role: "Founder & Managing Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", bio: "25 years in Haryana's real estate. Started Kronus with a conviction that Sonipat deserves homes of metropolitan quality." },
    { name: "Siddharth Chahal", role: "Head of Architecture", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", bio: "IIT Delhi alumnus. Designs every Kronus project to balance modern aesthetics with the cultural fabric of the city." },
    { name: "Sukhdeep Singh", role: "Chief Engineer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", bio: "Former L&T structural engineer. Obsessed with earthquake-resistant frameworks and zero-defect delivery." },
    { name: "Yuvraj Tomar", role: "Customer Relations", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", bio: "The voice families hear first — and the person who follows up years after possession to ask if everything's still perfect." },
];

const TESTIMONIALS = [
    { quote: "We visited twelve builders in Sonipat. The moment we saw the construction quality at Kronus, there was no going back. Three years in and the walls still look freshly painted.", author: "Deepak & Meena Gupta", detail: "Residents since 2021, Kronus Residency" },
    { quote: "Amit ji personally walked me through the structural drawings and explained why the pillars were placed the way they were. That kind of transparency sold me more than any brochure.", author: "Dr. Rakesh Yadav", detail: "Villa owner, Kronus Greens" },
    { quote: "My parents were sceptical about moving from Delhi. Six months later, my father refuses to visit us in the city — he says the air and community at Kronus Township are irreplaceable.", author: "Neha Malhotra", detail: "3 BHK, Kronus Heights" },
];

function HeroBanner() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section ref={ref} className="relative h-[70vh] min-h-80 flex items-center justify-center overflow-hidden">
            <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY }}>
                <img
                    // src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"
                    src="/about-hero.png"
                    alt="Kronus Infratech luxury residence showcasing modern architecture"
                    className="w-full h-[120%] object-cover"
                />
            </motion.div>
            <div className="absolute inset-0 bg-black/55" />
            <motion.div className="relative z-10 text-center px-6" style={{ opacity }}>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-xs sm:text-sm tracking-widest uppercase text-white/60 mb-4"
                >
                    Our Story
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight font-heading"
                >
                    Built on Trust,<br />
                    <span className="text-sunshade">Measured in Generations</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mt-5 text-base sm:text-lg text-white/60 max-w-lg mx-auto leading-relaxed"
                >
                    From a single plot in 2014 to Sonipat&apos;s most referred builder — here&apos;s why 500+ families chose Kronus to call home.
                </motion.p>
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-white to-transparent" />
        </section>
    );
}

function StorySection() {
    return (
        <section aria-label="Company origins" className="py-20 px-10">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-3 font-medium">Who We Are</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray mb-6 leading-snug font-heading">
                        A Builder Sonipat Grew Up With
                    </h2>
                    <div className="space-y-4 text-dark-gray/70 leading-relaxed">
                        <p>
                            Kronus Infratech started the way most honest things do — small, stubborn, and with something to prove.
                            In 2014, when Sonipat&apos;s skyline was still dominated by unplanned colonies, we delivered our first
                            24-apartment project with a radical idea: build it as if your own family would live there.
                        </p>
                        <p>
                            Twelve years later, that idea hasn&apos;t changed. What has changed is the scale — 500+ families,
                            20 lakh sq. ft. developed, and a reputation that travels by word of mouth, not billboards.
                            We don&apos;t chase awards. We chase the moment a family walks into their new home, runs
                            a hand across the wall, and smiles.
                        </p>
                        <p>
                            Every project we take on is guided by three non-negotiables: structural integrity that
                            exceeds IS standards, transparent pricing with zero hidden costs, and delivery dates
                            that are promises — not projections.
                        </p>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative"
                >
                    <div className="rounded-lg overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                            alt="Aerial view of a Kronus Infratech residential township in Sonipat"
                            className="w-full h-auto object-cover"
                            loading="lazy"
                        />
                    </div>
                    <div className="absolute -bottom-5 -left-4 sm:left-6 bg-white rounded-lg shadow-lg p-5 max-w-52">
                        <p className="text-2xl font-bold text-teal font-heading">500+</p>
                        <p className="text-xs text-dark-gray/70 mt-1 leading-snug">families who chose to grow with us</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function TimelineSection() {
    return (
        <section aria-label="Company milestones" className="py-20 px-10 bg-warm-bg">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Milestones</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        Twelve Years. One Promise.
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-teal/15 -translate-x-1/2" aria-hidden="true" />

                    <div className="flex flex-col gap-12">
                        {MILESTONES.map((m, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <motion.div
                                    key={m.year}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: i * 0.06 }}
                                    className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                                >
                                    {/* Content */}
                                    <div className={`flex-1 pl-14 md:pl-0 ${isLeft ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                                        <span className="inline-block text-xs font-bold text-teal bg-teal/10 rounded-lg px-2.5 py-1 mb-2">{m.year}</span>
                                        <h3 className="text-lg font-semibold text-dark-gray mb-1 font-heading">{m.title}</h3>
                                        <p className="text-sm text-dark-gray/60 leading-relaxed">{m.text}</p>
                                    </div>

                                    {/* Dot */}
                                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal ring-4 ring-white" />

                                    {/* Spacer for the other side */}
                                    <div className="hidden md:block flex-1" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ValuesSection() {
    return (
        <section aria-label="Core values" className="py-20 px-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-xl mx-auto mb-16"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">What Drives Us</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        Six Principles. Zero Compromises.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {VALUES.map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.07 }}
                            className="group p-7 rounded-lg border border-dark-gray/6 bg-white hover:border-teal/25 hover:shadow-md transition-all duration-400"
                        >
                            <div className="w-12 h-12 rounded-lg bg-teal/8 flex items-center justify-center text-teal mb-5 group-hover:bg-teal group-hover:text-white transition-colors duration-300">
                                <v.Icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-semibold text-dark-gray mb-2 font-heading">{v.title}</h3>
                            <p className="text-sm text-dark-gray/60 leading-relaxed">{v.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TeamSection() {
    return (
        <section aria-label="Leadership team" className="py-20 px-10 bg-warm-bg">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-xl mb-14"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">People Behind the Projects</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        Faces You&apos;ll See on Site, Not Just in Brochures
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TEAM.map((member, i) => (
                        <motion.article
                            key={member.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            className="group rounded-lg overflow-hidden bg-white border border-dark-gray/6"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={member.image}
                                    alt={`${member.name}, ${member.role} at Kronus Infratech`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="text-base font-semibold text-dark-gray font-heading">{member.name}</h3>
                                <p className="text-xs text-teal font-medium mt-0.5 mb-3">{member.role}</p>
                                <p className="text-xs text-dark-gray/60 leading-relaxed">{member.bio}</p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection() {
    return (
        <section aria-label="Client testimonials" className="py-20 px-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-xl mx-auto mb-16"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Straight from Families</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        Stories We Didn&apos;t Write — They Did
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.blockquote
                            key={t.author}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative p-7 rounded-lg border border-dark-gray/6 bg-warm-bg"
                        >
                            <Quote className="w-8 h-8 text-teal/15 mb-4" aria-hidden="true" />
                            <p className="text-sm text-dark-gray/80 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                            <footer>
                                <p className="text-sm font-semibold text-dark-gray font-heading">{t.author}</p>
                                <p className="text-xs text-spanish-gray mt-0.5">{t.detail}</p>
                            </footer>
                        </motion.blockquote>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CtaSection() {
    return (
        <section aria-label="Call to action" className="py-20 px-10 bg-dark-gray">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-heading">
                        Your Dream Home Won&apos;t Find Itself
                    </h2>
                    <p className="text-white/50 max-w-xl mx-auto leading-relaxed mb-8">
                        Skip the guesswork. Book a free site visit and walk through the neighbourhood,
                        meet the engineers, and see why 500+ families trusted Kronus.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="tel:+919876543210"
                            className="inline-flex items-center gap-2 rounded-lg bg-teal px-7 py-3.5 text-sm font-medium text-white hover:bg-teal/80 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Schedule a Visit
                        </Link>
                        <Link
                            href="https://wa.me/919876543210?text=Hi%20Kronus%2C%20I%27m%20interested%20in%20a%20property"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-7 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-teal hover:border-teal transition-all"
                        >
                            <AiOutlineWhatsApp className="w-5 h-5" />
                            WhatsApp Us
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default function AboutPage() {
    return (
        <main>
            <HeroBanner />
            <StorySection />
            <TimelineSection />
            <ValuesSection />
            <TeamSection />
            <TestimonialsSection />
            <CtaSection />
        </main>
    );
}
