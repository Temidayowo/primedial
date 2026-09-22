import { cn } from "@/lib/utils";

// No brand logo assets are bundled with the app, so these are drawn as
// lightweight typographic chips rather than importing third-party SVG
// marks - avoids shipping (and maintaining) trademarked logo files.
function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-6 items-center rounded-[4px] border border-gray-200 bg-white px-1.5 text-[10px] font-bold tracking-tight",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PaymentSchemeIcons({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Chip className="text-[#1A1F71]">VISA</Chip>
      <Chip className="text-[#EB001B]">
        <span className="text-[#FF5F00]">MC</span>
      </Chip>
      <Chip className="text-green">VERVE</Chip>
    </div>
  );
}
