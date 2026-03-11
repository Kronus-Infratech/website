"use client";

import { useRef, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useMotionTemplate,
    useSpring,
    AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageCircle,
    ChevronDown,
    Instagram,
    Youtube,
    Facebook,
    CheckCircle,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { api } from "@/lib/api";
import { useFormSubmit } from "@/lib/useFormSubmit";
import { validateContactForm } from "@/lib/validation";


const CONTACT_METHODS = [
    {
        Icon: Phone,
        label: "Call Us",
        value: "+91 98765 43210",
        href: "tel:+919876543210",
        desc: "Mon - Sat, 9 AM - 7 PM",
        color: "bg-teal",
    },
    {
        Icon: Mail,
        label: "Email Us",
        value: "admin@kronusinfra.org",
        href: "mailto:admin@kronusinfra.org",
        desc: "We reply within 4 hours",
        color: "bg-sunshade",
    },
    {
        Icon: MapPin,
        label: "Visit Office",
        value: "Sonipat, Haryana 131001",
        href: "https://maps.google.com/?q=Sonipat+Haryana",
        desc: "Walk-ins welcome, chai included",
        color: "bg-cape-palliser",
    },
    {
        Icon: Clock,
        label: "Working Hours",
        value: "Mon - Sat, 9 AM - 7 PM",
        href: undefined,
        desc: "Sunday by appointment only",
        color: "bg-dark-gray",
    },
];

const FAQS = [
    {
        q: "What documents do I need to book a property?",
        a: "You'll need Aadhaar card, PAN card, two passport-size photos, and the booking amount cheque. Our team walks you through every step — no surprises, no hidden paperwork.",
    },
    {
        q: "Is Kronus RERA registered?",
        a: "Every single Kronus project is 100% RERA-compliant. Registration numbers are prominently displayed on-site and in all marketing material. Transparency isn't a feature — it's our default.",
    },
    {
        q: "Can I visit the construction site before booking?",
        a: "Absolutely. We encourage it. Our site engineers will walk you through the raw structure, explain the materials, and let you see exactly what you're investing in. No polished show-flats — just honest concrete.",
    },
    {
        q: "What's included in the post-possession maintenance?",
        a: "Two years of dedicated maintenance covering plumbing, electrical, structural settling, and common area upkeep. If a tap leaks at 11 PM, our team is one call away.",
    },
    {
        q: "Do you offer home loan assistance?",
        a: "We've partnered with SBI, HDFC, ICICI, and Axis Bank. Our finance desk handles the entire loan process — from eligibility checks to disbursement. Pre-approved loans available on select projects.",
    },
    {
        q: "Can NRIs invest in Kronus properties?",
        a: "Yes. We have a dedicated NRI desk that handles FEMA compliance, power-of-attorney documentation, and virtual site tours. Several NRI families across the US, UK, and Middle East are proud Kronus homeowners.",
    },
];

const SOCIALS = [
    { Icon: Youtube, href: "https://www.youtube.com/@kronusinfratech", label: "YouTube" },
    { Icon: Instagram, href: "https://www.instagram.com/kronus_infratech", label: "Instagram" },
    { Icon: Facebook, href: "https://www.facebook.com/Kronusinfra", label: "Facebook" },
];

function MagneticButton({ children, className, disabled }: { children: React.ReactNode; className?: string; disabled?: boolean }) {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 20 });
    const springY = useSpring(y, { stiffness: 200, damping: 20 });

    function onMove(e: React.MouseEvent) {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    }

    function onLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.button
            ref={ref}
            type="submit"
            disabled={disabled}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ x: springX, y: springY }}
            whileTap={{ scale: 0.95 }}
            className={className}
        >
            {children}
        </motion.button>
    );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="border-b border-dark-gray/8 last:border-b-0"
        >
            <button
                type="button"
                title={`Toggle answer for: ${q}`}
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left group"
            >
                <span className="text-sm sm:text-base font-medium text-dark-gray group-hover:text-teal transition-colors leading-snug">
                    {q}
                </span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-spanish-gray"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="text-sm text-dark-gray/60 leading-relaxed pb-5 pr-10">
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function ContactCard({
    Icon,
    label,
    value,
    href,
    desc,
    color,
    index,
}: (typeof CONTACT_METHODS)[number] & { index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(50);
    const my = useMotionValue(50);
    const spotlight = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(0,150,136,0.08) 0%, transparent 60%)`;

    function onMove(e: React.MouseEvent) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(((e.clientX - rect.left) / rect.width) * 100);
        my.set(((e.clientY - rect.top) / rect.height) * 100);
    }

    const Wrapper = href ? Link : "div";
    const wrapperProps = href
        ? { href, target: href.startsWith("http") ? "_blank" as const : undefined, rel: href.startsWith("http") ? "noopener noreferrer" : undefined }
        : {};

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={onMove}
            className="group relative"
        >
            <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{ background: spotlight }}
            />
            {/* @ts-expect-error dynamic wrapper */}
            <Wrapper
                {...wrapperProps}
                className="relative flex items-start gap-4 p-6 rounded-lg border border-dark-gray/6 bg-white hover:border-teal/20 hover:shadow-lg transition-all duration-400"
            >
                <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white shrink-0`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-spanish-gray mb-1 font-medium">{label}</p>
                    <p className="text-base font-semibold text-dark-gray font-heading mb-0.5">{value}</p>
                    <p className="text-xs text-dark-gray/50">{desc}</p>
                </div>
            </Wrapper>
        </motion.div>
    );
}

