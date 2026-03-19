import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import { corsOptions } from "./config/cors.js";
import { generalLimiter } from "./config/rateLimit.js";
import { logger } from "./lib/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./modules/auth/routes.js";
import leadsRoutes from "./modules/leads/routes.js";
import propertiesRoutes from "./modules/properties/routes.js";
import blogsRoutes from "./modules/blogs/routes.js";
import usersRoutes from "./modules/users/routes.js";
import newsletterRoutes from "./modules/newsletter/routes.js";
import uploadRoutes from "./modules/upload/routes.js";
import adminRoutes from "./modules/admin/routes.js";
import websiteProjectRoutes from "./modules/website-projects/routes.js";
import sellersRoutes from "./modules/sellers/routes.js";
import otpRoutes from "./modules/otp/routes.js";

const app = express();

// ─── Global Middleware ───
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: (req) => (req as any).url === "/api/health" },
  }),
);
app.use(generalLimiter);

// ─── Health Check ───
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── API Routes ───
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", websiteProjectRoutes);
app.use("/api/sellers", sellersRoutes);

// ─── 404 ───
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Error Handler (must be last) ───
app.use(errorHandler);

export default app;
