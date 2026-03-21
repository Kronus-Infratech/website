"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
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
    ArrowLeft,
    ArrowRight,
    Phone,
    CheckCircle,
    Building,
    Home,
    TreePine,
    Landmark,
    Crown,
    Share2,
    Heart,
    Calendar,
    IndianRupee,
    Ruler,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import type { Property } from "@/lib/types";
import { api } from "@/lib/api";
import { useFormSubmit } from "@/lib/useFormSubmit";
import { validateEnquiryForm } from "@/lib/validation";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    Residential: Home,
    Commercial: Building,
    Villa: Crown,
    Plot: TreePine,
    Penthouse: Landmark,
};

const STATUS_COLOR: Record<string, string> = {
    "Ready to Move": "bg-teal/10 text-teal border-teal/20",
    "Under Construction": "bg-sunshade/10 text-sunshade border-sunshade/20",
    Upcoming: "bg-dark-gray/5 text-dark-gray border-dark-gray/10",
};

const GALLERY_POOL = [
    // "/projects-slug-hero.webp",
    "/kronus-floors-one.png",
    "/kronus-floors-two.png",
    "/projects/one.jpeg",
    "/projects/two.jpeg",
    // "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    // "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    // "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
    // "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    // "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    // "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
];

function getGallery(property: Property): string[] {
    return [property.image, ...GALLERY_POOL.slice(0, 5)];
}

function HeroGallery({ property }: { property: Property }) {
    const images = getGallery(property);
    const [active, setActive] = useState(0);
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.45, 0.7]);

    function next() {
        setActive((prev) => (prev + 1) % images.length);
    }
    function prev() {
        setActive((prev) => (prev - 1 + images.length) % images.length);
    }

    return (
        <section ref={ref} className="relative h-[70vh] min-h-80 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.img
                    key={active}
                    src={images[active]}
                    alt={`${property.title} — gallery image ${active + 1}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ scale: imgScale }}
                />
            </AnimatePresence>
            <motion.div
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity }}
            />

            {/* Navigation arrows */}
            <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`View image ${i + 1}`}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-white" : "bg-white/40 hover:bg-white/60"}`}
                    />
                ))}
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end pb-16 px-10">
                <div className="max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white mb-5 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to Projects
                        </Link>

                        {/* <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-[11px] font-medium border ${STATUS_COLOR[property.status] || "bg-white/10 text-white border-white/20"}`}>
                                {property.status}
                            </span>
                            {property.featured && (
                                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-sunshade text-white">
                                    <Sparkles className="w-3 h-3" /> Featured
                                </span>
                            )}
                        </div> */}

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight font-heading mb-3">
                            {property.title}
                        </h1>
                        <p className="flex items-center gap-1.5 text-sm text-white/80">
                            <MapPin className="w-4 h-4" />
                            {property.locality}, {property.location}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent z-5" />
        </section>
    );
}