function HeroBanner() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section ref={ref} className="relative h-[70vh] min-h-80 flex items-center justify-center overflow-hidden">
            <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY }}>
                <img
                    // src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
                    src="/contact-hero.png"
                    alt="Modern office interior representing Kronus Infratech's welcoming workspace"
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
                    Get in Touch
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight font-heading"
                >
                    Let&apos;s Talk About<br />
                    <span className="text-sunshade">Your Next Home</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mt-5 text-base sm:text-lg text-white/60 max-w-lg mx-auto leading-relaxed"
                >
                    We start every relationship with a conversation — not a sales pitch. Reach out and we&apos;ll get back to you the same day.
                </motion.p>
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-white to-transparent" />
        </section>
    );
}

function ContactCardsSection() {
    return (
        <section aria-label="Contact methods" className="py-20 px-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-xl mb-7"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Reach Us</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        Four Ways to Say Hello
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {CONTACT_METHODS.map((method, i) => (
                        <ContactCard key={method.label} {...method} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FormSection() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        interest: "",
        message: "",
    });

    const { loading, success, error, fieldErrors, submit, reset } = useFormSubmit({
        onSubmit: async (data: typeof formData) => {
            await api.post("/leads/enquiry", {
                name: data.name.trim(),
                phone: data.phone.trim(),
                email: data.email.trim() || undefined,
                property: data.interest,
                message: data.message.trim() || undefined,
                pageSource: "contact-page",
            });
        },
        validate: validateContactForm,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submit(formData);
    }

    return (
        <section aria-label="Contact form and location" className="py-20 px-10 bg-warm-bg">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Form — takes 3 cols */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-3"
                    >
                        <div className="rounded-lg border border-dark-gray/8 bg-white p-8 sm:p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-dark-gray font-heading">Send Us a Message</h2>
                                    <p className="text-xs text-spanish-gray">We respond within 4 hours on working days</p>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-16 text-center"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center text-teal mb-5">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-dark-gray mb-2 font-heading">Message Received!</h3>
                                        <p className="text-sm text-dark-gray/60 max-w-sm leading-relaxed mb-6">
                                            Thank you, {formData.name || "friend"}. Our team will reach out to you shortly. Expect a call or email within the next few hours.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => { reset(); setFormData({ name: "", phone: "", email: "", interest: "", message: "" }); }}
                                            className="text-sm text-teal font-medium hover:underline underline-offset-4"
                                        >
                                            Send another message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col gap-5"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="contact-name" className="text-xs font-medium text-dark-gray mb-1.5 block">Full Name</label>
                                                <input
                                                    id="contact-name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Rajesh Khanna"
                                                    className="w-full px-4 py-3 rounded-lg border border-dark-gray/10 bg-warm-bg text-sm text-dark-gray placeholder:text-spanish-gray/60 focus:border-teal focus:ring-1 focus:ring-teal/20 focus:outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="contact-phone" className="text-xs font-medium text-dark-gray mb-1.5 block">Phone Number</label>
                                                <input
                                                    id="contact-phone"
                                                    name="phone"
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+91 98765 43210"
                                                    className="w-full px-4 py-3 rounded-lg border border-dark-gray/10 bg-warm-bg text-sm text-dark-gray placeholder:text-spanish-gray/60 focus:border-teal focus:ring-1 focus:ring-teal/20 focus:outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="contact-email" className="text-xs font-medium text-dark-gray mb-1.5 block">Email Address</label>
                                            <input
                                                id="contact-email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="rajesh@example.com"
                                                className="w-full px-4 py-3 rounded-lg border border-dark-gray/10 bg-warm-bg text-sm text-dark-gray placeholder:text-spanish-gray/60 focus:border-teal focus:ring-1 focus:ring-teal/20 focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="contact-interest" className="text-xs font-medium text-dark-gray mb-1.5 block">What Are You Looking For?</label>
                                            <select
                                                id="contact-interest"
                                                name="interest"
                                                title="Select your property interest"
                                                value={formData.interest}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-dark-gray/10 bg-warm-bg text-sm text-dark-gray focus:border-teal focus:ring-1 focus:ring-teal/20 focus:outline-none transition-all"
                                            >
                                                <option value="">Select a category</option>
                                                <option value="apartment">Apartment / Flat</option>
                                                <option value="villa">Independent Villa</option>
                                                <option value="plot">Residential Plot</option>
                                                <option value="commercial">Commercial Space</option>
                                                <option value="penthouse">Penthouse</option>
                                                <option value="other">Just Exploring</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="contact-message" className="text-xs font-medium text-dark-gray mb-1.5 block">Your Message</label>
                                            <textarea
                                                id="contact-message"
                                                name="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us about your ideal home — budget, location preference, family size, anything that helps us help you better."
                                                className="w-full px-4 py-3 rounded-lg border border-dark-gray/10 bg-warm-bg text-sm text-dark-gray placeholder:text-spanish-gray/60 focus:border-teal focus:ring-1 focus:ring-teal/20 focus:outline-none transition-all resize-none"
                                            />
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        <MagneticButton className="flex items-center justify-center gap-2.5 py-3.5 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            {loading ? "Sending..." : "Send Message"}
                                        </MagneticButton>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Map — takes 2 cols */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-2 flex flex-col gap-6"
                    >
                        {/* Embedded Map */}
                        <div className="rounded-lg overflow-hidden border border-dark-gray/8 flex-1 min-h-80">
                            <iframe
                                title="Kronus Infratech office location in Sonipat, Haryana"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55950.85825645747!2d77.00!3d28.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390db00b8670400b%3A0x6e2c00e5b8506e41!2sSonipat%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                className="w-full h-full min-h-80"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />
                        </div>

                        {/* Social strip */}
                        <div className="rounded-lg border border-dark-gray/8 bg-white p-6">
                            <p className="text-xs uppercase tracking-widest text-spanish-gray mb-3 font-medium">Follow the Journey</p>
                            <div className="flex items-center gap-3">
                                {SOCIALS.map((s) => (
                                    <Link
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Follow Kronus on ${s.label}`}
                                        title={`Follow Kronus on ${s.label}`}
                                        className="w-10 h-10 rounded-lg border border-dark-gray/8 flex items-center justify-center text-spanish-gray hover:text-teal hover:border-teal/30 transition-colors"
                                    >
                                        <s.Icon className="w-4 h-4" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function FaqSection() {
    return (
        <section aria-label="Frequently asked questions" className="py-20 px-10">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-14">
                {/* Left — sticky heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Common Questions</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray mb-4 font-heading">
                        Before You Ask — We Answered
                    </h2>
                    <p className="text-dark-gray/60 leading-relaxed mb-6">
                        Buying a home is a big decision. Here are the questions every family asks us, answered honestly.
                    </p>
                    <Link
                        href="tel:+919876543210"
                        className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:underline underline-offset-4"
                    >
                        <Phone className="w-4 h-4" />
                        Still have questions? Call us
                    </Link>
                </motion.div>

                {/* Right — accordion */}
                <div className="lg:col-span-3">
                    {FAQS.map((faq, i) => (
                        <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
                    ))}
                </div>
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

export default function ContactPage() {
    return (
        <main>
            <HeroBanner />
            <ContactCardsSection />
            <FormSection />
            <FaqSection />
            <CtaBanner />
        </main>
    );
}
