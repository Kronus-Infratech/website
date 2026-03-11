/**
 * Database seed script — populates blog posts, website projects, and an admin user.
 * Run: npx prisma db seed
 */

import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

// ─── Admin user ───

const ADMIN_USER = {
  email: "admin@kronusinfra.org",
  password: "Admin@123456",
  name: "Kronus Admin",
  phone: "+919876543210",
  roles: ["ADMIN" as const],
  isActive: true,
};

// ─── Website Projects ───

const PROJECTS = [
  {
    slug: "kronus-heritage-residences",
    title: "Kronus Heritage Residences",
    type: "Residential",
    status: "Ready to Move",
    price: "₹1.2 Cr",
    priceNumeric: 12000000,
    area: "1,850 sq.ft",
    areaNumeric: 1850,
    bedrooms: 3,
    bathrooms: 3,
    location: "Sonipat, Haryana",
    locality: "Sector 12, Sonipat",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    featured: true,
    amenities: ["Swimming Pool", "Gym", "Club House", "24/7 Security", "Power Backup"],
    description: "Premium 3BHK apartments with world-class amenities and timeless design.",
    published: true,
  },
  {
    slug: "kronus-skyline-towers",
    title: "Kronus Skyline Towers",
    type: "Penthouse",
    status: "Under Construction",
    price: "₹2.8 Cr",
    priceNumeric: 28000000,
    area: "3,200 sq.ft",
    areaNumeric: 3200,
    bedrooms: 4,
    bathrooms: 4,
    location: "Sonipat, Haryana",
    locality: "GT Road, Sonipat",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    ],
    featured: true,
    amenities: ["Rooftop Lounge", "Private Elevator", "Smart Home", "Concierge", "Helipad Access"],
    description: "Ultra-luxury penthouses redefining the skyline of Sonipat with panoramic views.",
    published: true,
  },
  {
    slug: "kronus-green-valley-villas",
    title: "Kronus Green Valley Villas",
    type: "Villa",
    status: "Ready to Move",
    price: "₹3.5 Cr",
    priceNumeric: 35000000,
    area: "4,500 sq.ft",
    areaNumeric: 4500,
    bedrooms: 5,
    bathrooms: 5,
    location: "Sonipat, Haryana",
    locality: "Kundli, Sonipat",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    ],
    featured: true,
    amenities: ["Private Garden", "Swimming Pool", "Home Theater", "Modular Kitchen", "Vastu Compliant"],
    description: "Sprawling villas nestled in greenery, designed for those who seek exclusivity.",
    published: true,
  },
  {
    slug: "kronus-business-hub",
    title: "Kronus Business Hub",
    type: "Commercial",
    status: "Under Construction",
    price: "₹85 Lac",
    priceNumeric: 8500000,
    area: "1,200 sq.ft",
    areaNumeric: 1200,
    bedrooms: 0,
    bathrooms: 2,
    location: "Sonipat, Haryana",
    locality: "Rajiv Chowk, Sonipat",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    ],
    featured: false,
    amenities: ["High-speed Elevator", "Central AC", "Ample Parking", "Food Court", "Conference Room"],
    description: "State-of-the-art commercial spaces designed for modern businesses.",
    published: true,
  },
  {
    slug: "kronus-prime-plots",
    title: "Kronus Prime Plots",
    type: "Plot",
    status: "Ready to Move",
    price: "₹45 Lac",
    priceNumeric: 4500000,
    area: "250 sq.yd",
    areaNumeric: 250,
    bedrooms: 0,
    bathrooms: 0,
    location: "Sonipat, Haryana",
    locality: "Murthal Road, Sonipat",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    ],
    featured: false,
    amenities: ["Gated Community", "Wide Roads", "Park Facing", "Water Supply", "Electricity"],
    description: "Premium residential plots in a gated community with excellent connectivity.",
    published: true,
  },
  {
    slug: "kronus-luxe-apartments",
    title: "Kronus Luxe Apartments",
    type: "Residential",
    status: "Upcoming",
    price: "₹95 Lac",
    priceNumeric: 9500000,
    area: "1,450 sq.ft",
    areaNumeric: 1450,
    bedrooms: 2,
    bathrooms: 2,
    location: "Sonipat, Haryana",
    locality: "Sector 7, Sonipat",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
    featured: true,
    amenities: ["Landscaped Garden", "Jogging Track", "Kids Play Area", "Yoga Deck", "EV Charging"],
    description: "Thoughtfully designed 2BHK luxury apartments with modern-day amenities.",
    published: true,
  },
];

