import type { Metadata } from "next";
import { JsonLd, breadcrumbLd } from "@/lib/schemas";

export const metadata: Metadata = {
    title: "Projects — Premium Properties, Villas, Plots & Commercial Spaces",
    description:
        "Browse luxury residential homes, villas, commercial spaces, plots, and penthouses in Sonipat by Kronus Infratech. RERA-approved projects with transparent pricing. Filter by type, status, location & budget.",
    keywords: [
        "Kronus Infratech projects",
        "property in Sonipat",
        "luxury homes Sonipat",
        "villas Sonipat Haryana",
        "plots for sale Sonipat",
        "commercial property Sonipat",
        "penthouse Sonipat",
        "RERA approved Sonipat",
        "ready to move Sonipat",
        "under construction Sonipat",
        "buy property Haryana",
    ],
    openGraph: {
        title: "Kronus Infratech Projects — Properties in Sonipat",
        description: "Premium villas, homes, plots, and commercial spaces. RERA-approved with transparent pricing.",
        url: "https://kronusinfra.com/projects",
    },
    alternates: { canonical: "https://kronusinfra.com/projects" },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={breadcrumbLd([
                    { name: "Home", url: "https://kronusinfra.com" },
                    { name: "Projects", url: "https://kronusinfra.com/projects" },
                ])}
            />
            {children}
        </>
    );
}
