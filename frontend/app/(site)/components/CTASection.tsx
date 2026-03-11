"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useFormSubmit } from "@/lib/useFormSubmit";
import { validateContactForm } from "@/lib/validation";

export default function CTASection() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        interest: "",
        message: "",
    });

    const { loading, success, error, submit, reset } = useFormSubmit({
        onSubmit: async (data: typeof formData) => {
            await api.post("/leads/enquiry", {
                name: data.name.trim(),
                phone: data.phone.trim(),
                email: data.email.trim() || undefined,
                property: data.interest || "general",
                message: data.message.trim() || undefined,
                pageSource: "home-cta",
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
        <section id="contact" className="py-20 px-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-14 items-start">
                    {/* Left — Copy */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-xs uppercase tracking-widest text-teal mb-3 font-medium">Start the Conversation</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray mb-5 leading-snug font-heading">
                            Your Future Home Is One Call Away
                        </h2>
                        <p className="text-dark-gray/70 leading-relaxed mb-8 max-w-md">
                            Walk through our model flats, discuss floor plans over chai, or
                            just tell us what &ldquo;home&rdquo; means to you. We start every
                            relationship with a conversation, not a sales pitch.
                        </p>

                        <address className="not-italic flex flex-col gap-4">
                            <Link href="tel:+919876543210" className="flex items-center gap-3 group text-dark-gray hover:text-teal transition-colors">
                                <span className="w-10 h-10 rounded-lg bg-warm-bg flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-colors">
                                    <Phone className="w-4 h-4" />
                                </span>
                                <span className="text-sm font-medium">+91 98765 43210</span>
                            </Link>
                            <Link href="mailto:admin@kronusinfra.org" className="flex items-center gap-3 group text-dark-gray hover:text-teal transition-colors">
                                <span className="w-10 h-10 rounded-lg bg-warm-bg flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-colors">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <span className="text-sm font-medium">admin@kronusinfra.org</span>
                            </Link>
                            <div className="flex items-center gap-3 text-dark-gray">
                                <span className="w-10 h-10 rounded-lg bg-warm-bg flex items-center justify-center text-teal">
                                    <MapPin className="w-4 h-4" />
                                </span>
                                <span className="text-sm font-medium">Sonipat, Haryana 131001</span>
                            </div>
                        </address>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="rounded-lg border border-dark-gray/8 bg-warm-bg p-8">
                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-10 text-center"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center text-teal mb-4">
                                            <CheckCircle className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-bold text-dark-gray mb-2 font-heading">We&apos;ll Call You Back!</h3>
                                        <p className="text-sm text-dark-gray/60 max-w-xs leading-relaxed mb-5">
                                            Thank you, {formData.name || "friend"}. Our team will reach out shortly.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => { reset(); setFormData({ name: "", phone: "", email: "", interest: "", message: "" }); }}
                                            className="text-sm text-teal font-medium hover:underline underline-offset-4"
                                        >
                                            Submit another request
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <h3 className="text-lg font-semibold text-dark-gray mb-6 font-heading">
                                            Schedule a Site Visit
                                        </h3>
                                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" aria-label="Full name" className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray focus:border-teal focus:outline-none transition-colors" />
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" aria-label="Phone number" className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray focus:border-teal focus:outline-none transition-colors" />
                                            </div>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" aria-label="Email address" className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray focus:border-teal focus:outline-none transition-colors" />
                                            <select name="interest" value={formData.interest} onChange={handleChange} title="Select property type you are interested in" aria-label="Property interest" className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray focus:border-teal focus:outline-none transition-colors">
                                                <option value="">What are you looking for?</option>
                                                <option value="apartment">Apartment</option>
                                                <option value="villa">Villa</option>
                                                <option value="plot">Plot</option>
                                                <option value="commercial">Commercial Space</option>
                                                <option value="penthouse">Penthouse</option>
                                            </select>
                                            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your ideal home (optional)" aria-label="Message" rows={3} className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray focus:border-teal focus:outline-none transition-colors resize-none" />

                                            {error && (
                                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                    <span>{error}</span>
                                                </div>
                                            )}

                                            <motion.button
                                                type="submit"
                                                disabled={loading}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                className="flex items-center justify-center gap-2 py-3.5 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                                {loading ? "Submitting..." : "Request a Callback"}
                                                {!loading && <ArrowRight className="w-4 h-4" />}
                                            </motion.button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
