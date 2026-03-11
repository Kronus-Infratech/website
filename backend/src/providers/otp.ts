import { logger } from "../lib/logger.js";
import { env } from "../config/env.js";

/**
 * OTP Provider abstraction.
 * Swap between console (dev) and Twilio (prod) via OTP_PROVIDER env var.
 */

export interface OtpProvider {
  send(to: string, code: string): Promise<void>;
}

/** Console provider — logs OTP to stdout (development only) */
class ConsoleOtpProvider implements OtpProvider {
  async send(to: string, code: string) {
    logger.info({ to, code }, "📱 OTP (console provider)");
  }
}

/** Twilio SMS provider stub — implement when ready */
class TwilioOtpProvider implements OtpProvider {
  async send(to: string, code: string) {
    // Dynamic import to avoid requiring twilio in dev
    const twilio = await import("twilio" as string);
    const client = twilio.default(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Your Kronus verification code is: ${code}. Valid for 10 minutes.`,
      from: env.TWILIO_FROM_NUMBER,
      to,
    });
    logger.info({ to }, "OTP sent via Twilio");
  }
}

export function createOtpProvider(): OtpProvider {
  switch (env.OTP_PROVIDER) {
    case "twilio":
      return new TwilioOtpProvider();
    case "console":
    default:
      return new ConsoleOtpProvider();
  }
}

export const otpProvider = createOtpProvider();

/** Generate a 6-digit numeric OTP */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
