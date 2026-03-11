"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const VALUES = [
  { title: "Integrity at Every Brick", text: "RERA-compliant projects with transparent pricing and zero hidden costs. We believe trust is the foundation." },
  { title: "Engineering, Not Shortcuts", text: "Earthquake-resistant structures, premium fixtures, and ISI-certified materials — because your family deserves the strongest walls." },
  { title: "Designed for Generations", text: "Vastu-aligned layouts, cross-ventilated plans, and timeless facades that age with grace, not regret." },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-10 bg-warm-bg">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Image block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                alt="Kronus Infratech luxury residence exterior showcasing modern architecture in Sonipat"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-lg shadow-lg p-5 max-w-52">
              <p className="text-2xl font-bold text-teal font-heading">12+ Yrs</p>
              <p className="text-xs text-dark-gray/70 mt-1 leading-snug">of rooted presence in Haryana real estate</p>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-widest text-teal mb-3 font-medium">The Kronus Difference</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray mb-6 leading-snug font-heading">
              We Don&rsquo;t Just Build Structures. We Build the Addresses People Remember.
            </h2>
            <p className="text-dark-gray/70 leading-relaxed mb-10">
              Started from Sonipat with a single residential project, Kronus Infratech has grown through
              word-of-mouth referrals from the families we&rsquo;ve served. No billboards. No gimmicks. Just
              homes that speak for themselves and a reputation earned on-site, not on paper.
            </p>

            <div className="flex flex-col gap-6">
              {VALUES.map((v, i) => (
                <div key={v.title} className="flex gap-4 items-start">
                  <span className="mt-1 w-7 h-7 rounded-lg bg-teal/10 flex items-center justify-center text-teal text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-dark-gray mb-1 font-heading">{v.title}</h3>
                    <p className="text-xs text-dark-gray/60 leading-relaxed">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
