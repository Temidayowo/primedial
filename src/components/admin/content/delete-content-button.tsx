"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

// Delete control for CMS list rows. `action` is a server action already
// bound to the row's id, e.g. deleteProject.bind(null, project.id).
export function DeleteContentButton({
  action,
  itemName,
}: {
  action: () => Promise<{ error: string | null }>;
  itemName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!confirm(`Delete "${itemName}"? This can't be undone.`)) return;

    startTransition(async () => {
      try {
        const result = await action();
        if (result.error) {
          setError(result.error);
        } else {
          setError(null);
          router.refresh();
        }
      } catch {
        setError("Couldn't delete. Please try again.");
      }
    });
  };

  return (
    <div className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label={`Delete ${itemName}`}
        className="text-slate-400 transition-colors duration-300 hover:text-red-500 disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
      {error && (
        <p className="mt-1 max-w-48 text-right text-[11px] text-red-600">{error}</p>
      )}
    </div>
  );
}
