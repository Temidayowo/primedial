import "server-only";
import { headers } from "next/headers";

const PRODUCTION_URL = "https://primedialsolutions.vercel.app";

// On Vercel, VERCEL_ENV is "production" only for the production domain
// deployment - preview deployments and local dev fall through to the
// request's own host, so links still work when testing either of those.
export async function getBaseUrl() {
  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_URL;
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
