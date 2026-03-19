import { z } from "zod";

export const createSellerListingSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    propertyType: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "AGRICULTURAL"] as const),
    transactionType: z.enum(["SALE", "RENT", "LEASE"] as const),
    area: z.number().min(1, "Area must be greater than 0"),
    bedrooms: z.number().min(0).default(0),
    bathrooms: z.number().min(0).default(0),
    price: z.number().min(1, "Price must be greater than 0"),
    address: z.string().min(5, "Address required"),
    city: z.string().min(2, "City required"),
    state: z.string().min(2, "State required"),
    locality: z.string().optional(),
    pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
    amenities: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    video: z.string().optional(),
});

export const updateSellerListingSchema = createSellerListingSchema.partial();

export const approveSellerListingSchema = z.object({
    listingId: z.string().min(1, "Listing ID required"),
    approve: z.boolean(),
    rejectionReason: z.string().optional(),
});

export const approveSellerSchema = z.object({
    sellerId: z.string().min(1, "Seller ID required"),
    approve: z.boolean(),
    rejectionReason: z.string().optional(),
});
