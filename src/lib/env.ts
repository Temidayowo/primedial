export type AppEnvironment = "development" | "preview" | "production";

// VERCEL_ENV is only set when deployed on Vercel ("production" for the
// production domain, "preview" for branch/PR deployments) - it's absent
// locally, which is what falls through to "development" here.
export function getAppEnvironment(): AppEnvironment {
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "preview";
  return "development";
}
