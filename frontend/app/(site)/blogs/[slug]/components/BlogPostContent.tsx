"use client";

import { useRef, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useMotionTemplate,
} from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Calendar,
    Tag,
    Phone,
    Share2,
    Bookmark,
    ChevronRight,
    MapPin,
} from "lucide-react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import type { BlogPost } from "@/lib/types";

function ArticleHero({ post }: { post: BlogPost }) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.5, 0.75]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative h-[70vh] min-h-80 overflow-hidden">
            <motion.img
                src={post.image}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ scale: imgScale }}
            />
            <motion.div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

            <motion.div
                className="absolute inset-0 z-10 flex flex-col justify-end pb-16 px-10"
                style={{ opacity: contentOpacity }}
            >
                <div className="max-w-4xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        {/* Breadcrumb */}
                        <nav aria-label="Breadcrumb" className="mb-5">
                            <ol className="flex items-center gap-1.5 text-[11px] text-white/40">
                                <li><Link href="/" className="hover:text-white/70 transition-colors">Home</Link></li>
                                <li><ChevronRight className="w-3 h-3" /></li>
                                <li><Link href="/blogs" className="hover:text-white/70 transition-colors">Blog</Link></li>
                                <li><ChevronRight className="w-3 h-3" /></li>
                                <li className="text-white/60 truncate max-w-50">{post.title}</li>
                            </ol>
                        </nav>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="rounded-lg bg-teal/20 backdrop-blur-sm px-3 py-1 text-[11px] font-medium text-teal">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-white/50">
                                <Clock className="w-3 h-3" /> {post.readingTime} min read
                            </span>
                            <time dateTime={post.date} className="flex items-center gap-1 text-[11px] text-white/50">
                                <Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                            </time>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight font-heading mb-5">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-3">
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                            />
                            <div>
                                <p className="text-sm font-medium text-white">{post.author.name}</p>
                                <p className="text-[11px] text-white/50">{post.author.role}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent z-5" />
        </section>
    );
}

function ReadingProgress() {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-0.5 bg-teal z-50 origin-left"
            style={{ scaleX: scrollYProgress }}
        />
    );
}

