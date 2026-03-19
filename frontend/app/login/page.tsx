"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Home, Lock, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function HeroBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[66vh] min-h-80 overflow-hidden">
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: imageY }}>
        <img
          src="/about-hero.webp"
          alt="Kronus premium residences"
          className="h-[118%] w-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-black/55" />

      <motion.div
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 sm:px-10"
        style={{ opacity: contentOpacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mb-4 text-xs uppercase tracking-widest text-white/65"
        >
          Kronus Access
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="max-w-3xl font-heading text-center text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
        >
          One Platform. <span className="text-sunshade block">Two Journeys.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-5 max-w-xl text-center text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Continue as a buyer or seller and move into the dashboard built for your goals.
        </motion.p>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-white to-transparent" />
    </section>
  );
}

function AccessCards() {
  const router = useRouter();

  return (
    <section aria-label="Choose login role" className="px-6 py-18 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-teal">Select Your Role</p>
          <h2 className="font-heading text-3xl font-bold text-dark-gray sm:text-4xl">
            Enter the Experience Built for You
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.button
            type="button"
            onClick={() => router.push("/buyer/login")}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="group rounded-2xl border border-dark-gray/8 bg-white p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-lg"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
              <Home className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-dark-gray">I am a Buyer</h3>
            <p className="mt-2 text-sm leading-relaxed text-dark-gray/65">
              Browse verified listings, save favorites, and plan site visits with ease.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal transition-all group-hover:gap-3">
              Continue as buyer
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => router.push("/seller/login")}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="group rounded-2xl border border-dark-gray/8 bg-white p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sunshade/35 hover:shadow-lg"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sunshade/18 text-cape-palliser">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-dark-gray">I am a Seller</h3>
            <p className="mt-2 text-sm leading-relaxed text-dark-gray/65">
              Manage properties, respond to buyers, and track performance from one place.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cape-palliser transition-all group-hover:gap-3">
              Continue as seller
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section aria-label="Trust indicators" className="bg-warm-bg px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-6xl rounded-2xl border border-dark-gray/8 bg-white p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl bg-warm-bg px-4 py-3">
            <p className="font-heading text-xl font-bold text-teal">500+</p>
            <p className="text-xs text-dark-gray/65">Families served</p>
          </div>
          <div className="rounded-xl bg-warm-bg px-4 py-3">
            <p className="font-heading text-xl font-bold text-sunshade">12+ Years</p>
            <p className="text-xs text-dark-gray/65">Local market trust</p>
          </div>
          <div className="rounded-xl bg-warm-bg px-4 py-3">
            <p className="font-heading text-xl font-bold text-cape-palliser">RERA</p>
            <p className="text-xs text-dark-gray/65">Compliant portfolio</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-teal/20 bg-teal/8 px-4 py-3 text-xs text-dark-gray/80 sm:text-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-teal" />
          Role-based secure login and verified account access.
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-dark-gray/70">
          <span className="inline-flex items-center gap-2">
            <Lock className="h-4 w-4 text-teal" />
            Your authentication data is protected.
          </span>
          <Link href="/" className="font-medium text-dark-gray transition-colors hover:text-teal">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function RoleSelectionPage() {
  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <AccessCards />
        {/* <TrustSection /> */}
      </main>
      <Footer />
    </>
  );
}