// ─── Blog Posts ───

const AUTHORS = {
  anuraj: { name: "Anuraj Antil", role: "Founder & Managing Director", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  siddharth: { name: "Siddharth Chahal", role: "Head of Architecture", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
  sukhdeep: { name: "Sukhdeep Singh", role: "Chief Engineer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  yuvraj: { name: "Yuvraj Tomar", role: "Customer Relations", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
};

const BLOG_POSTS = [
  {
    slug: "why-sonipat-is-next-big-real-estate-destination",
    title: "Why Sonipat Is the Next Big Real Estate Destination",
    excerpt: "With Delhi bursting at the seams and Gurugram prices touching the sky, smart investors are looking north. Here's why Sonipat deserves your attention in 2025.",
    category: "Market Insights",
    tags: ["Sonipat", "Investment", "Real Estate Trends", "Haryana"],
    authorName: AUTHORS.anuraj.name,
    authorRole: AUTHORS.anuraj.role,
    authorAvatar: AUTHORS.anuraj.avatar,
    date: new Date("2025-02-18"),
    readingTime: 7,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    featured: true,
    published: true,
    sections: [
      { heading: "The Delhi Spillover Effect", body: "Delhi's residential market has been saturated for years. With property prices crossing ₹15,000 per square foot in most liveable areas, the middle class is being pushed outward. Gurugram absorbed the first wave; Noida took the second. Now, the third wave is heading north — to Sonipat. The city sits just 40 km from Connaught Place, connected by NH-44 (the old GT Road), the Kundli–Manesar–Palwal Expressway, and a proposed metro extension. For a fraction of Delhi's cost, you get larger homes, cleaner air, and a community that still knows its neighbours." },
      { heading: "Infrastructure That's Actually Happening", body: "Unlike speculative boom towns, Sonipat's infrastructure isn't just on paper. The KMP Expressway is operational, cutting travel to Gurugram to under an hour. The Kundli Industrial Township is creating thousands of jobs. A multi-modal logistics hub is under construction near Rai. The state government has earmarked Sonipat as a priority district under the Haryana Comprehensive Development Plan 2031. Add the upcoming Delhi Metro Phase IV extension and a proposed RRTS corridor, and you have a city that's being wired for exponential growth." },
      { heading: "Price Advantage That Won't Last", body: "Today, you can buy a premium 3BHK apartment in Sonipat for ₹50–80 lakh. The same configuration in Dwarka costs ₹1.8 Cr+, and in Gurugram, ₹1.2 Cr+. Land prices in Sonipat have appreciated 12–18% annually over the last three years. The window of affordable entry is narrowing. Investors who entered Gurugram in 2010 at ₹3,000/sq.ft are sitting on ₹12,000+/sq.ft assets today. Sonipat in 2025 mirrors Gurugram in 2010 — and the numbers agree." },
      { heading: "Educational & Healthcare Ecosystem", body: "Sonipat isn't just a dormitory town. It hosts some of India's finest institutions — Ashoka University, DCRUST, and a network of CBSE and international schools. The city has four major hospitals, and a 500-bed medical college is under development. Families don't just need homes; they need ecosystems. Sonipat is building one." },
      { heading: "What Kronus Sees Ahead", body: "At Kronus Infratech, we've been building in Sonipat since 2014. We've watched the city evolve from a small-town market to a real estate frontier with institutional interest. Our upcoming projects — including Kronus Heights, Sonipat's first luxury high-rise — are designed for the city Sonipat is becoming, not the one it was. If you're considering your next investment, the question isn't whether to look at Sonipat. It's whether you can afford not to." },
    ],
  },
  {
    slug: "5-things-to-check-before-buying-first-home",
    title: "5 Things to Check Before Buying Your First Home",
    excerpt: "Your first home is likely the biggest purchase you'll ever make. Don't let excitement override due diligence — here's your no-nonsense checklist.",
    category: "Buyer Guide",
    tags: ["First-time Buyer", "Checklist", "Tips", "Home Buying"],
    authorName: AUTHORS.yuvraj.name,
    authorRole: AUTHORS.yuvraj.role,
    authorAvatar: AUTHORS.yuvraj.avatar,
    date: new Date("2025-01-25"),
    readingTime: 5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    featured: true,
    published: true,
    sections: [
      { heading: "1. Verify RERA Registration — No Exceptions", body: "The Real Estate Regulatory Authority exists for one reason: to protect you. Every legitimate project in Haryana must be registered on haryanarera.gov.in. The RERA number tells you the project is approved, the builder's track record is on file, and there's a legal mechanism for grievance. If a builder can't show you a RERA number, walk away. Full stop. At Kronus, every project has been RERA-compliant since the regulation came into force — we display our registration numbers prominently on every brochure, hoarding, and website listing." },
      { heading: "2. Visit the Actual Site, Not Just the Model Flat", body: "Model flats are designed to sell. They have perfect lighting, curated furniture, and zero context about the actual neighbourhood. Always visit the construction site. Walk around the locality at different times of day. Check the approach road, the nearest market, water supply consistency, and how the building faces the sun. At Kronus projects, we encourage site visits at any stage — even during active construction. We want you to see the steel, the concrete, and the care that goes into every floor." },
      { heading: "3. Understand the Total Cost, Not Just the Base Price", body: "The advertised price is never the final cost. Ask about: GST (5% for under-construction, exempt for ready-to-move), stamp duty (varies by state; Haryana charges 5–7%), registration charges, maintenance deposits, parking charges, club membership, and preferential location charges (PLC) for corner units or higher floors. A ₹50 lakh apartment can easily become ₹58–60 lakh with these additions. Transparent builders will give you a complete cost sheet upfront. If they don't, insist on one in writing." },
      { heading: "4. Check the Builder's Delivery Track Record", body: "Past performance is the best predictor of future delivery. Ask how many projects the builder has completed, whether they were delivered on time, and if possible, speak to existing residents. Online forums, Google reviews, and local real estate groups on Facebook are surprisingly honest. Kronus Infratech has delivered every project either on time or ahead of schedule since 2014 — and we're happy to connect you with families who've lived in our homes for years." },
      { heading: "5. Get Your Loan Pre-Approved Before You Commit", body: "A pre-approved home loan tells you exactly what you can afford. It also gives you negotiating power — builders take pre-approved buyers more seriously. Compare rates across at least three banks. Today's best rates hover around 8.5–9% for salaried individuals. Don't stretch beyond 40% of your monthly income for EMI. And remember: the cheapest EMI isn't always the best deal. Read the fine print on processing fees, prepayment penalties, and floating-to-fixed conversion clauses." },
    ],
  },
  {
    slug: "rera-explained-complete-guide-safe-property-investment",
    title: "RERA Explained: Your Complete Guide to Safe Property Investment",
    excerpt: "RERA changed Indian real estate forever. But most buyers still don't know how to use it. Here's everything you need to know — in plain language.",
    category: "Legal & Compliance",
    tags: ["RERA", "Legal", "Compliance", "Buyer Protection"],
    authorName: AUTHORS.anuraj.name,
    authorRole: AUTHORS.anuraj.role,
    authorAvatar: AUTHORS.anuraj.avatar,
    date: new Date("2025-01-10"),
    readingTime: 8,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80",
    featured: false,
    published: true,
    sections: [
      { heading: "What Is RERA and Why Does It Exist?", body: "The Real Estate (Regulation and Development) Act, 2016 was India's first comprehensive legislation to regulate the real estate sector. Before RERA, builders operated with minimal accountability. Delays of 5–10 years were common. Money collected for one project was diverted to start another. Buyers had no standardised complaint mechanism. RERA changed this by creating state-level regulatory authorities with the power to penalise, de-register, and even imprison non-compliant builders. It mandates that 70% of project funds be kept in a dedicated escrow account, projects be delivered within the promised timeline, and carpet area (not super built-up area) be the basis of pricing." },
      { heading: "How to Verify a Project's RERA Status", body: "Every state has a RERA website. For Haryana, visit haryanarera.gov.in. You can search by project name, builder name, or RERA registration number. The portal shows: project details, approved layout plans, completion timeline, builder's other registered projects, and any complaints filed. If a project isn't on the portal, it either hasn't been registered (illegal for marketing) or the registration has lapsed. Never invest in an unregistered project, regardless of how good the deal looks." },
      { heading: "Your Rights as a Buyer Under RERA", body: "RERA grants you several powerful rights: the right to know the exact stage of construction, the right to a refund with interest if the project is delayed beyond the promised date, the right to demand structural defect repairs for up to 5 years after possession, and the right to file a complaint online without needing a lawyer. The interest rate for delays is typically the SBI MCLR rate plus 2% — currently around 10.5%. This means delayed projects become expensive for builders, creating a strong incentive for on-time delivery." },
      { heading: "Common RERA Myths Debunked", body: "Myth: 'RERA only protects apartment buyers.' Fact: RERA covers plots, villas, and commercial properties too. Myth: 'Resale properties are covered under RERA.' Fact: RERA only covers new sales from builders; resale transactions between individuals are not regulated. Myth: 'RERA guarantees the quality of construction.' Fact: RERA mandates structural defect liability for 5 years, but it doesn't prescribe construction standards — that's covered by local building codes and BIS standards. Myth: 'All states implement RERA the same way.' Fact: Each state has its own rules. Haryana's implementation has been among the stricter ones, which is good news for buyers here." },
      { heading: "How Kronus Goes Beyond RERA", body: "At Kronus Infratech, RERA compliance is the floor, not the ceiling. We maintain 85% of project funds in escrow (against the mandated 70%). We publish quarterly construction progress updates. We use ISI-certified materials tracked through a digital quality management system. Every project undergoes 40+ quality checkpoints per floor. And we offer a 2-year post-possession maintenance guarantee — twice the industry norm. Because trust isn't built by meeting minimum standards; it's built by exceeding them." },
    ],
  },
  {
    slug: "vastu-shastra-modern-homes-science-or-tradition",
    title: "Vastu Shastra for Modern Homes: Science or Tradition?",
    excerpt: "Vastu isn't about superstition — it's about orientation, ventilation, and light. Here's how we integrate ancient wisdom into contemporary architecture.",
    category: "Design & Lifestyle",
    tags: ["Vastu", "Architecture", "Design", "Lifestyle"],
    authorName: AUTHORS.siddharth.name,
    authorRole: AUTHORS.siddharth.role,
    authorAvatar: AUTHORS.siddharth.avatar,
    date: new Date("2024-12-15"),
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    featured: true,
    published: true,
    sections: [
      { heading: "The Science Behind the Tradition", body: "Vastu Shastra, literally 'the science of architecture,' dates back over 5,000 years to the Vedic period. Stripped of mysticism, its principles are surprisingly rational. The prescription for an east-facing entrance maximises morning sunlight — the richest source of Vitamin D and a natural disinfectant. The kitchen in the southeast aligns with the direction of maximum solar heat gain, keeping cooking spaces warm naturally. The master bedroom in the southwest, away from the afternoon sun, stays cooler. These aren't arbitrary rules — they're observations about climate, light, and airflow codified into a design system before the word 'architecture' existed." },
      { heading: "Where Vastu Meets Modern Architecture", body: "The challenge for contemporary architects is reconciling Vastu with modern lifestyle requirements. Open-plan living rooms, home offices, rooftop gardens, and basement parking — none of these existed in Vedic times. At Kronus, our design team approaches Vastu as a set of guiding principles rather than rigid commandments. We optimise for natural light and cross-ventilation first, then map the layout to Vastu directional preferences. The result: homes that feel intuitively comfortable, even if you've never heard of Vastu." },
      { heading: "Practical Vastu Tips for Any Home", body: "Even if you're not building from scratch, small changes can improve your living space. Keep the northeast corner of your home clutter-free and well-lit — this area benefits from morning sun and good ventilation. Avoid placing mirrors opposite the bed (they reflect light and can disturb sleep). Ensure your main door opens inward and clockwise — this is less about energy and more about creating a welcoming, spacious entry. Plants in the east or north enhance air quality where light is abundant. These are sensible design choices dressed in traditional language." },
      { heading: "What Buyers in Sonipat Want", body: "In our experience, over 70% of homebuyers in Sonipat and wider Haryana prioritise Vastu compliance. This isn't superstition — it's cultural identity. Families want homes that honour their values. We've learned that the best approach isn't to dismiss Vastu or treat it as an afterthought. It's to start with Vastu as the blueprint's foundation, then layer modern amenities on top. Every Kronus project is designed Vastu-first, and we publish the directional alignment of every unit in our brochures." },
    ],
  },
  {
    slug: "rise-of-gated-townships-haryana",
    title: "The Rise of Gated Townships in Haryana",
    excerpt: "From individual plots to integrated townships — Haryana's real estate is evolving. Here's what's driving the shift and what it means for you.",
    category: "Market Insights",
    tags: ["Township", "Haryana", "Gated Community", "Trends"],
    authorName: AUTHORS.anuraj.name,
    authorRole: AUTHORS.anuraj.role,
    authorAvatar: AUTHORS.anuraj.avatar,
    date: new Date("2024-11-20"),
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    featured: false,
    published: true,
    sections: [
      { heading: "From Standalone to Integrated", body: "A decade ago, buying property in Haryana meant purchasing a plot and hiring a contractor. The result was a patchwork of individually designed houses with no common infrastructure, inconsistent road widths, and zero community amenities. Today, gated townships are rewriting this narrative. A modern township bundles 200–500 homes with parks, schools, shopping, security, water treatment, and power backup into a single masterplanned community. It's not just a home — it's a self-contained neighbourhood." },
      { heading: "Why Families Are Choosing Townships", body: "Safety is the number one driver. Gated communities with 24/7 security, CCTV surveillance, and controlled access give families — especially those with young children and elderly parents — peace of mind that standalone houses simply can't match. Beyond safety, it's the lifestyle: jogging tracks, swimming pools, yoga decks, community halls for festivals, and playgrounds within walking distance. In a township, your child can cycle to a friend's house without crossing a single public road." },
      { heading: "The Economics Make Sense", body: "Buying into a township often costs less per square foot than building independently — because the developer negotiates bulk rates on materials, hires dedicated construction crews, and spreads infrastructure costs across hundreds of units. Maintenance, too, is cheaper when shared. A standalone house might spend ₹5,000/month on a security guard alone. In a township, the same cost split across 300 families drops to ₹200/month per family while providing 10x the coverage." },
      { heading: "Kronus Township: A Case Study", body: "Our flagship gated township in Sonipat spans 20 acres and serves 300+ families. It includes two parks, a temple, a commercial block, a dedicated school zone, EV charging stations, and a 2,000-tree green belt. The approach road was widened to 40 feet before a single foundation was laid. Rainwater harvesting recharges three borewells. Solar panels on community buildings offset 30% of common area electricity. This isn't luxury for luxury's sake — it's infrastructure that makes daily life easier." },
    ],
  },
  {
    slug: "home-loan-101-interest-rates-emi-guide",
    title: "Home Loan 101: Interest Rates, EMI and Everything You Need",
    excerpt: "Confused by home loan jargon? Fixed vs floating, MCLR vs repo-linked, pre-EMI vs full EMI — we break it all down with real numbers.",
    category: "Finance",
    tags: ["Home Loan", "EMI", "Finance", "Interest Rates", "Banking"],
    authorName: AUTHORS.yuvraj.name,
    authorRole: AUTHORS.yuvraj.role,
    authorAvatar: AUTHORS.yuvraj.avatar,
    date: new Date("2024-10-30"),
    readingTime: 9,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    featured: false,
    published: true,
    sections: [
      { heading: "Fixed vs Floating: Which Rate Should You Choose?", body: "Fixed rates stay the same throughout the tenure — you pay ₹X every month, no surprises. Floating rates change with the market — they start lower but can increase. In India, most 'fixed' rates are actually fixed for 2–3 years, then convert to floating. True fixed-rate loans are rare and come with a 0.5–1% premium. Our recommendation: in a rising interest rate environment, lock in a fixed rate for the first 3–5 years. In a falling rate environment, go floating from day one. As of 2025, the RBI repo rate is relatively stable, making floating rates the more popular choice at 8.5–9% for salaried borrowers." },
      { heading: "Understanding EMI: The Math That Matters", body: "EMI (Equated Monthly Installment) is calculated using three variables: principal (loan amount), interest rate, and tenure (in months). For a ₹50 lakh loan at 8.75% for 20 years, your EMI would be approximately ₹44,200/month. Over 20 years, you'll repay ₹1.06 Cr — meaning you pay ₹56 lakh in interest alone. By increasing tenure to 25 years, EMI drops to ₹41,400 but total interest paid jumps to ₹74 lakh. The sweet spot for most borrowers is 15–20 years. Shorter tenures save lakhs in interest; longer tenures improve monthly cash flow." },
      { heading: "Pre-EMI vs Full EMI for Under-Construction Properties", body: "When you buy an under-construction property, the bank disburses the loan in stages linked to construction progress. During this phase, you can choose to pay either pre-EMI (interest-only payments on the disbursed amount) or full EMI (principal + interest from day one). Pre-EMI is lighter on your wallet during construction but doesn't reduce your principal — meaning you pay more interest over the loan's lifetime. Full EMI starts higher but begins chipping away at the principal immediately. If you can afford it, full EMI saves significant money long-term." },
      { heading: "Documents You'll Need", body: "For salaried individuals: identity proof (Aadhaar + PAN), address proof, last 6 months' salary slips, Form 16 / ITR for the last 2 years, last 6 months' bank statements showing salary credits, and property documents (agreement, allotment letter, builder NOC, approved plan). For self-employed individuals: the same identity/address proofs plus ITR for 3 years, audited financial statements, business proof (GST registration, partnership deed), and a CA certificate. Pro tip: get your documents in order before approaching the bank — it speeds up approval by 2–3 weeks." },
      { heading: "How Kronus Helps With Home Loans", body: "We've partnered with SBI, HDFC, ICICI, and Axis Bank to offer pre-approved loan facilities for all Kronus projects. Our customer relations team will help you compare offers, prepare documents, and liaise with the bank. Many of our buyers have gone from first enquiry to loan sanction in under 10 working days. We don't charge any brokerage or processing assistance fee — this is part of the Kronus buying experience." },
    ],
  },
  {
    slug: "why-rcc-construction-matters",
    title: "Why RCC Construction Matters More Than You Think",
    excerpt: "Behind every wall is a decision — brick or RCC? Load-bearing or framed? Here's why structural choices determine how long your home actually lasts.",
    category: "Construction",
    tags: ["RCC", "Construction", "Engineering", "Quality", "Safety"],
    authorName: AUTHORS.sukhdeep.name,
    authorRole: AUTHORS.sukhdeep.role,
    authorAvatar: AUTHORS.sukhdeep.avatar,
    date: new Date("2024-10-05"),
    readingTime: 7,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
    featured: false,
    published: true,
    sections: [
      { heading: "What Is RCC and Why Should You Care?", body: "RCC stands for Reinforced Cement Concrete — a composite of concrete (cement, sand, aggregate, water) and steel reinforcement bars (rebar). The concrete handles compression (pushing forces), while the steel handles tension (pulling forces). Together, they create a structural system that resists earthquakes, wind loads, and the weight of the building itself. Why does this matter to you? Because load-bearing brick construction — still common in many parts of Haryana — has a structural lifespan of 30–40 years. A well-built RCC frame lasts 75–100 years. Your grandchildren will inherit the structure, not just the property papers." },
      { heading: "The 40-Point Quality Checklist", body: "At Kronus, every floor of every building passes through 40+ quality checkpoints before the next floor is cast. These include: rebar diameter verification, cover block placement (to prevent corrosion), concrete slump testing (for workability), cube testing (for compressive strength at 7 and 28 days), plumb bob checks for column verticality, and waterproofing membrane integrity tests. We use only ISI-certified TMT steel (Fe-500D grade) and OPC-53 grade cement. Every batch of concrete is tested on-site using a calibrated slump cone. If a batch fails, it's rejected — no exceptions, no rework." },
      { heading: "Earthquake Resistance: Not Optional in Sonipat", body: "Sonipat falls in Seismic Zone IV on the BIS map — the second-highest risk category. This means buildings must be designed to withstand moderate to severe earthquakes. RCC framed structures, when designed per IS 13920 (ductile detailing), perform significantly better than load-bearing structures in seismic events. The key is ductility — the ability to deform without collapsing. Our structural designs include shear walls, proper beam-column joints with 135° hooks, and lap lengths that exceed code minimums by 15%. When the ground shakes, a Kronus building bends. It doesn't break." },
      { heading: "What Corners Look Like When They're Cut", body: "Low-quality construction isn't always visible. Common shortcuts include: using thinner rebar (8mm instead of 12mm), reducing cement content in concrete (saving ₹50/bag but halving strength), skipping waterproofing in bathrooms and terraces, using river sand instead of manufactured sand (inconsistent grading), and curing concrete for 3 days instead of the mandated 14. These savings amount to maybe ₹200–300 per square foot for the builder — and decades of reduced structural life for the buyer. Ask your builder for material test certificates. If they hesitate, you have your answer." },
    ],
  },
  {
    slug: "investing-plots-vs-apartments-2025",
    title: "Investing in Plots vs Apartments: What Works in 2025?",
    excerpt: "Plots offer freedom; apartments offer convenience. But which gives better returns? We crunch the numbers for Sonipat's market.",
    category: "Investment",
    tags: ["Plots", "Apartments", "Investment", "Returns", "Comparison"],
    authorName: AUTHORS.anuraj.name,
    authorRole: AUTHORS.anuraj.role,
    authorAvatar: AUTHORS.anuraj.avatar,
    date: new Date("2024-09-15"),
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    featured: false,
    published: true,
    sections: [
      { heading: "The Plot Proposition", body: "Plots are pure land — no construction, no depreciation, no maintenance. In Sonipat, a 200 sq.yd plot in a gated community costs ₹30–50 lakh depending on location. Historically, land in developing cities appreciates 10–15% annually, outpacing constructed property. Plots also give you the freedom to build what you want, when you want. The downsides: you can't live in a plot immediately, banks offer lower LTV (loan-to-value) ratios for plots (60–70% vs 80–90% for apartments), and you need to monitor the land to prevent encroachment." },
      { heading: "The Apartment Advantage", body: "Apartments are ready ecosystems. You move in, plug in your appliances, and start living. For end-users — especially young professionals and nuclear families — apartments make more sense. They come with shared amenities (gym, pool, security) that would cost a fortune to build independently. In Sonipat's apartment market, a 3BHK in a premium project costs ₹50–85 lakh. Annual appreciation in good projects is 8–12%. The downside: apartments depreciate structurally over time, monthly maintenance is non-negotiable, and you have limited control over common area decisions." },
      { heading: "Return Comparison: 5-Year Outlook", body: "Let's model a ₹50 lakh investment in both. A plot purchased at ₹50 lakh in 2025, appreciating at 12% annually, would be worth approximately ₹88 lakh by 2030. An apartment purchased at ₹50 lakh, appreciating at 9% annually (net of maintenance and depreciation), would be worth approximately ₹77 lakh — but would have also generated rental income of ₹12,000–15,000/month (₹7.2–9 lakh over 5 years). Net result: plots win on pure capital gains; apartments win when you factor in rental yield. Your decision depends on whether you need the asset to generate cash flow or simply grow in value." },
      { heading: "What Kronus Recommends", body: "Honestly? It depends on where you are in life. If you're 28, building savings, and planning to construct in 5–7 years, buy a plot in a gated community — the appreciation will fund a significant chunk of your construction cost. If you're 35 with a family and need a home now, buy an apartment with good construction quality and genuine amenities. And if your budget allows, do both — a plot for wealth creation and an apartment for living. At Kronus, we offer both, and our team can help you build a portfolio that balances growth with livability." },
    ],
  },
];

// ─── Main seed function ───

async function main() {
  console.log("🌱 Seeding database...\n");

  // 1. Upsert admin user in websiteUser table
  const passwordHash = await bcrypt.hash(ADMIN_USER.password, SALT_ROUNDS);
  const admin = await prisma.websiteUser.upsert({
    where: { email: ADMIN_USER.email },
    update: { passwordHash, name: ADMIN_USER.name, roles: ADMIN_USER.roles, isActive: true },
    create: {
      email: ADMIN_USER.email,
      passwordHash,
      name: ADMIN_USER.name,
      phone: ADMIN_USER.phone,
      roles: ADMIN_USER.roles,
      isActive: true,
      isEmailVerified: true,
    },
  });
  console.log(`✅ Admin user: ${admin.email} (id: ${admin.id})`);

  // 2. Seed website projects (upsert by slug)
  let projectCount = 0;
  for (const p of PROJECTS) {
    await prisma.websiteProject.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    projectCount++;
  }
  console.log(`✅ Website projects: ${projectCount} upserted`);

  // 3. Seed blog posts (upsert by slug)
  let blogCount = 0;
  for (const b of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
    blogCount++;
  }
  console.log(`✅ Blog posts: ${blogCount} upserted`);

  // 4. Seed a sample newsletter subscriber
  await prisma.newsletterSubscriber.upsert({
    where: { email: "demo@kronusinfra.org" },
    update: {},
    create: { email: "demo@kronusinfra.org", isActive: true },
  });
  console.log(`✅ Sample newsletter subscriber created`);

  console.log("\n🎉 Seed complete!");
  console.log(`   Admin login: ${ADMIN_USER.email} / ${ADMIN_USER.password}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
