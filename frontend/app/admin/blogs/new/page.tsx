"use client";

import BlogForm from "../components/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 font-heading">
        New Blog Post
      </h1>
      <BlogForm />
    </div>
  );
}
