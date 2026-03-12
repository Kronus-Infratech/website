import type { Metadata } from "next";
import { fetchProjectBySlug } from "@/lib/fetchers";
import {
    JsonLd,
    realEstateListingLd,
    productLd,
    breadcrumbLd,
} from "@/lib/schemas";

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = await fetchProjectBySlug(slug);

    if (!project) {
        return {
            title: "Property Not Found",
            description: "The property you're looking for doesn't exist or may have been moved.",
        };
    }

    const title = `${project.title} — ${project.type} in ${project.location}`;
    const description = project.description.slice(0, 160);

    return {
        title,
        description,
        keywords: [
            project.title,
            `${project.type} in ${project.location}`,
            `${project.type} Sonipat`,
            `${project.bedrooms} BHK ${project.location}`,
            "Kronus Infratech",
            "RERA approved",
            project.status,
        ],
        openGraph: {
            title: project.title,
            description,
            type: "website",
            url: `https://kronusinfra.com/projects/${project.slug}`,
            // images: [{ url: project.image, width: 1200, height: 630, alt: project.title }],
            images: [{ url: 'https://kronusinfra.com/og-image.webp', width: 1200, height: 630, alt: project.title }]
        },
        twitter: {
            card: "summary_large_image",
            title: project.title,
            description,
            //   images: [project.image],
            images: ['https://kronusinfra.com/og-image.webp']
        },
        alternates: { canonical: `https://kronusinfra.com/projects/${project.slug}` },
    };
}

export default async function ProjectSlugLayout({ params, children }: Props) {
    const { slug } = await params;
    const project = await fetchProjectBySlug(slug);

    return (
        <>
            <JsonLd
                data={breadcrumbLd([
                    { name: "Home", url: "https://kronusinfra.com" },
                    { name: "Projects", url: "https://kronusinfra.com/projects" },
                    { name: project?.title ?? slug, url: `https://kronusinfra.com/projects/${slug}` },
                ])}
            />
            {project && (
                <>
                    <JsonLd data={realEstateListingLd(project)} />
                    <JsonLd data={productLd(project)} />
                </>
            )}
            {children}
        </>
    );
}