function ArticleBody({ post }: { post: BlogPost }) {
    const [saved, setSaved] = useState(false);

    return (
        <section aria-label="Article content" className="py-16 px-10">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12">
                    {/* Main content */}
                    <article className="prose-none">
                        {/* Excerpt / Lead */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-lg text-dark-gray/80 leading-relaxed mb-10 font-medium border-l-3 border-teal pl-5"
                        >
                            {post.excerpt}
                        </motion.p>

                        {/* Sections */}
                        {post.sections.map((section, i) => (
                            <motion.div
                                key={section.heading}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: 0.05 }}
                                className="mb-10"
                            >
                                <h2 className="text-xl sm:text-2xl font-bold text-dark-gray mb-4 font-heading">
                                    {section.heading}
                                </h2>
                                <p className="text-base text-dark-gray/70 leading-[1.85]">
                                    {section.body}
                                </p>
                            </motion.div>
                        ))}

                        {/* Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="mt-12 pt-8 border-t border-dark-gray/6"
                        >
                            <div className="flex items-center gap-2 flex-wrap">
                                <Tag className="w-4 h-4 text-teal shrink-0" />
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/blogs?tag=${encodeURIComponent(tag)}`}
                                        className="rounded-lg border border-dark-gray/8 px-3 py-1 text-xs text-dark-gray/70 hover:border-teal/30 hover:text-teal transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>

                        {/* Author card */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="mt-8 p-6 rounded-lg bg-warm-bg flex items-start gap-4"
                        >
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-14 h-14 rounded-full object-cover shrink-0"
                            />
                            <div>
                                <p className="text-sm font-semibold text-dark-gray font-heading">{post.author.name}</p>
                                <p className="text-xs text-spanish-gray mb-2">{post.author.role}, Kronus Infratech</p>
                                <p className="text-sm text-dark-gray/60 leading-relaxed">
                                    Building homes and communities in Sonipat since 2014. Got a question about this article? Reach out directly.
                                </p>
                            </div>
                        </motion.div>
                    </article>

                    {/* Sticky sidebar actions (desktop) */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-28 space-y-3">
                            <button
                                type="button"
                                onClick={() => setSaved(!saved)}
                                aria-label={saved ? "Remove bookmark" : "Bookmark article"}
                                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${saved ? "bg-teal/10 border-teal/20 text-teal" : "border-dark-gray/10 text-spanish-gray hover:text-dark-gray hover:border-dark-gray/20"}`}
                            >
                                <Bookmark className={`w-4 h-4 ${saved ? "fill-teal" : ""}`} />
                            </button>
                            <button
                                type="button"
                                aria-label="Share article"
                                className="w-10 h-10 rounded-lg border border-dark-gray/10 flex items-center justify-center text-spanish-gray hover:text-dark-gray hover:border-dark-gray/20 transition-colors"
                                onClick={() => {
                                    if (typeof window !== "undefined" && navigator.share) {
                                        navigator.share({ title: post.title, url: window.location.href });
                                    }
                                }}
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                            <Link
                                href={`https://wa.me/919876543210?text=Hi%20Kronus%2C%20I%20read%20your%20article%20%22${encodeURIComponent(post.title)}%22%20and%20have%20a%20question`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Share on WhatsApp"
                                className="w-10 h-10 rounded-lg border border-dark-gray/10 flex items-center justify-center text-spanish-gray hover:text-teal hover:border-teal/20 transition-colors"
                            >
                                <AiOutlineWhatsApp className="w-4.5 h-4.5" />
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

function RelatedPosts({ post, allPosts }: { post: BlogPost; allPosts: BlogPost[] }) {
    const related = allPosts.filter(
        (p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    ).slice(0, 3);

    if (related.length === 0) return null;

    return (
        <section aria-label="Related articles" className="py-20 px-10 bg-warm-bg">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-xl mx-auto mb-12"
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Keep Reading</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray font-heading">
                        You Might Also Like
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
                            className="group rounded-lg overflow-hidden border border-dark-gray/6 bg-white hover:shadow-lg hover:shadow-teal/6 transition-shadow duration-500"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <span className="absolute top-3 left-3 rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-dark-gray">
                                    {p.category}
                                </span>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <time dateTime={p.date} className="text-[11px] text-spanish-gray">
                                        {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </time>
                                    <span className="w-1 h-1 rounded-full bg-spanish-gray/40" />
                                    <span className="text-[11px] text-spanish-gray">{p.readingTime} min</span>
                                </div>
                                <h3 className="text-lg font-semibold text-dark-gray mb-2 group-hover:text-teal transition-colors font-heading leading-snug line-clamp-2">
                                    <Link href={`/blogs/${p.slug}`}>{p.title}</Link>
                                </h3>
                                <p className="text-sm text-dark-gray/60 leading-relaxed line-clamp-2 mb-4">
                                    {p.excerpt}
                                </p>
                                <Link
                                    href={`/blogs/${p.slug}`}
                                    aria-label={`Read ${p.title}`}
                                    className="flex items-center gap-1.5 text-sm font-medium text-teal hover:underline underline-offset-4"
                                >
                                    Read More <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </motion.article>
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
                        Questions? We&apos;re an Open Book.
                    </h2>
                    <p className="text-white/50 max-w-xl mx-auto leading-relaxed mb-8">
                        Every article is written by someone on our team. If something resonated — or raised a question — reach out directly. No bots, no scripts.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg bg-teal px-7 py-3.5 text-sm font-medium text-white hover:bg-teal/80 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Talk to the Author
                        </Link>
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-7 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-teal hover:border-teal transition-all"
                        >
                            <MapPin className="w-4 h-4" />
                            Browse Projects
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default function BlogPostContent({ post, allPosts }: { post: BlogPost; allPosts: BlogPost[] }) {
    return (
        <>
            <ReadingProgress />
            <ArticleHero post={post} />
            <ArticleBody post={post} />
            <RelatedPosts post={post} allPosts={allPosts} />
            <CtaBanner />
        </>
    );
}
