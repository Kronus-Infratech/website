import type { Request, Response } from "express";
import { ok, created, noContent } from "../../lib/apiResponse.js";
import * as usersService from "./service.js";

// ─── Profile ───

export async function getProfile(req: Request, res: Response) {
  const user = await usersService.getProfile(req.webUser!.sub);
  return ok(res, "Profile retrieved", user);
}

export async function updateProfile(req: Request, res: Response) {
  const user = await usersService.updateProfile(req.webUser!.sub, req.body);
  return ok(res, "Profile updated", user);
}

// ─── Bookmarks ───

export async function addBookmark(req: Request, res: Response) {
  const bookmark = await usersService.addBookmark(req.webUser!.sub, req.body.inventoryItemId);
  return created(res, "Bookmarked", bookmark);
}

export async function removeBookmark(req: Request, res: Response) {
  await usersService.removeBookmark(req.webUser!.sub, req.params.inventoryItemId as string);
  return noContent(res);
}

export async function listBookmarks(req: Request, res: Response) {
  const { page = 1, limit = 20 } = (req.validated?.query ?? req.query) as any;
  const result = await usersService.listBookmarks(req.webUser!.sub, Number(page), Number(limit));
  return ok(res, "Bookmarks retrieved", result.bookmarks, result.meta);
}

export async function checkBookmark(req: Request, res: Response) {
  const result = await usersService.isBookmarked(req.webUser!.sub, req.params.inventoryItemId as string);
  return ok(res, "Bookmark status", result);
}

// ─── Site Visits ───

export async function listSiteVisits(req: Request, res: Response) {
  const visits = await usersService.listUserSiteVisits(req.webUser!.sub);
  return ok(res, "Site visits retrieved", visits);
}

// ─── Documents ───

export async function listDocuments(req: Request, res: Response) {
  const docs = await usersService.listDocuments(req.webUser!.sub);
  return ok(res, "Documents retrieved", docs);
}

export async function deleteDocument(req: Request, res: Response) {
  await usersService.deleteDocument(req.webUser!.sub, req.params.id as string);
  return noContent(res);
}
