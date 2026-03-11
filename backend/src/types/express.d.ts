/* eslint-disable @typescript-eslint/no-namespace */

import type { AccessTokenPayload, AdminTokenPayload } from "../lib/jwt.js";

declare global {
  namespace Express {
    interface Request {
      /** Authenticated website user — set by requireWebUser */
      webUser?: AccessTokenPayload;
      /** Authenticated CRM admin — set by requireAdmin */
      adminUser?: AdminTokenPayload;
    }
  }
}

export {};
