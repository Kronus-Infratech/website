"use client";

import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useMotionTemplate,
    AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import {
    MapPin,
    Bed,
    Bath,
    Maximize,
    ArrowRight,
    Search,
    SlidersHorizontal,
    X,
    Building,
    Home,
    TreePine,
    Landmark,
    Crown,
    LayoutGrid,
    List,
    Phone,
    ChevronDown,
} from "lucide-react";
import type { Property } from "@/lib/types";
import { api } from "@/lib/api";
import { AiOutlineWhatsApp } from "react-icons/ai";

const TYPES = ["All", "Residential", "Commercial", "Villa", "Plot", "Penthouse"] as const;
const STATUSES = ["All", "Ready to Move", "Under Construction", "Upcoming"] as const;
const SORT_OPTIONS = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low → High", value: "price-asc" },
    { label: "Price: High → Low", value: "price-desc" },
    { label: "Area: Largest", value: "area-desc" },
] as const;

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    Residential: Home,
    Commercial: Building,
    Villa: Crown,
    Plot: TreePine,
    Penthouse: Landmark,
};

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
                    src="/projects-hero.png"
                    alt="Modern luxury real estate development by Kronus Infratech"
                    className="w-full h-[130%] object-cover"
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
                    Our Portfolio
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight font-heading"
                >
                    Projects That Speak<br />
                    <span className="text-sunshade">For Themselves</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mt-5 text-base sm:text-lg text-white/60 max-w-lg mx-auto leading-relaxed"
                >
                    From ready-to-move homes to visionary townships — browse every Kronus project and find the address that fits your life.
                </motion.p>
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-white to-transparent" />
        </section>
    );
}

