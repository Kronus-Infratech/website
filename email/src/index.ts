import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { sendOtpEmail } from "./services/emailService.js";
import { z } from "zod";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request validation schema
const SendOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(4).max(6),
    userName: z.string().optional(),
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "email-service", timestamp: new Date() });
});

// Send OTP email endpoint
app.post("/send-otp", async (req: Request, res: Response) => {
    try {
        const validation = SendOtpSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error.errors,
            });
        }

        const { email, otp, userName } = validation.data;

        const result = await sendOtpEmail(email, otp, userName);

        if (result.success) {
            return res.json({
                success: true,
                message: "OTP email sent successfully",
                messageId: result.messageId,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: result.error,
            });
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP email",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// Send welcome email endpoint
app.post("/send-welcome", async (req: Request, res: Response) => {
    try {
        const WelcomeSchema = z.object({
            email: z.string().email("Invalid email address"),
            name: z.string().min(1),
            userType: z.enum(["buyer", "seller"]),
        });

        const validation = WelcomeSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error.errors,
            });
        }

        // TODO: Implement welcome email sending
        return res.json({
            success: true,
            message: "Welcome email sent successfully",
        });
    } catch (error) {
        console.error("Error sending welcome email:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send welcome email",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🔧 Email Service running on port ${PORT}`);
    console.log(`📧 OTP endpoint: POST http://localhost:${PORT}/send-otp`);
    console.log(`💚 Health check: GET http://localhost:${PORT}/health`);
});

export default app;
