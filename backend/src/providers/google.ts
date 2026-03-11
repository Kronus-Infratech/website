import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { AppError } from "../lib/AppError.js";

let client: OAuth2Client | null = null;

function getClient(): OAuth2Client {
  if (!client) {
    if (!env.GOOGLE_CLIENT_ID) {
      throw AppError.internal("Google OAuth is not configured");
    }
    client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }
  return client;
}

export interface GoogleUserInfo {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
}

/**
 * Verify a Google ID token and extract user info.
 */
export async function verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
  const oauth = getClient();
  const ticket = await oauth.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw AppError.badRequest("Invalid Google token");
  }
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email.split("@")[0],
    avatar: payload.picture,
    emailVerified: payload.email_verified ?? false,
  };
}