function QuickStats({ projects }: { projects: Property[] }) {
    const stats = [
        { value: projects.length, label: "Total Projects" },
        { value: projects.filter((p) => p.status === "Ready to Move").length, label: "Ready to Move" },
        { value: projects.filter((p) => p.status === "Under Construction").length, label: "Under Construction" },
        { value: projects.filter((p) => p.featured).length, label: "Featured" },
    ];

    return (
        <section aria-label="Project statistics" className="py-10 px-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-6"
                >
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="text-center p-5 rounded-lg bg-warm-bg"
                        >
                            <p className="text-2xl sm:text-3xl font-bold text-teal font-heading">{s.value}</p>
                            <p className="text-xs text-dark-gray/60 mt-1">{s.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function PropertyCard({ property, index, layout }: { property: Property; index: number; layout: "grid" | "list" }) {
    const cardRef = useRef<HTMLElement>(null);
    const mx = useMotionValue(50);
    const my = useMotionValue(50);
    const spotlight = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(0,150,136,0.06) 0%, transparent 55%)`;

    function onMove(e: React.MouseEvent) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(((e.clientX - rect.left) / rect.width) * 100);
        my.set(((e.clientY - rect.top) / rect.height) * 100);
    }

    const p = property;

    if (layout === "list") {
        return (
            <motion.article
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onMouseMove={onMove}
                className="group relative rounded-lg overflow-hidden border border-dark-gray/6 bg-white hover:shadow-lg hover:shadow-teal/6 transition-shadow duration-500"
            >
                <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ background: spotlight }} />
                <div className="relative flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-72 h-52 sm:h-auto shrink-0 overflow-hidden">
                        <img
                            src={p.image}
                            alt={`${p.title} — ${p.type} property in ${p.locality}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                        <span className={`absolute top-3 left-3 rounded-lg px-3 py-1 text-[11px] font-medium backdrop-blur-sm ${p.status === "Ready to Move" ? "bg-teal/90 text-white" : p.status === "Under Construction" ? "bg-sunshade/90 text-white" : "bg-white/90 text-dark-gray"}`}>
                            {p.status}
                        </span>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-[11px] uppercase tracking-wider text-teal font-medium mb-1">{p.type}</p>
                            <h3 className="text-xl font-semibold text-dark-gray mb-1 group-hover:text-teal transition-colors font-heading">{p.title}</h3>
                            <p className="flex items-center gap-1 text-xs text-spanish-gray mb-3">
                                <MapPin className="w-3 h-3" /> {p.locality}
                            </p>
                            <p className="text-sm text-dark-gray/60 leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                            {p.bedrooms > 0 && (
                                <div className="flex items-center gap-5 text-xs text-spanish-gray mb-4">
                                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.bedrooms} Bed</span>
                                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.bathrooms} Bath</span>
                                    <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.area}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-dark-gray/6">
                            <p className="text-2xl font-bold text-dark-gray">{p.price}</p>
                            <Link
                                href={`/projects/${p.slug}`}
                                aria-label={`View details of ${p.title}`}
                                className="flex items-center gap-2 text-sm font-medium text-teal hover:underline underline-offset-4"
                            >
                                View Details <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.article>
        );
    }

    return (
        <motion.article
            ref={cardRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            onMouseMove={onMove}
            className="group relative rounded-lg overflow-hidden border border-dark-gray/6 bg-white hover:shadow-lg hover:shadow-teal/6 transition-shadow duration-500"
        >
            <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ background: spotlight }} />
            <div className="relative h-56 overflow-hidden">
                <img
                    src={p.image}
                    alt={`${p.title} — ${p.type} property in ${p.locality}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
                <span className={`absolute top-3 left-3 rounded-lg px-3 py-1 text-[11px] font-medium backdrop-blur-sm ${p.status === "Ready to Move" ? "bg-teal/90 text-white" : p.status === "Under Construction" ? "bg-sunshade/90 text-white" : "bg-white/90 text-dark-gray"}`}>
                    {p.status}
                </span>
                {p.featured && (
                    <span className="absolute top-3 right-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-sunshade text-white">
                        Featured
                    </span>
                )}
            </div>
            <div className="relative p-5">
                <p className="text-[11px] uppercase tracking-wider text-teal font-medium mb-1">{p.type}</p>
                <h3 className="text-lg font-semibold text-dark-gray mb-1.5 group-hover:text-teal transition-colors font-heading">{p.title}</h3>
                <p className="flex items-center gap-1 text-xs text-spanish-gray mb-3">
                    <MapPin className="w-3 h-3" /> {p.locality}
                </p>
                {p.bedrooms > 0 && (
                    <div className="flex items-center gap-4 text-xs text-spanish-gray mb-4">
                        <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.bedrooms} Bed</span>
                        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.bathrooms} Bath</span>
                        <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.area}</span>
                    </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-dark-gray/6">
                    <p className="text-xl font-bold text-dark-gray">{p.price}</p>
                    <Link
                        href={`/projects/${p.slug}`}
                        aria-label={`View details of ${p.title}`}
                        className="w-9 h-9 rounded-lg bg-warm-bg flex items-center justify-center text-teal hover:bg-teal hover:text-white transition-colors"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

function ProjectsGrid({ projects }: { projects: Property[] }) {
    const searchParams = useSearchParams();
    const qType = searchParams.get("type") ?? "";
    const qLocation = searchParams.get("location") ?? "";
    const qBudget = searchParams.get("budget") ?? "";

    const [search, setSearch] = useState(qLocation && qLocation !== "All Locations" ? qLocation : "");
    const [selectedType, setSelectedType] = useState<string>(
        TYPES.includes(qType as (typeof TYPES)[number]) ? qType : "All"
    );
    const [selectedStatus, setSelectedStatus] = useState<string>("All");
    const [sortBy, setSortBy] = useState<string>(
        qBudget?.includes("Low") || qBudget?.includes("Under") ? "price-asc" : qBudget?.includes("High") || qBudget?.includes("Above") ? "price-desc" : "newest"
    );
    const [layout, setLayout] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(!!(qType || qLocation || qBudget));

    const filtered = useMemo(() => {
        let result = [...projects];

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.locality.toLowerCase().includes(q) ||
                    p.type.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            );
        }

        // Type filter
        if (selectedType !== "All") {
            result = result.filter((p) => p.type === selectedType);
        }

        // Status filter
        if (selectedStatus !== "All") {
            result = result.filter((p) => p.status === selectedStatus);
        }

        // Sort
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.priceNumeric - b.priceNumeric);
                break;
            case "price-desc":
                result.sort((a, b) => b.priceNumeric - a.priceNumeric);
                break;
            case "area-desc":
                result.sort((a, b) => b.areaNumeric - a.areaNumeric);
                break;
            default:
                break;
        }

        return result;
    }, [search, selectedType, selectedStatus, sortBy]);

    const activeFilterCount = [selectedType !== "All", selectedStatus !== "All", search.trim() !== ""].filter(Boolean).length;

    function clearFilters() {
        setSearch("");
        setSelectedType("All");
        setSelectedStatus("All");
        setSortBy("newest");
    }

    return (
        <section aria-label="All projects" className="py-14 px-10">
            <div className="max-w-7xl mx-auto">
                {/* ─── Toolbar ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    {/* Top row: search + layout + filter toggle */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-spanish-gray" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, location, or type..."
                                aria-label="Search projects"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray/60 focus:border-teal focus:outline-none transition-colors"
                            />
                            {search && (
                                <button
                                    type="button"
                                    title="Clear search"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-spanish-gray hover:text-dark-gray"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Layout toggle */}
                        <div className="flex items-center rounded-lg border border-dark-gray/10 overflow-hidden shrink-0">
                            <button
                                type="button"
                                title="Grid view"
                                onClick={() => setLayout("grid")}
                                className={`px-3.5 py-3 transition-colors ${layout === "grid" ? "bg-teal text-white" : "bg-white text-spanish-gray hover:text-dark-gray"}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                title="List view"
                                onClick={() => setLayout("list")}
                                className={`px-3.5 py-3 transition-colors ${layout === "list" ? "bg-teal text-white" : "bg-white text-spanish-gray hover:text-dark-gray"}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Filter toggle (mobile + desktop) */}
                        <button
                            type="button"
                            title="Toggle filters"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm font-medium text-dark-gray hover:border-teal/30 transition-colors shrink-0"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-teal text-white text-[10px] font-bold flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter bar (collapsible) */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 p-5 rounded-lg bg-warm-bg border border-dark-gray/6">
                                    {/* Type */}
                                    <div className="flex-1">
                                        <label htmlFor="filter-type" className="text-xs font-medium text-dark-gray mb-1.5 block">Property Type</label>
                                        <select
                                            id="filter-type"
                                            title="Filter by property type"
                                            value={selectedType}
                                            onChange={(e) => setSelectedType(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray focus:border-teal focus:outline-none transition-colors"
                                        >
                                            {TYPES.map((t) => (
                                                <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className="flex-1">
                                        <label htmlFor="filter-status" className="text-xs font-medium text-dark-gray mb-1.5 block">Status</label>
                                        <select
                                            id="filter-status"
                                            title="Filter by project status"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray focus:border-teal focus:outline-none transition-colors"
                                        >
                                            {STATUSES.map((s) => (
                                                <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sort */}
                                    <div className="flex-1">
                                        <label htmlFor="filter-sort" className="text-xs font-medium text-dark-gray mb-1.5 block">Sort By</label>
                                        <select
                                            id="filter-sort"
                                            title="Sort projects"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray focus:border-teal focus:outline-none transition-colors"
                                        >
                                            {SORT_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Clear */}
                                    {activeFilterCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="text-sm text-teal font-medium hover:underline underline-offset-4 shrink-0 pb-1"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ─── Results count ─── */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-spanish-gray">
                        Showing <span className="text-dark-gray font-medium">{filtered.length}</span> project{filtered.length !== 1 ? "s" : ""}
                    </p>
                    {/* Quick type pills (desktop) */}
                    <div className="hidden lg:flex items-center gap-2">
                        {TYPES.map((t) => {
                            const Icon = t === "All" ? null : TYPE_ICONS[t];
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    title={`Show ${t === "All" ? "all" : t} properties`}
                                    onClick={() => setSelectedType(t)}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedType === t ? "bg-teal text-white" : "bg-warm-bg text-dark-gray/70 hover:bg-teal/10 hover:text-teal"}`}
                                >
                                    {Icon && <Icon className="w-3.5 h-3.5" />}
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ─── Properties ─── */}
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <Search className="w-12 h-12 text-spanish-gray/30 mb-4" />
                            <h3 className="text-lg font-semibold text-dark-gray mb-2 font-heading">No projects found</h3>
                            <p className="text-sm text-spanish-gray mb-6">Try adjusting your search or filters</p>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm font-medium text-teal hover:underline underline-offset-4"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`${layout}-${selectedType}-${selectedStatus}-${sortBy}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className={layout === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                : "flex flex-col gap-5"
                            }
                        >
                            {filtered.map((p, i) => (
                                <PropertyCard key={p.slug} property={p} index={i} layout={layout} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

function CtaBanner() {
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
                        Didn&apos;t Find What You&apos;re Looking For?
                    </h2>
                    <p className="text-white/50 max-w-xl mx-auto leading-relaxed mb-8">
                        Our portfolio grows every quarter. Tell us what you need — budget, location, size — and
                        we&apos;ll match you with something that fits, or build it for you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg bg-teal px-7 py-3.5 text-sm font-medium text-white hover:bg-teal/80 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Talk to Our Team
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

function transformApiProject(p: Record<string, unknown>): Property {
    return {
        id: p.id as string,
        slug: p.slug as string,
        title: p.title as string,
        type: p.type as string,
        status: p.status as string,
        price: p.price as string,
        priceNumeric: p.priceNumeric as number,
        area: p.area as string,
        areaNumeric: p.areaNumeric as number,
        bedrooms: p.bedrooms as number,
        bathrooms: p.bathrooms as number,
        location: p.location as string,
        locality: p.locality as string,
        image: p.image as string,
        images: p.images as string[] | undefined,
        featured: p.featured as boolean,
        amenities: p.amenities as string[],
        description: p.description as string,
    };
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Record<string, unknown>[]>("/projects?limit=50")
            .then((res) => setProjects((res.data ?? []).map(transformApiProject)))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
            </main>
        );
    }

    return (
        <main>
            <HeroBanner />
            {/* <QuickStats projects={projects} /> */}
            <Suspense fallback={null}>
                <ProjectsGrid projects={projects} />
            </Suspense>
            <CtaBanner />
        </main>
    );
}
