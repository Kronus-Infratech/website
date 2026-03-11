"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import ProjectForm, { type ProjectFormData } from "../../components/ProjectForm";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<ProjectFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ProjectFormData>(`/projects/admin/list?limit=50`)
      .then((res) => {
        const all = (res.data ?? []) as Record<string, unknown>[];
        const project = all.find((p) => p.id === id);
        if (project) {
          setInitial({
            slug: (project.slug as string) ?? "",
            title: (project.title as string) ?? "",
            type: (project.type as string) ?? "",
            status: (project.status as string) ?? "",
            price: (project.price as string) ?? "",
            priceNumeric: (project.priceNumeric as number) ?? 0,
            area: (project.area as string) ?? "",
            areaNumeric: (project.areaNumeric as number) ?? 0,
            bedrooms: (project.bedrooms as number) ?? 0,
            bathrooms: (project.bathrooms as number) ?? 0,
            location: (project.location as string) ?? "",
            locality: (project.locality as string) ?? "",
            image: (project.image as string) ?? "",
            images: (project.images as string[]) ?? [],
            featured: (project.featured as boolean) ?? false,
            amenities: (project.amenities as string[]) ?? [],
            description: (project.description as string) ?? "",
            published: (project.published as boolean) ?? true,
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
        <p className="text-gray-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 font-heading">
        Edit Project
      </h1>
      <ProjectForm initial={initial} projectId={id} />
    </div>
  );
}
