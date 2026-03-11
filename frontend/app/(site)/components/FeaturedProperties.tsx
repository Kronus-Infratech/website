"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { api } from "@/lib/api";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function FeaturedProperties() {
  const [featured, setFeatured] = useState<Property[]>([]);

  useEffect(() => {
    api.get<Record<string, unknown>[]>("/projects?featured=true&limit=4")
      .then((res) =>
        setFeatured(
          (res.data ?? []).map((p) => ({
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
            featured: p.featured as boolean,
            amenities: p.amenities as string[],
            description: p.description as string,
          })),
        ),
      )
      .catch(() => {});
  }, []);

  return (
    <section id="properties" className="py-20 px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Hand-Picked by Kronus</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-gray font-heading">
              Properties Worth Calling Home
            </h2>
          </motion.div>

          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 text-sm font-medium text-teal hover:underline underline-offset-4"
          >
            See entire collection <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {featured.map((p) => (
            <motion.article
              key={p.slug}
              variants={fadeUp}
              className="group rounded-lg overflow-hidden border border-dark-gray/6 bg-white hover:shadow-lg hover:shadow-teal/6 transition-shadow duration-500"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.title} — ${p.type} property in ${p.locality}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Status */}
                <span className={`absolute top-3 left-3 rounded-lg px-3 py-1 text-[11px] font-medium backdrop-blur-sm ${
                  p.status === "Ready to Move"
                    ? "bg-teal/90 text-white"
                    : p.status === "Under Construction"
                    ? "bg-sunshade/90 text-white"
                    : "bg-white/90 text-dark-gray"
                }`}>
                  {p.status}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-wider text-teal font-medium mb-1">{p.type}</p>
                <h3 className="text-lg font-semibold text-dark-gray mb-1.5 group-hover:text-teal transition-colors font-heading">
                  {p.title}
                </h3>
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
          ))}
        </motion.div>
      </div>
    </section>
  );
}
