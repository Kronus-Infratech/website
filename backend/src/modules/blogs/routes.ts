import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import * as ctrl from "./controller.js";
import { listBlogsSchema, blogSlugSchema, blogIdSchema, createBlogSchema, updateBlogSchema } from "./schema.js";

const router = Router();

// Public
router.get("/", validate({ query: listBlogsSchema }), asyncHandler(ctrl.listBlogs));
router.get("/categories", asyncHandler(ctrl.getCategories));
router.get("/tags", asyncHandler(ctrl.getTags));
router.get("/:slug", validate({ params: blogSlugSchema }), asyncHandler(ctrl.getBlog));

// Admin
router.get("/admin/list", requireAdmin, validate({ query: listBlogsSchema }), asyncHandler(ctrl.adminListBlogs));
router.post("/admin", requireAdmin, validate({ body: createBlogSchema }), asyncHandler(ctrl.createBlog));
router.put("/admin/:id", requireAdmin, validate({ params: blogIdSchema, body: updateBlogSchema }), asyncHandler(ctrl.updateBlog));
router.delete("/admin/:id", requireAdmin, validate({ params: blogIdSchema }), asyncHandler(ctrl.deleteBlog));

export default router;
