import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;

export async function generateOtp(
  identifier: string,
  type: "PHONE_LOGIN" | "EMAIL_LOGIN" | "EMAIL_VERIFY" | "PASSWORD_RESET",
  isEmail: boolean = false
) {
  // Generate 6-digit OTP
  const otp = Math.random().toString().slice(2, 8);

  // Delete existing OTP for this identifier
  await prisma.otpToken.deleteMany({
    where: { identifier },
  });

  // Create new OTP
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpToken.create({
    data: {
      identifier,
      type,
      code: otp,
      expiresAt,
    },
  });

  // If email OTP, trigger email service
  if (isEmail) {
    await sendOtpViaEmail(identifier, otp);
  }

  return { otp, expiresAt };
}

export async function verifyOtp(
  identifier: string,
  code: string,
  type: "PHONE_LOGIN" | "EMAIL_LOGIN" | "EMAIL_VERIFY" | "PASSWORD_RESET"
) {
  const otpRecord = await prisma.otpToken.findFirst({
    where: {
      identifier,
      type,
      code,
    },
  });

  if (!otpRecord) {
    throw AppError.unauthorized("Invalid OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    await prisma.otpToken.delete({ where: { id: otpRecord.id } });
    throw AppError.unauthorized("OTP has expired");
  }

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.otpToken.delete({ where: { id: otpRecord.id } });
    throw AppError.unauthorized("Maximum OTP attempts exceeded");
  }

  // Delete OTP after successful verification
  await prisma.otpToken.delete({ where: { id: otpRecord.id } });

  return true;
}

export async function markOtpAttempt(identifier: string, type: string) {
  const updates = await prisma.otpToken.updateMany({
    where: { identifier, type: type as any },
    data: { attempts: { increment: 1 } },
  });

  return updates;
}

async function sendOtpViaEmail(email: string, otp: string) {
  try {
    const emailServiceUrl = process.env.EMAIL_SERVICE_URL;

    const response = await fetch(`${emailServiceUrl}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send OTP email:", await response.text());
    }
  } catch (error) {
    console.error("Error calling email service:", error);
    // Don't throw — OTP exists in database, user can retry
  }
}
