// Validate required environment variables at boot in production.
// Fails fast if any are missing — prevents silently broken deploys.
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const env = process.env.NODE_ENV ?? "development";
  if (env !== "production") {
    console.log("[fintrk] dev mode — skipping strict env validation");
    return;
  }

  const required = [
    "DATABASE_URL",
    "JWT_SECRET",
    "CRON_SECRET",
    "OPENAI_API_KEY",
  ] as const;

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    const msg = `Missing required env vars in production: ${missing.join(", ")}`;
    console.error(`[fintrk startup] ${msg}`);
    throw new Error(msg);
  }

  // Opcional: emails y push web. La app funciona sin ellos pero con features
  // degradadas.
  const optional = [
    "VAPID_PUBLIC_KEY",
    "VAPID_PRIVATE_KEY",
    "RESEND_API_KEY",
  ] as const;
  const missingOptional = optional.filter((k) => !process.env[k]);
  if (missingOptional.length > 0) {
    console.warn(
      `[fintrk startup] optional env vars missing — features will be degraded: ${missingOptional.join(", ")}`,
    );
  }

  console.log("[fintrk startup] env validated — boot OK");
}

export const onRequestError = async (
  err: unknown,
  request: { path: string; method: string },
): Promise<void> => {
  const { logError } = await import("./src/lib/log-error");
  logError(`API ${request.method} ${request.path}`, err);
};
