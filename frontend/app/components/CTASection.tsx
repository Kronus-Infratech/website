"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
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
                            <h3 className="text-lg font-semibold text-dark-gray mb-6 font-heading">
                                Schedule a Site Visit
                            </h3>
                            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full Name" aria-label="Full name" className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray focus:border-teal focus:outline-none transition-colors" />
                                    <input type="tel" placeholder="Phone Number" aria-label="Phone number" className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray focus:border-teal focus:outline-none transition-colors" />
                                </div>
                                <input type="email" placeholder="Email Address" aria-label="Email address" className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray focus:border-teal focus:outline-none transition-colors" />
                                <select title="Select property type you are interested in" aria-label="Property interest" className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray focus:border-teal focus:outline-none transition-colors">
                                    <option value="">What are you looking for?</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="villa">Villa</option>
                                    <option value="plot">Plot</option>
                                    <option value="commercial">Commercial Space</option>
                                    <option value="penthouse">Penthouse</option>
                                </select>
                                <textarea placeholder="Tell us about your ideal home (optional)" aria-label="Message" rows={3} className="px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray focus:border-teal focus:outline-none transition-colors resize-none" />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="flex items-center justify-center gap-2 py-3.5 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal/90 transition-colors"
                                >
                                    Request a Callback
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
