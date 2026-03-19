import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { requireWebUser } from "../../middleware/requireWebUser.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import * as ctrl from "./controller.js";
import {
    createSellerListingSchema,
    updateSellerListingSchema,
    approveSellerListingSchema,
    approveSellerSchema,
} from "./schema.js";

const router = Router();

// ─── SELLER ROUTES ───

// Get seller profile
router.get("/profile", requireWebUser, asyncHandler(ctrl.getProfile));

// Seller listings
router.post(
    "/listings",
    requireWebUser,
    validate({ body: createSellerListingSchema }),
    asyncHandler(ctrl.createListing)
);
router.get("/listings", requireWebUser, asyncHandler(ctrl.getMyListings));
router.get("/listings/:id", requireWebUser, asyncHandler(ctrl.getListing));
router.patch(
    "/listings/:id",
    requireWebUser,
    validate({ body: updateSellerListingSchema }),
    asyncHandler(ctrl.updateListing)
);
router.delete("/listings/:id", requireWebUser, asyncHandler(ctrl.deleteListing));

// ─── ADMIN ROUTES ───

// Seller management
router.get("/admin/sellers/pending", requireAdmin, asyncHandler(ctrl.getPendingSellers));
router.get("/admin/sellers", requireAdmin, asyncHandler(ctrl.getAllSellers));
router.post(
    "/admin/sellers/approve",
    requireAdmin,
    validate({ body: approveSellerSchema }),
    asyncHandler(ctrl.approveSeller)
);

// Listing management
router.get("/admin/listings/pending", requireAdmin, asyncHandler(ctrl.getPendingListings));
router.get("/admin/listings", requireAdmin, asyncHandler(ctrl.getAllListings));
router.post(
    "/admin/listings/approve",
    requireAdmin,
    validate({ body: approveSellerListingSchema }),
    asyncHandler(ctrl.approveListing)
);

export default router;
