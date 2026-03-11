import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { requireWebUser } from "../../middleware/requireWebUser.js";
import * as ctrl from "./controller.js";
import { updateProfileSchema, bookmarkSchema, listBookmarksSchema } from "./schema.js";

const router = Router();

// All user routes require authentication
router.use(requireWebUser);

// Profile
router.get("/profile", asyncHandler(ctrl.getProfile));
router.patch("/profile", validate({ body: updateProfileSchema }), asyncHandler(ctrl.updateProfile));

// Bookmarks
router.get("/bookmarks", validate({ query: listBookmarksSchema }), asyncHandler(ctrl.listBookmarks));
router.post("/bookmarks", validate({ body: bookmarkSchema }), asyncHandler(ctrl.addBookmark));
router.get("/bookmarks/:inventoryItemId", asyncHandler(ctrl.checkBookmark));
router.delete("/bookmarks/:inventoryItemId", asyncHandler(ctrl.removeBookmark));

// Site visits
router.get("/site-visits", asyncHandler(ctrl.listSiteVisits));

// Documents
router.get("/documents", asyncHandler(ctrl.listDocuments));
router.delete("/documents/:id", asyncHandler(ctrl.deleteDocument));

export default router;
