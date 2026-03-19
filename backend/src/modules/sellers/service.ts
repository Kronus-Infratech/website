import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";

// ─────────────────────────────────────────
// SELLER PROFILE
// ─────────────────────────────────────────

export async function getSellerProfile(userId: string) {
    const profile = await prisma.sellerProfile.findUnique({
        where: { userId },
    });

    if (!profile) {
        throw AppError.notFound("Seller profile not found");
    }

    return profile;
}

// ─────────────────────────────────────────
// SELLER LISTINGS
// ─────────────────────────────────────────

export async function createListing(
    sellerId: string,
    data: {
        title: string;
        description?: string;
        propertyType: string;
        transactionType: string;
        area: number;
        bedrooms?: number;
        bathrooms?: number;
        price: number;
        pricePerUnit?: number;
        address: string;
        city?: string;
        state?: string;
        locality?: string;
        pincode?: string;
        amenities?: string[];
        images?: string[];
        video?: string;
    },
) {
    // Verify seller exists and is approved
    const seller = await prisma.sellerProfile.findUnique({
        where: { userId: sellerId },
    });

    if (!seller) {
        throw AppError.badRequest("Seller profile not found");
    }

    const listing = await prisma.sellerListing.create({
        data: {
            ...data,
            sellerId,
            status: seller.status === "APPROVED" ? "LIVE" : "PENDING_APPROVAL",
        } as any,
    });

    // Update seller listing counts
    await prisma.sellerProfile.update({
        where: { id: seller.id },
        data: { totalListings: { increment: 1 } },
    });

    return listing;
}

export async function getSellerListings(sellerId: string) {
    const listings = await prisma.sellerListing.findMany({
        where: { sellerId },
        orderBy: { createdAt: "desc" },
    });

    return listings;
}

export async function getListing(listingId: string, sellerId?: string) {
    const listing = await prisma.sellerListing.findUnique({
        where: { id: listingId },
    });

    if (!listing) {
        throw AppError.notFound("Listing not found");
    }

    if (sellerId && listing.sellerId !== sellerId) {
        throw AppError.forbidden("Not authorized to access this listing");
    }

    return listing;
}

export async function updateListing(
    listingId: string,
    sellerId: string,
    data: Partial<{
        title: string;
        description: string;
        propertyType: string;
        transactionType: string;
        area: number;
        bedrooms: number;
        bathrooms: number;
        price: number;
        pricePerUnit: number;
        address: string;
        city: string;
        state: string;
        locality: string;
        pincode: string;
        amenities: string[];
        images: string[];
        video: string;
    }>,
) {
    const listing = await getListing(listingId, sellerId);

    if (listing.status !== "PENDING_APPROVAL" && listing.status !== "REJECTED") {
        throw AppError.badRequest("Can only update pending or rejected listings");
    }

    const updated = await prisma.sellerListing.update({
        where: { id: listingId },
        data: {
            ...data,
            status: "PENDING_APPROVAL", // Resubmit for approval if rejected
        } as any,
    });

    return updated;
}

export async function deleteListing(listingId: string, sellerId: string) {
    await getListing(listingId, sellerId);

    await prisma.sellerListing.delete({
        where: { id: listingId },
    });

    // Update seller listing count
    const seller = await prisma.sellerProfile.findUnique({
        where: { userId: sellerId },
    });

    if (seller) {
        await prisma.sellerProfile.update({
            where: { id: seller.id },
            data: { totalListings: { decrement: 1 } },
        });
    }
}

// ─────────────────────────────────────────
// ADMIN SELLER APPROVAL
// ─────────────────────────────────────────

export async function approveSeller(sellerId: string, reject = false, rejectionReason?: string) {
    const seller = await prisma.sellerProfile.findUnique({
        where: { userId: sellerId },
    });

    if (!seller) {
        throw AppError.notFound("Seller not found");
    }

    const status = reject ? "REJECTED" : "APPROVED";

    const updated = await prisma.sellerProfile.update({
        where: { id: seller.id },
        data: {
            status: status as any,
            approvedAt: reject ? undefined : new Date(),
            rejectionReason: rejectionReason,
        },
    });

    return updated;
}

export async function getPendingSellers() {
    const sellers = await prisma.sellerProfile.findMany({
        where: { status: "PENDING_APPROVAL" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });

    return sellers;
}

export async function getAllSellers(status?: string) {
    const sellers = await prisma.sellerProfile.findMany({
        where: status ? { status: status as any } : {},
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return sellers;
}

// ─────────────────────────────────────────
// ADMIN LISTING APPROVAL
// ─────────────────────────────────────────

export async function approveListing(listingId: string, reject = false, rejectionReason?: string) {
    const listing = await prisma.sellerListing.findUnique({
        where: { id: listingId },
    });

    if (!listing) {
        throw AppError.notFound("Listing not found");
    }

    const status = reject ? "REJECTED" : "APPROVED";

    const updated = await prisma.sellerListing.update({
        where: { id: listingId },
        data: {
            status: status as any,
            approvedAt: reject ? undefined : new Date(),
            rejectionReason: rejectionReason,
        },
    });

    // Update seller approved listings count
    if (!reject) {
        const seller = await prisma.sellerProfile.findUnique({
            where: { id: listing.sellerId },
        });
        if (seller) {
            await prisma.sellerProfile.update({
                where: { id: seller.id },
                data: { approvedListings: { increment: 1 } },
            });
        }
    }

    return updated;
}

export async function getPendingListings() {
    const listings = await prisma.sellerListing.findMany({
        where: { status: "PENDING_APPROVAL" },
        include: {
            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });

    return listings;
}

export async function getAllListings(status?: string) {
    const listings = await prisma.sellerListing.findMany({
        where: status ? { status: status as any } : {},
        include: {
            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return listings;
}
