"use client";

import { useRef, useState, useMemo } from "react";
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
    Search,
    ArrowRight,
    Clock,
    Calendar,
    Tag,
    X,
    Phone,
    Filter,
    BookOpen,
    CheckCircle,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import type { BlogPost } from "@/lib/types";
import { api } from "@/lib/api";
import { useFormSubmit } from "@/lib/useFormSubmit";
import { validateNewsletterEmail } from "@/lib/validation";

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
                    src="/blogs-hero.png"
                    alt="Kronus Infratech blog — real estate insights and homebuying guides"
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
                    Insights &amp; Guides
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight font-heading"
                >
                    The Kronus<br />
                    <span className="text-sunshade">Journal</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mt-5 text-base sm:text-lg text-white/60 max-w-lg mx-auto leading-relaxed"
                >
                    Market trends, buyer guides, construction deep-dives, and honest advice from builders who&apos;ve been at it since 2014.
                </motion.p>
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-white to-transparent" />
        </section>
    );
}

function FeaturedPost({ posts }: { posts: BlogPost[] }) {
    const post = posts.find((p) => p.featured);
    if (!post) return null;

    const mx = useMotionValue(50);
    const my = useMotionValue(50);
    const spotlight = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(0,150,136,0.06) 0%, transparent 55%)`;
    const cardRef = useRef<HTMLElement>(null);

    function onMove(e: React.MouseEvent) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(((e.clientX - rect.left) / rect.width) * 100);
        my.set(((e.clientY - rect.top) / rect.height) * 100);
    }

    return (
        <section aria-label="Featured article" className="py-10 px-10">
            <div className="max-w-7xl mx-auto">
                <motion.article
                    ref={cardRef}
                    onMouseMove={onMove}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="group relative rounded-lg overflow-hidden border border-dark-gray/6 bg-white hover:shadow-xl hover:shadow-teal/6 transition-shadow duration-500"
                >
                    <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ background: spotlight }} />
                    <div className="relative grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative h-64 lg:h-auto overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <span className="absolute top-4 left-4 rounded-lg bg-sunshade px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                Featured
                            </span>
                        </div>
                        <div className="relative p-8 lg:p-10 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="rounded-lg bg-teal/10 px-3 py-1 text-[11px] font-medium text-teal">
                                    {post.category}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-spanish-gray">
                                    <Clock className="w-3 h-3" /> {post.readingTime} min read
                                </span>
                                <time dateTime={post.date} className="flex items-center gap-1 text-[11px] text-spanish-gray">
                                    <Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </time>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-dark-gray mb-3 group-hover:text-teal transition-colors font-heading leading-tight">
                                <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                            </h2>
                            <p className="text-sm text-dark-gray/60 leading-relaxed mb-6 line-clamp-3">
                                {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className="w-9 h-9 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold text-dark-gray">{post.author.name}</p>
                                        <p className="text-[10px] text-spanish-gray">{post.author.role}</p>
                                    </div>
                                </div>
                                <Link
                                    href={`/blogs/${post.slug}`}
                                    aria-label={`Read ${post.title}`}
                                    className="flex items-center gap-2 text-sm font-medium text-teal hover:underline underline-offset-4"
                                >
                                    Read Article <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.article>
            </div>
        </section>
    );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
    const cardRef = useRef<HTMLElement>(null);
    const mx = useMotionValue(50);
    const my = useMotionValue(50);
    const spotlight = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(0,150,136,0.06) 0%, transparent 55%)`;

    function onMove(e: React.MouseEvent) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(((e.clientX - rect.left) / rect.width) * 100);
        my.set(((e.clientY - rect.top) / rect.height) * 100);
    }

    return (
        <motion.article
            ref={cardRef}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            onMouseMove={onMove}
            className="group relative rounded-lg overflow-hidden border border-dark-gray/6 bg-white hover:shadow-lg hover:shadow-teal/6 transition-shadow duration-500"
        >
            <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ background: spotlight }} />
            <div className="relative h-52 overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
                <span className="absolute top-3 left-3 rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-dark-gray">
                    {post.category}
                </span>
            </div>
            <div className="relative p-5">
                <div className="flex items-center gap-3 mb-3">
                    <time dateTime={post.date} className="text-[11px] text-spanish-gray">
                        {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                    <span className="w-1 h-1 rounded-full bg-spanish-gray/40" />
                    <span className="flex items-center gap-1 text-[11px] text-spanish-gray">
                        <Clock className="w-3 h-3" /> {post.readingTime} min
                    </span>
                </div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2 group-hover:text-teal transition-colors font-heading leading-snug line-clamp-2">
                    <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-sm text-dark-gray/60 leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-dark-gray/6">
                    <div className="flex items-center gap-2">
                        <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-7 h-7 rounded-full object-cover"
                            loading="lazy"
                        />
                        <p className="text-xs font-medium text-dark-gray">{post.author.name}</p>
                    </div>
                    <Link
                        href={`/blogs/${post.slug}`}
                        aria-label={`Read ${post.title}`}
                        className="w-8 h-8 rounded-lg bg-warm-bg flex items-center justify-center text-teal hover:bg-teal hover:text-white transition-colors"
                    >
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

function BlogGrid({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filtered = useMemo(() => {
        let result = [...posts];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.excerpt.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        return result;
    }, [search, selectedCategory, posts]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
        return [...tags].slice(0, 12);
    }, [posts]);

    return (
        <section aria-label="All articles" className="py-14 px-10">
            <div className="max-w-7xl mx-auto">
                {/* Toolbar */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mb-10"
                >
                    {/* Search + category row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-spanish-gray" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search articles by title, topic, or tag..."
                                aria-label="Search articles"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray/60 focus:border-teal focus:outline-none transition-colors"
                            />
                            {search && (
                                <button
                                    type="button"
                                    title="Clear search"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-spanish-gray hover:text-dark-gray"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {["All", ...categories].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${selectedCategory === cat ? "bg-teal text-white" : "bg-warm-bg text-dark-gray/70 hover:bg-teal/10 hover:text-teal"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Results count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-spanish-gray">
                        <span className="text-dark-gray font-medium">{filtered.length}</span> article{filtered.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Grid */}
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <BookOpen className="w-12 h-12 text-spanish-gray/30 mb-4" />
                            <h3 className="text-lg font-semibold text-dark-gray mb-2 font-heading">No articles found</h3>
                            <p className="text-sm text-spanish-gray mb-6">Try a different search term or category</p>
                            <button
                                type="button"
                                onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                                className="text-sm font-medium text-teal hover:underline underline-offset-4"
                            >
                                Clear filters
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`${selectedCategory}-${search}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {filtered.map((post, i) => (
                                <BlogCard key={post.slug} post={post} index={i} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Popular tags */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mt-16 pt-10 border-t border-dark-gray/6"
                >
                    <h3 className="text-sm font-semibold text-dark-gray mb-4 font-heading flex items-center gap-2">
                        <Tag className="w-4 h-4 text-teal" /> Popular Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setSearch(tag)}
                                className="rounded-lg border border-dark-gray/8 px-3.5 py-1.5 text-xs text-dark-gray/70 hover:border-teal/30 hover:text-teal transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function NewsletterSection() {
    const [email, setEmail] = useState("");

    const { loading, success, error, submit, reset } = useFormSubmit({
        onSubmit: async (emailVal: string) => {
            await api.post("/newsletter/subscribe", { email: emailVal.trim() });
        },
        validate: (emailVal: string) => validateNewsletterEmail(emailVal),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submit(email);
    }

    return (
        <section aria-label="Newsletter signup" className="py-20 px-10 bg-warm-bg">
            <div className="max-w-2xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-xs uppercase tracking-widest text-teal mb-2 font-medium">Stay Updated</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-gray mb-4 font-heading">
                        Get Market Insights Delivered
                    </h2>
                    <p className="text-sm text-dark-gray/60 leading-relaxed mb-8 max-w-lg mx-auto">
                        One email per month. No spam, no promotions — just honest market analysis,
                        buyer tips, and construction updates from the Kronus team.
                    </p>

                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-medium text-dark-gray">You&apos;re subscribed!</p>
                                <p className="text-xs text-dark-gray/60">Check your inbox for a confirmation.</p>
                                <button
                                    type="button"
                                    onClick={() => { reset(); setEmail(""); }}
                                    className="text-xs text-teal font-medium hover:underline underline-offset-4 mt-1"
                                >
                                    Subscribe another email
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        aria-label="Email address for newsletter"
                                        className="flex-1 px-4 py-3 rounded-lg border border-dark-gray/10 bg-white text-sm text-dark-gray placeholder:text-spanish-gray/50 focus:border-teal focus:outline-none transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-lg bg-teal px-6 py-3 text-sm font-medium text-white hover:bg-teal/80 transition-colors shrink-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {loading ? "Subscribing..." : "Subscribe"}
                                    </button>
                                </form>
                                {error && (
                                    <div className="flex items-center justify-center gap-2 mt-3 text-red-600 text-xs">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="text-[10px] text-spanish-gray mt-3">
                        We respect your privacy. Unsubscribe anytime.
                    </p>
                </motion.div>
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
                        Done Reading? Let&apos;s Talk.
                    </h2>
                    <p className="text-white/50 max-w-xl mx-auto leading-relaxed mb-8">
                        Whether you&apos;re a first-time buyer or a seasoned investor,
                        our team is ready to turn your questions into a solid plan.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg bg-teal px-7 py-3.5 text-sm font-medium text-white hover:bg-teal/80 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Talk to Our Team
                        </Link>
                        <Link
                            href="https://wa.me/919876543210?text=Hi%20Kronus%2C%20I%20read%20your%20blog%20and%20have%20a%20question"
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

export default function BlogsContent({ initialPosts, categories }: { initialPosts: BlogPost[]; categories: string[] }) {
    return (
        <>
            <HeroBanner />
            <FeaturedPost posts={initialPosts} />
            <BlogGrid posts={initialPosts} categories={categories} />
            <NewsletterSection />
            <CtaBanner />
        </>
    );
}
