"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "../../components/Toast";
import ImageUpload from "../../components/ImageUpload";
import { Plus, Trash2 } from "lucide-react";

interface Section {
  heading: string;
  body: string;
}

export interface BlogFormData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readingTime: number;
  image: string;
  featured: boolean;
  published: boolean;
  sections: Section[];
}

const EMPTY: BlogFormData = {
  slug: "", title: "", excerpt: "", category: "", tags: [],
  authorName: "", authorRole: "", authorAvatar: "",
  date: new Date().toISOString().split("T")[0], readingTime: 5,
  image: "", featured: false, published: true,
  sections: [{ heading: "", body: "" }],
};

const CATEGORIES = [
  "Market Trends", "Investment Tips", "Buyer's Guide",
  "Interior Design", "Legal & Finance", "Company News",
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const inputCls = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal/50 focus:border-teal outline-none transition bg-white";
const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

export default function BlogForm({
  initial,
  blogId,
}: {
  initial?: Partial<BlogFormData>;
  blogId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!blogId;
  const [form, setForm] = useState<BlogFormData>({ ...EMPTY, ...initial });
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof BlogFormData>(k: K, v: BlogFormData[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    if (!isEdit && !form.slug) {
      set("slug", slugify(title));
    }
  }

  function updateSection(idx: number, field: keyof Section, val: string) {
    const updated = [...form.sections];
    updated[idx] = { ...updated[idx], [field]: val };
    set("sections", updated);
  }

  function addSection() {
    set("sections", [...form.sections, { heading: "", body: "" }]);
  }

  function removeSection(idx: number) {
    if (form.sections.length <= 1) return;
    set("sections", form.sections.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        ...form,
        tags: form.tags.filter(Boolean),
        date: new Date(form.date).toISOString(),
        sections: form.sections.filter((s) => s.heading || s.body),
      };
      if (isEdit) {
        await api.put(`/blogs/admin/${blogId}`, body);
        toast("success", "Blog post updated successfully");
      } else {
        await api.post("/blogs/admin", body);
        toast("success", "Blog post created successfully");
      }
      router.push("/admin/blogs");
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Failed to save blog post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-900 font-heading">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title *</label>
            <input
              required
              title="Blog post title"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input
              required
              title="URL slug"
              pattern="^[a-z0-9-]+$"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className={inputCls}
              placeholder="my-blog-post"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Excerpt *</label>
          <textarea
            required
            title="Excerpt"
            rows={2}
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Category *</label>
            <select
              required
              title="Category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputCls}
            >
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tags (comma-separated)</label>
            <input
              title="Tags"
              value={form.tags.join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()))}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Date *</label>
            <input required title="Publish date" type="date" value={form.date.split("T")[0]} onChange={(e) => set("date", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Reading Time (min) *</label>
            <input required title="Reading time" type="number" min={1} value={form.readingTime} onChange={(e) => set("readingTime", Number(e.target.value))} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Author */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-900 font-heading">Author</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Name *</label>
            <input required title="Author name" value={form.authorName} onChange={(e) => set("authorName", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Role *</label>
            <input required title="Author role" value={form.authorRole} onChange={(e) => set("authorRole", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Avatar URL</label>
            <input title="Author avatar URL" value={form.authorAvatar} onChange={(e) => set("authorAvatar", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-900 font-heading">Cover Image</h3>
        <ImageUpload
          label="Cover Image *"
          value={form.image}
          onChange={(url) => set("image", url)}
          folder="blogs"
        />
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-900 font-heading">
          Content Sections
        </h3>

        {form.sections.map((sec, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">
                Section {idx + 1}
              </span>
              {form.sections.length > 1 && (
                <button
                  type="button"
                  title="Remove section"
                  onClick={() => removeSection(idx)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <input
              value={sec.heading}
              onChange={(e) => updateSection(idx, "heading", e.target.value)}
              placeholder="Section heading"
              className={inputCls}
            />
            <textarea
              rows={4}
              value={sec.body}
              onChange={(e) => updateSection(idx, "body", e.target.value)}
              placeholder="Section body…"
              className={inputCls}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal/80 font-medium transition"
        >
          <Plus size={16} />
          Add Section
        </button>
      </div>

      {/* Flags */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded border-gray-300 text-teal focus:ring-teal w-4 h-4" />
            Featured Post
          </label>
          <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="rounded border-gray-300 text-teal focus:ring-teal w-4 h-4" />
            Published
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal/90 transition disabled:opacity-60 shadow-sm"
        >
          {submitting ? "Saving…" : isEdit ? "Update Blog Post" : "Create Blog Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
