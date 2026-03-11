"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Home, IndianRupee, ChevronDown } from "lucide-react";

const PROPERTY_TYPES = ["All Types", "Residential", "Commercial", "Villa", "Plot", "Penthouse"];
const LOCATIONS = ["All Locations", "Sector 12", "GT Road", "Kundli", "Rajiv Chowk", "Murthal Road"];
const BUDGETS = ["Any Budget", "Under ₹50 Lac", "₹50 Lac – ₹1 Cr", "₹1 Cr – ₹2 Cr", "₹2 Cr – ₹5 Cr", "Above ₹5 Cr"];

interface DropdownProps {
    label: string;
    icon: React.ReactNode;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}

function Dropdown({ label, icon, options, value, onChange }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div ref={ref} className="relative flex-1 min-w-40 w-full md:w-auto">
            <button
                type="button"
                title={`Select ${label}`}
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left rounded-lg border border-dark-gray/10 bg-white hover:border-teal/40 transition-colors"
            >
                <span className="text-teal">{icon}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-spanish-gray font-medium">{label}</p>
                    <p className="text-sm text-dark-gray truncate font-medium">{value}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-spanish-gray transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        role="listbox"
                        aria-label={label}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-lg border border-dark-gray/10 shadow-lg overflow-hidden"
                    >
                        {options.map((opt) => (
                            <li key={opt}>
                                <button
                                    type="button"
                                    onClick={() => { onChange(opt); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-warm-bg ${value === opt ? "text-teal font-medium bg-warm-bg" : "text-dark-gray"
                                        }`}
                                >
                                    {opt}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SearchBar() {
    const router = useRouter();
    const [propertyType, setPropertyType] = useState("All Types");
    const [location, setLocation] = useState("All Locations");
    const [budget, setBudget] = useState("Any Budget");

    function handleSearch() {
        const params = new URLSearchParams();
        if (propertyType !== "All Types") params.set("type", propertyType);
        if (location !== "All Locations") params.set("location", location);
        if (budget !== "Any Budget") params.set("budget", budget);
        const qs = params.toString();
        router.push(`/projects${qs ? `?${qs}` : ""}`);
    }

    return (
        <motion.search
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-4xl mx-auto"
        >
            <div className="bg-white rounded-lg p-2 shadow-xl shadow-black/8">
                <div className="flex flex-col md:flex-row items-center gap-2 flex-wrap lg:flex-nowrap">
                    <Dropdown label="Property Type" icon={<Home className="w-4 h-4" />} options={PROPERTY_TYPES} value={propertyType} onChange={setPropertyType} />
                    <Dropdown label="Location" icon={<MapPin className="w-4 h-4" />} options={LOCATIONS} value={location} onChange={setLocation} />
                    <Dropdown label="Budget" icon={<IndianRupee className="w-4 h-4" />} options={BUDGETS} value={budget} onChange={setBudget} />

                    <motion.button
                        type="button"
                        title="Search properties"
                        onClick={handleSearch}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-teal text-white text-lg font-medium transition-colors hover:bg-teal/90 shrink-0 w-full md:w-auto"
                    >
                        <Search className="w-5 h-5" />
                        <span className="">Search</span>
                    </motion.button>
                </div>
            </div>
        </motion.search>
    );
}
