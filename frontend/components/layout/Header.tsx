"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact Us", href: "/contact" },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-dark-gray/6"
                    : "bg-transparent"
                    }`}
            >
                <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
                    {/* Logo — white version on desktop (unscrolled), dark version otherwise */}
                    <Link href="/" aria-label="Kronus Infratech — Home">
                        {/* Mobile: always dark logo */}
                        <Image
                            src="/logo.png"
                            alt="Kronus Infratech logo"
                            width={150}
                            height={40}
                            priority
                            className="block md:hidden"
                        />
                        {/* Desktop: white when not scrolled, dark when scrolled */}
                        <Image
                            src="/logo_white.png"
                            alt="Kronus Infratech logo"
                            width={150}
                            height={40}
                            priority
                            className={`hidden md:block transition-opacity duration-300 ${scrolled ? "opacity-0 absolute" : "opacity-100"}`}
                        />
                        <Image
                            src="/logo.png"
                            alt="Kronus Infratech logo"
                            width={150}
                            height={40}
                            priority
                            className={`hidden md:block transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0 absolute"}`}
                        />
                    </Link>

                    {/* Desktop links */}
                    <ul className="hidden md:flex items-center gap-10">
                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className={`text-lg font-medium transition-colors duration-300 hover:text-teal ${scrolled ? "text-dark-gray" : "text-white/80 hover:text-teal"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* CTA + Mobile */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="tel:+919876543210"
                            className="hidden md:inline-flex items-center gap-2 rounded-lg bg-teal px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-teal/70"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            Book a Visit
                        </Link>
                        <button
                            type="button"
                            title="Toggle navigation menu"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={`md:hidden p-2 transition-colors ${scrolled ? "text-dark-gray" : "text-white"}`}
                        >
                            {mobileOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-8"
                    >
                        <nav aria-label="Mobile navigation" className="flex flex-col gap-6">
                            {NAV_LINKS.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="text-3xl font-bold text-dark-gray hover:text-teal transition-colors font-heading"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
