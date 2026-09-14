import { BadgeCheck, Lock, RotateCcw, ShieldCheck } from "lucide-react";

const BADGES = [
  { icon: Lock, label: "256-bit SSL encrypted" },
  { icon: ShieldCheck, label: "Secured by Paystack" },
  { icon: RotateCcw, label: "30-day money-back guarantee" },
  { icon: BadgeCheck, label: "2-year manufacturer warranty" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {BADGES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2 py-3 text-center"
        >
          <Icon className="size-4 text-green" />
          <p className="text-[11px] leading-tight text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
