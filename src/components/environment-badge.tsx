import { getAppEnvironment } from "@/lib/env";

const STYLES = {
  development: "bg-amber-400 text-amber-950",
  preview: "bg-purple-500 text-white",
  production: "bg-green text-white",
} as const;

const LABELS = {
  development: "DEV · localhost",
  preview: "PREVIEW",
  production: "LIVE · production",
} as const;

export function EnvironmentBadge() {
  const env = getAppEnvironment();

  return (
    <div
      className={`fixed bottom-3 left-3 z-100 rounded-full px-3 py-1 font-poppins text-[11px] font-semibold tracking-wide shadow-lg ${STYLES[env]}`}
    >
      {LABELS[env]}
    </div>
  );
}
