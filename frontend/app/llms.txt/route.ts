import { NextResponse } from "next/server";

export async function GET() {
  const content = `# Kronus Infratech & Consultants

> An address that outlives time — crafted for legacy in Sonipat.

## About

Kronus Infratech & Consultants is a luxury real estate developer based in Sonipat, Haryana, India. Since 2014, we have built premium residential homes, villas, commercial spaces, and plotted developments with a focus on quality craftsmanship, RERA compliance, and community-first design.

## Website

- URL: https://kronusinfra.com
- Contact: https://kronusinfra.com/contact

## Pages

### Home
- URL: https://kronusinfra.com/
- Description: Featured properties, company stats, property types, and a call-to-action to explore our projects.

### About
- URL: https://kronusinfra.com/about
- Description: Company history, milestones from 2014 to 2025, team values, and our building philosophy.

### Projects
- URL: https://kronusinfra.com/projects
- Description: Browse all residential, commercial, villa, plot, and penthouse projects. Filter by type, status, location, price, and area.

### Individual Project
- URL pattern: https://kronusinfra.com/projects/{slug}
- Description: Detailed project page with photo gallery, amenities, floor plans, pricing, location map, and enquiry form.

### Blog
- URL: https://kronusinfra.com/blogs
- Description: Real estate insights, buyer guides, market trends, RERA updates, Vastu tips, and construction deep-dives.

### Individual Blog Post
- URL pattern: https://kronusinfra.com/blogs/{slug}
- Description: Full article with sections, author info, reading time, tags, and related posts.

### Contact
- URL: https://kronusinfra.com/contact
- Description: Contact form, office address, phone numbers, email, business hours, and embedded map.

## Topics Covered

- Luxury real estate in Sonipat, Haryana
- Premium villas and residential properties
- Commercial spaces and retail developments
- Plotted developments and gated townships
- RERA-compliant construction
- Earthquake-resistant RCC frameworks
- Home buying guides for Indian buyers
- Real estate investment strategies
- Vastu Shastra in modern architecture
- Property market trends in Haryana

## Company Details

- **Name**: Kronus Infratech & Consultants
- **Founded**: 2014
- **Location**: Sonipat, Haryana, India
- **Speciality**: Luxury residential, commercial, villas, plots, penthouses
- **Families Served**: 500+
- **RERA Compliance**: 100%
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
