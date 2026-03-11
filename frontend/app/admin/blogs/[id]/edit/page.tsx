"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import BlogForm, { type BlogFormData } from "../../components/BlogForm";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<BlogFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<BlogFormData>(`/blogs/admin/list?limit=50`)
      .then((res) => {
        const all = (res.data ?? []) as Record<string, unknown>[];
        const blog = all.find((b) => b.id === id);
        if (blog) {
          const sections = (blog.sections as { heading: string; body: string }[]) ?? [];
          setInitial({
            slug: (blog.slug as string) ?? "",
            title: (blog.title as string) ?? "",
            excerpt: (blog.excerpt as string) ?? "",
            category: (blog.category as string) ?? "",
            tags: (blog.tags as string[]) ?? [],
            authorName: (blog.authorName as string) ?? "",
            authorRole: (blog.authorRole as string) ?? "",
            authorAvatar: (blog.authorAvatar as string) ?? "",
            date: blog.date ? (blog.date as string).split("T")[0] : "",
            readingTime: (blog.readingTime as number) ?? 5,
            image: (blog.image as string) ?? "",
            featured: (blog.featured as boolean) ?? false,
            published: (blog.published as boolean) ?? true,
            sections: sections.length > 0 ? sections : [{ heading: "", body: "" }],
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-teal rounded-full border-t-transparent" />
      </div>
    );
  }

  if (!initial) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Blog post not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 font-heading">
        Edit Blog Post
      </h1>
      <BlogForm initial={initial} blogId={id} />
    </div>
  );
}
