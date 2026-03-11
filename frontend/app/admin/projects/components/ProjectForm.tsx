"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export interface ProjectFormData {
    slug: string;
    title: string;
    type: string;
    status: string;
    price: string;
    priceNumeric: number;
    area: string;
    areaNumeric: number;
    bedrooms: number;
    bathrooms: number;
    location: string;
    locality: string;
    image: string;
    images: string[];
    featured: boolean;
    amenities: string[];
    description: string;
    published: boolean;
}

const EMPTY: ProjectFormData = {
    slug: "",
    title: "",
    type: "",
    status: "",
    price: "",
    priceNumeric: 0,
    area: "",
    areaNumeric: 0,
    bedrooms: 0,
    bathrooms: 0,
    location: "",
    locality: "",
    image: "",
    images: [],
    featured: false,
    amenities: [],
    description: "",
    published: true,
};

export default function ProjectForm({
    initial,
    projectId,
}: {
    initial?: Partial<ProjectFormData>;
    projectId?: string;
}) {
    const router = useRouter();
    const isEdit = !!projectId;
    const [form, setForm] = useState<ProjectFormData>({ ...EMPTY, ...initial });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    function set<K extends keyof ProjectFormData>(k: K, v: ProjectFormData[K]) {
        setForm((prev) => ({ ...prev, [k]: v }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const body = {
                ...form,
                images: form.images.filter(Boolean),
                amenities: form.amenities.filter(Boolean),
            };
            if (isEdit) {
                await api.put(`/projects/admin/${projectId}`, body);
            } else {
                await api.post("/projects/admin", body);
            }
            router.push("/admin/projects");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setSubmitting(false);
        }
    }

    const inputCls =
        "w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition";

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
            {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Basic Info */}
            <fieldset className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
                <legend className="text-lg font-semibold text-gray-900 font-heading px-1">
                    Basic Information
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            required
                            title="Title of Project"
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug *
                        </label>
                        <input
                            required
                            pattern="^[a-z0-9-]+$"
                            value={form.slug}
                            onChange={(e) => set("slug", e.target.value)}
                            className={inputCls}
                            placeholder="my-project-slug"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                        </label>
                        <input
                            required
                            value={form.type}
                            onChange={(e) => set("type", e.target.value)}
                            className={inputCls}
                            placeholder="Villa, Plot, Apartment…"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status *
                        </label>
                        <input
                            required
                            value={form.status}
                            onChange={(e) => set("status", e.target.value)}
                            className={inputCls}
                            placeholder="Ready to Move, Under Construction…"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location *
                        </label>
                        <input
                            required
                            value={form.location}
                            title="Project Location (e.g. Mumbai, Pune…)"
                            onChange={(e) => set("location", e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Locality *
                        </label>
                        <input
                            required
                            value={form.locality}
                            title="Project Locality (e.g. Andheri, Baner…)"
                            onChange={(e) => set("locality", e.target.value)}
                            className={inputCls}
                        />
                    </div>
                </div>
            </fieldset>

            {/* Pricing & Size */}
            <fieldset className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
                <legend className="text-lg font-semibold text-gray-900 font-heading px-1">
                    Pricing & Size
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price Label *
                        </label>
                        <input
                            required
                            title="Price Label (e.g. ₹1.5 Cr onwards)"
                            value={form.price}
                            onChange={(e) => set("price", e.target.value)}
                            className={inputCls}
                            placeholder="₹1.5 Cr onwards"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price Numeric *
                        </label>
                        <input
                            required
                            type="number"
                            title="Price in numbers"
                            min={0}
                            value={form.priceNumeric || ""}
                            onChange={(e) => set("priceNumeric", Number(e.target.value))}
                            className={inputCls}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area Label *
                        </label>
                        <input
                            required
                            value={form.area}
                            onChange={(e) => set("area", e.target.value)}
                            className={inputCls}
                            placeholder="200 sq. yards"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area Numeric *
                        </label>
                        <input
                            required
                            type="number"
                            title="Area in numbers (e.g. 200)"
                            min={0}
                            value={form.areaNumeric || ""}
                            onChange={(e) => set("areaNumeric", Number(e.target.value))}
                            className={inputCls}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bedrooms
                        </label>
                        <input
                            type="number"
                            title="Number of Bedrooms"
                            min={0}
                            value={form.bedrooms}
                            onChange={(e) => set("bedrooms", Number(e.target.value))}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bathrooms
                        </label>
                        <input
                            type="number"
                            title="Number of Bathrooms"
                            min={0}
                            value={form.bathrooms}
                            onChange={(e) => set("bathrooms", Number(e.target.value))}
                            className={inputCls}
                        />
                    </div>
                </div>
            </fieldset>

            {/* Media */}
            <fieldset className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
                <legend className="text-lg font-semibold text-gray-900 font-heading px-1">
                    Media
                </legend>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Image URL *
                    </label>
                    <input
                        required
                        value={form.image}
                        onChange={(e) => set("image", e.target.value)}
                        className={inputCls}
                        placeholder="https://…"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Images (one URL per line)
                    </label>
                    <textarea
                        rows={3}
                        value={form.images.join("\n")}
                        onChange={(e) =>
                            set("images", e.target.value.split("\n").map((s) => s.trim()))
                        }
                        className={inputCls}
                        placeholder={"https://…\nhttps://…"}
                    />
                </div>
            </fieldset>

            {/* Details */}
            <fieldset className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
                <legend className="text-lg font-semibold text-gray-900 font-heading px-1">
                    Details
                </legend>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                    </label>
                    <textarea
                        required
                        title="Description of Project"
                        rows={5}
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        className={inputCls}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amenities (comma-separated)
                    </label>
                    <input
                        title="Amenities (comma-separated)"
                        value={form.amenities.join(", ")}
                        onChange={(e) =>
                            set(
                                "amenities",
                                e.target.value.split(",").map((s) => s.trim()),
                            )
                        }
                        className={inputCls}
                        placeholder="Swimming Pool, Clubhouse, Gym…"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) => set("featured", e.target.checked)}
                            className="rounded border-gray-300 text-teal focus:ring-teal"
                        />
                        Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.published}
                            onChange={(e) => set("published", e.target.checked)}
                            className="rounded border-gray-300 text-teal focus:ring-teal"
                        />
                        Published
                    </label>
                </div>
            </fieldset>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-teal text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal/90 transition disabled:opacity-60"
                >
                    {submitting
                        ? "Saving…"
                        : isEdit
                            ? "Update Project"
                            : "Create Project"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/admin/projects")}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
