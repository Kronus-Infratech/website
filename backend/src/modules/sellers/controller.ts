import type { Request, Response } from "express";
import { ok, created } from "../../lib/apiResponse.js";
import * as sellerService from "./service.js";

// Extend Express Request to include user property
declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

// ─── SELLER PROFILE ───

export async function getProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const profile = await sellerService.getSellerProfile(userId);
    return ok(res, "Profile retrieved", profile);
}

// ─── SELLER LISTINGS ───

export async function createListing(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const listing = await sellerService.createListing(userId, req.body);
    return created(res, "Listing created successfully", listing);
}

export async function getMyListings(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const listings = await sellerService.getSellerListings(userId);
    return ok(res, "Listings retrieved", listings);
}

export async function getListing(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const listing = await sellerService.getListing(String(req.params.id), userId);
    return ok(res, "Listing retrieved", listing);
}

export async function updateListing(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const listing = await sellerService.updateListing(String(req.params.id), userId, req.body);
    return ok(res, "Listing updated successfully", listing);
}

export async function deleteListing(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await sellerService.deleteListing(String(req.params.id), userId);
    return ok(res, "Listing deleted successfully");
}

// ─── ADMIN SELLER APPROVAL ───

export async function approveSeller(req: Request, res: Response) {
    const { sellerId, approve, rejectionReason } = req.body;
    const updated = await sellerService.approveSeller(sellerId, !approve, rejectionReason);
    return ok(res, `Seller ${approve ? "approved" : "rejected"} successfully`, updated);
}

export async function getPendingSellers(_req: Request, res: Response) {
    const sellers = await sellerService.getPendingSellers();
    return ok(res, "Pending sellers retrieved", sellers);
}

export async function getAllSellers(req: Request, res: Response) {
    const status = req.query.status as string | undefined;
    const sellers = await sellerService.getAllSellers(status);
    return ok(res, "Sellers retrieved", sellers);
}

// ─── ADMIN LISTING APPROVAL ───

export async function approveListing(req: Request, res: Response) {
    const { listingId, approve, rejectionReason } = req.body;
    const updated = await sellerService.approveListing(listingId, !approve, rejectionReason);
    return ok(res, `Listing ${approve ? "approved" : "rejected"} successfully`, updated);
}

export async function getPendingListings(_req: Request, res: Response) {
    const listings = await sellerService.getPendingListings();
    return ok(res, "Pending listings retrieved", listings);
}

export async function getAllListings(req: Request, res: Response) {
    const status = req.query.status as string | undefined;
    const listings = await sellerService.getAllListings(status);
    return ok(res, "Listings retrieved", listings);
}