function QuickInfoBar({ property }: { property: Property }) {
    const TypeIcon = TYPE_ICONS[property.type];
    const [liked, setLiked] = useState(false);

    const stats = [
        { Icon: IndianRupee, label: "Price", value: property.price },
        { Icon: Ruler, label: "Area", value: property.area },
        ...(property.bedrooms > 0
            ? [
                  { Icon: Bed, label: "Bedrooms", value: `${property.bedrooms} Bed` },
                  { Icon: Bath, label: "Bathrooms", value: `${property.bathrooms} Bath` },
              ]
            : []),
        { Icon: Calendar, label: "Status", value: property.status },
    ];

    return (
        <section aria-label="Project quick info" className="py-8 px-10 border-b border-dark-gray/6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                >
                    {/* Stats pills */}
                    <div className="flex flex-wrap items-center gap-3">
                        {TypeIcon && (
                            <span className="flex items-center gap-1.5 rounded-lg bg-teal/10 px-3.5 py-2 text-xs font-medium text-teal">
                                <TypeIcon className="w-3.5 h-3.5" />
                                {property.type}
                            </span>
                        )}
                        {stats.map((s) => (
                            <span
                                key={s.label}
                                className="flex items-center gap-1.5 rounded-lg bg-warm-bg px-3.5 py-2 text-xs text-dark-gray"
                            >
                                <s.Icon className="w-3.5 h-3.5 text-teal" />
                                <span className="font-medium">{s.value}</span>
                            </span>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => setLiked(!liked)}
                            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${liked ? "bg-red-50 border-red-200 text-red-500" : "border-dark-gray/10 text-spanish-gray hover:text-dark-gray hover:border-dark-gray/20"}`}
                        >
                            <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
                        </button>
                        <button
                            type="button"
                            aria-label="Share project"
                            className="w-10 h-10 rounded-lg border border-dark-gray/10 flex items-center justify-center text-spanish-gray hover:text-dark-gray hover:border-dark-gray/20 transition-colors"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: property.title, url: window.location.href });
                                }
                            }}
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <Link
                            href="tel:+919876543210"
                            className="inline-flex items-center gap-2 rounded-lg bg-teal px-5 py-2.5 text-sm font-medium text-white hover:bg-teal/80 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Enquire Now
                        </Link>
                        <Link
                            href={`https://wa.me/919876543210?text=Hi%20Kronus%2C%20I%27m%20interested%20in%20${encodeURIComponent(property.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-dark-gray/10 px-5 py-2.5 text-sm font-medium text-dark-gray hover:border-teal hover:text-teal transition-colors"
                        >
                            <AiOutlineWhatsApp className="w-4.5 h-4.5" />
                            WhatsApp
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function ProjectDetails({ property }: { property: Property }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(50);
    const my = useMotionValue(50);
    const spotlight = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(0,150,136,0.04) 0%, transparent 50%)`;

    const [enquiryData, setEnquiryData] = useState({ name: "", phone: "", email: "", message: "" });

    const { loading: enquiryLoading, success: enquirySuccess, error: enquiryError, submit: submitEnquiry, reset: resetEnquiry } = useFormSubmit({
        onSubmit: async (data: typeof enquiryData) => {
            await api.post("/leads/enquiry", {
                name: data.name.trim(),
                phone: data.phone.trim(),
                email: data.email.trim() || undefined,
                property: property.title,
                message: data.message.trim() || undefined,
                pageSource: `project-${property.id}`,
            });
        },
        validate: validateEnquiryForm,
    });

    function onEnquiryChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setEnquiryData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function onEnquirySubmit(e: React.FormEvent) {
        e.preventDefault();
        submitEnquiry(enquiryData);
    }

    function onMove(e: React.MouseEvent) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(((e.clientX - rect.left) / rect.width) * 100);
        my.set(((e.clientY - rect.top) / rect.height) * 100);
    }

    return (
        <section aria-label="Project details" className="py-20 px-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Description + Amenities */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-dark-gray mb-5 font-heading">
                                About This Project
                            </h2>
                            <p className="text-base text-dark-gray/70 leading-relaxed mb-6">
                                {property.description}
                            </p>
                            <p className="text-sm text-dark-gray/60 leading-relaxed">
                                Located in the heart of {property.locality}, this {property.type.toLowerCase()} property
                                offers a thoughtful balance of modern living and community warmth. Every detail — from
                                the structural foundation to the finishing touches — reflects Kronus Infratech&apos;s
                                commitment to building homes that last generations. With RERA compliance, earthquake-resistant
                                RCC frameworks, and ISI-certified materials, this project stands as a testament to quality
                                you can see and feel.
                            </p>
                        </motion.div>

                        {/* Amenities */}
                        {property.amenities.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <h2 className="text-2xl font-bold text-dark-gray mb-6 font-heading">
                                    Amenities &amp; Features
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {property.amenities.map((a, i) => (
                                        <motion.div
                                            key={a}
                                            initial={{ opacity: 0, x: -12 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: i * 0.05 }}
                                            className="flex items-center gap-3 rounded-lg bg-warm-bg p-4"
                                        >
                                            <CheckCircle className="w-4.5 h-4.5 text-teal shrink-0" />
                                            <span className="text-sm text-dark-gray">{a}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                        >
                            <h2 className="text-2xl font-bold text-dark-gray mb-6 font-heading">
                                Why This Project?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: ShieldCheck, title: "RERA Registered", text: "100% RERA-compliant with complete documentation transparency." },
                                    { icon: Ruler, title: "Vastu Compliant", text: "Every unit designed from scratch following Vastu Shastra principles." },
                                    { icon: Building, title: "Earthquake Resistant", text: "RCC framework with ISI-certified materials and 40+ quality checkpoints." },
                                    { icon: TreePine, title: "Green Living", text: "Rainwater harvesting, solar-ready rooftops, and dedicated green spaces." },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                        className="p-5 rounded-lg border border-dark-gray/6 hover:border-teal/20 transition-colors"
                                    >
                                        <item.icon className="w-5 h-5 text-teal mb-3" />
                                        <h3 className="text-sm font-semibold text-dark-gray mb-1 font-heading">{item.title}</h3>
                                        <p className="text-xs text-dark-gray/60 leading-relaxed">{item.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Sticky Enquiry Card */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-28">
                            <motion.div
                                ref={cardRef}
                                onMouseMove={onMove}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="relative rounded-lg border border-dark-gray/6 bg-white p-7 overflow-hidden"
                            >
                                <motion.div
                                    className="absolute inset-0 pointer-events-none rounded-lg"
                                    style={{ background: spotlight }}
                                />
                                <div className="relative">
                                    <h3 className="text-lg font-bold text-dark-gray mb-1 font-heading">
                                        Interested in this property?
                                    </h3>
                                    <p className="text-xs text-spanish-gray mb-6">
                                        Fill in your details and our team will reach out within 24 hours.
                                    </p>

                                    <AnimatePresence mode="wait">
                                        {enquirySuccess ? (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center justify-center py-8 text-center"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal mb-3">
                                                    <CheckCircle className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-base font-bold text-dark-gray mb-1 font-heading">Request Received!</h4>
                                                <p className="text-xs text-dark-gray/60 leading-relaxed mb-4">
                                                    We&apos;ll call you within 24 hours, {enquiryData.name || "friend"}.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => { resetEnquiry(); setEnquiryData({ name: "", phone: "", email: "", message: "" }); }}
                                                    className="text-xs text-teal font-medium hover:underline underline-offset-4"
                                                >
                                                    Submit another enquiry
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.form
                                                key="form"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onSubmit={onEnquirySubmit}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <label htmlFor="enquiry-name" className="text-xs font-medium text-dark-gray mb-1.5 block">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        id="enquiry-name"
                                                        name="name"
                                                        type="text"
                                                        value={enquiryData.name}
                                                        onChange={onEnquiryChange}
                                                        placeholder="Rahul Sharma"
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray/50 focus:border-teal focus:outline-none transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="enquiry-phone" className="text-xs font-medium text-dark-gray mb-1.5 block">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        id="enquiry-phone"
                                                        name="phone"
                                                        type="tel"
                                                        value={enquiryData.phone}
                                                        onChange={onEnquiryChange}
                                                        placeholder="+91 98765 43210"
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray/50 focus:border-teal focus:outline-none transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="enquiry-email" className="text-xs font-medium text-dark-gray mb-1.5 block">
                                                        Email
                                                    </label>
                                                    <input
                                                        id="enquiry-email"
                                                        name="email"
                                                        type="email"
                                                        value={enquiryData.email}
                                                        onChange={onEnquiryChange}
                                                        placeholder="rahul@example.com"
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray/50 focus:border-teal focus:outline-none transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="enquiry-message" className="text-xs font-medium text-dark-gray mb-1.5 block">
                                                        Message (optional)
                                                    </label>
                                                    <textarea
                                                        id="enquiry-message"
                                                        name="message"
                                                        rows={3}
                                                        value={enquiryData.message}
                                                        onChange={onEnquiryChange}
                                                        placeholder="I'd like to schedule a site visit..."
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray/50 focus:border-teal focus:outline-none transition-colors resize-none"
                                                    />
                                                </div>

                                                {enquiryError && (
                                                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{enquiryError}</p>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={enquiryLoading}
                                                    className="w-full rounded-lg bg-teal py-3 text-sm font-medium text-white hover:bg-teal/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {enquiryLoading ? "Submitting..." : "Request Callback"}
                                                </button>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>

                                    <div className="mt-5 pt-5 border-t border-dark-gray/6 flex items-center gap-3">
                                        <Link
                                            href="tel:+919876543210"
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-dark-gray/10 py-2.5 text-xs font-medium text-dark-gray hover:border-teal hover:text-teal transition-colors"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            Call
                                        </Link>
                                        <Link
                                            href={`https://wa.me/919876543210?text=Hi%20Kronus%2C%20I%27m%20interested%20in%20${encodeURIComponent(property.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-dark-gray/10 py-2.5 text-xs font-medium text-dark-gray hover:border-teal hover:text-teal transition-colors"
                                        >
                                            <AiOutlineWhatsApp className="w-4 h-4" />
                                            WhatsApp
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Price highlight card */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="mt-4 rounded-lg bg-warm-bg p-5"
                            >
                                <p className="text-xs text-spanish-gray mb-1">Starting from</p>
                                <p className="text-2xl font-bold text-dark-gray font-heading">{property.price}</p>
                                <p className="text-xs text-dark-gray/50 mt-1">
                                    EMI starting at ₹{Math.round(property.priceNumeric * 0.007 / 100) * 100}/month*
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function LocationSection({ property }: { property: Property }) {
    return (
        <section aria-label="Location" className="py-20 px-10 bg-warm-bg">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-xl mx-auto mb-12"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Location</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        Where Exactly?
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-5 gap-8"
                >
                    {/* Map */}
                    <div className="lg:col-span-3 rounded-lg overflow-hidden border border-dark-gray/6 h-80 lg:h-auto">
                        <iframe
                            title={`Map of ${property.locality}`}
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55997.45843708458!2d77.0!3d28.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390db00b!2s${encodeURIComponent(property.locality)}!5e0!3m2!1sen!2sin!4v1`}
                            className="w-full h-full min-h-80"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </div>

                    {/* Location details */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="rounded-lg bg-white p-6 border border-dark-gray/6">
                            <MapPin className="w-5 h-5 text-teal mb-3" />
                            <h3 className="text-sm font-semibold text-dark-gray mb-1 font-heading">Address</h3>
                            <p className="text-sm text-dark-gray/60">{property.locality}</p>
                            <p className="text-sm text-dark-gray/60">{property.location}</p>
                        </div>
                        {[
                            { label: "NH-44 Access", value: "5 min drive" },
                            { label: "Nearest Metro", value: "10 min (proposed)" },
                            { label: "Sonipat Railway Stn", value: "12 min drive" },
                            { label: "IGI Airport, Delhi", value: "55 min drive" },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: 12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.06 }}
                                className="flex items-center justify-between rounded-lg bg-white p-4 border border-dark-gray/6"
                            >
                                <span className="text-sm text-dark-gray">{item.label}</span>
                                <span className="text-sm font-medium text-teal">{item.value}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function GalleryGrid({ property }: { property: Property }) {
    const images = getGallery(property);

    return (
        <section aria-label="Gallery" className="py-20 px-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-xl mx-auto mb-12"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Gallery</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        See It for Yourself
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                            className={`relative rounded-lg overflow-hidden group ${i === 0 ? "col-span-2 row-span-2 h-80 md:h-100" : "h-44 md:h-48"}`}
                        >
                            <img
                                src={img}
                                alt={`${property.title} — photo ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function RelatedProjects({ property, allProjects }: { property: Property; allProjects: Property[] }) {
    const related = allProjects.filter((p) => p.slug !== property.slug).slice(0, 3);

    if (related.length === 0) return null;

    return (
        <section aria-label="Related projects" className="py-20 px-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-xl mx-auto mb-12"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Explore More</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        Similar Projects
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {related.map((p, i) => (
                        <motion.article
                            key={p.slug}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="group relative rounded-lg overflow-hidden border border-dark-gray/6 bg-white hover:shadow-lg hover:shadow-teal/6 transition-shadow duration-500"
                        >
                            <Link
                                href={`/projects/${p.slug}`}
                                aria-label={`View details of ${p.title}`}
                                className="absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                            />
                            <div className="relative h-52 overflow-hidden">
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
                            <div className="p-5">
                                <p className="text-[11px] uppercase tracking-wider text-teal font-medium mb-1">{p.type}</p>
                                <h3 className="text-lg font-semibold text-dark-gray mb-1.5 group-hover:text-teal transition-colors font-heading">
                                    {p.title}
                                </h3>
                                <p className="flex items-center gap-1 text-xs text-spanish-gray mb-3">
                                    <MapPin className="w-3 h-3" /> {p.locality}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-dark-gray/6">
                                    <p className="text-xl font-bold text-dark-gray">{p.price}</p>
                                    <span className="w-9 h-9 rounded-lg bg-warm-bg flex items-center justify-center text-teal transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CtaBanner({ property }: { property: Property }) {
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
                        Ready to Make {property.title} Your Home?
                    </h2>
                    <p className="text-white/50 max-w-xl mx-auto leading-relaxed mb-8">
                        Book a free site visit, walk through the actual property, meet our engineers, and
                        see the quality for yourself. No pressure, just honest conversations.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg bg-teal px-7 py-3.5 text-sm font-medium text-white hover:bg-teal/80 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Schedule a Visit
                        </Link>
                        <Link
                            href={`https://wa.me/919876543210?text=Hi%20Kronus%2C%20I%20want%20to%20visit%20${encodeURIComponent(property.title)}`}
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

export default function ProjectDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [allProjects, setAllProjects] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get<Record<string, unknown>>(`/projects/${slug}`),
            api.get<Record<string, unknown>[]>("/projects?limit=50"),
        ])
            .then(([detail, list]) => {
                if (detail.data) setProperty(transformApiProject(detail.data));
                if (list.data) setAllProjects(list.data.map(transformApiProject));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
            </main>
        );
    }

    if (!property) {
        return (
            <main className="flex flex-col items-center justify-center min-h-[60vh] px-10">
                <h1 className="text-3xl font-bold text-dark-gray mb-4 font-heading">Project Not Found</h1>
                <p className="text-sm text-spanish-gray mb-8">
                    The project you&apos;re looking for doesn&apos;t exist or may have been moved.
                </p>
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-lg bg-teal px-6 py-3 text-sm font-medium text-white hover:bg-teal/80 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>
            </main>
        );
    }

    return (
        <main>
            <HeroGallery property={property} />
            <QuickInfoBar property={property} />
            <ProjectDetails property={property} />
            <GalleryGrid property={property} />
            <LocationSection property={property} />
            <RelatedProjects property={property} allProjects={allProjects} />
            <CtaBanner property={property} />
        </main>
    );
}
