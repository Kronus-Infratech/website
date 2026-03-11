import type { MetadataRoute } from "next";
import { fetchProjects, fetchBlogPosts } from "@/lib/fetchers";

const BASE_URL = "https://kronusinfra.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic project pages
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await fetchProjects();
    projectRoutes = projects.map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // API unavailable during build — skip dynamic routes
  }

  // Dynamic blog pages
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await fetchBlogPosts();
    blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blogs/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // API unavailable during build — skip dynamic routes
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
