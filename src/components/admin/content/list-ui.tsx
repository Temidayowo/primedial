import Link from "next/link";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Shared server-rendered pieces for the CMS list and edit pages.

export function ContentListHeader({
  title,
  description,
  count,
  noun,
  addHref,
  addLabel,
}: {
  title: string;
  description: string;
  count: number;
  noun: [singular: string, plural: string];
  addHref: string;
  addLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        <p className="mt-1 text-xs text-slate-400">
          {count} {count === 1 ? noun[0] : noun[1]} total.
        </p>
      </div>
      <Link
        href={addHref}
        className="flex items-center gap-1.5 rounded-lg bg-blue px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue/90"
      >
        <Plus className="size-4" /> {addLabel}
      </Link>
    </div>
  );
}

export function ContentEmptyState({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-8 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

export function ContentTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-gray-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs text-slate-400 uppercase">
            {headers.map((header, index) => (
              <th
                key={header}
                className={cn(
                  "px-4 py-3 font-medium",
                  index === headers.length - 1 && "text-right",
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function PublishedBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
        isPublished ? "bg-green/10 text-green" : "bg-gray-100 text-slate-500",
      )}
    >
      {isPublished ? "Published" : "Hidden"}
    </span>
  );
}

export function EditLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="text-slate-400 transition-colors duration-300 hover:text-blue"
    >
      <Pencil className="size-4" />
    </Link>
  );
}

export function ContentFormPage({
  title,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors duration-300 hover:text-blue"
      >
        <ArrowLeft className="size-4" /> {backLabel}
      </Link>
      <h1 className="mt-3 font-clash-display text-2xl font-bold text-blue md:text-3xl">
        {title}
      </h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}
