import { Router } from "express";
import multer from "multer";
import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { requireWebUser } from "../../middleware/requireWebUser.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import { AppError } from "../../lib/AppError.js";
import { created } from "../../lib/apiResponse.js";
import { uploadFile, makeStorageKey } from "../../providers/storage.js";
import * as usersService from "../users/service.js";
import type { DocumentType } from "../../../generated/prisma/index.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Only JPEG, PNG, WebP, and PDF files are allowed", 400) as any);
    }
  },
});

const router = Router();

/**
 * POST /api/upload/document
 * Upload a KYC/user document → R2 → create WebsiteUserDocument record
 */
router.post(
  "/document",
  requireWebUser,
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw AppError.badRequest("No file provided");

    const userId = req.webUser!.sub;
    const name = (req.body.name as string) || req.file.originalname;
    const type = ((req.body.type as string) || "OTHER") as DocumentType;

    const key = makeStorageKey(userId, req.file.originalname);
    const fileUrl = await uploadFile(key, req.file.buffer, req.file.mimetype);

    const doc = await usersService.addDocument(userId, {
      name,
      type,
      fileUrl,
      fileSize: req.file.size,
    });

    return created(res, "Document uploaded", doc);
  }),
);

/**
 * POST /api/upload/image
 * Upload a general image (blog cover, property photo) — admin only
 */
router.post(
  "/image",
  requireAdmin,
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw AppError.badRequest("No file provided");

    const folder = (req.body.folder as string) || "images";
    const key = `${folder}/${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const fileUrl = await uploadFile(key, req.file.buffer, req.file.mimetype);

    return created(res, "Image uploaded", { url: fileUrl, key });
  }),
);

export default router;
