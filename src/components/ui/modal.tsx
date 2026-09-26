"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// Generic dialog shell (backdrop + centered panel, Escape-to-close,
// click-outside-to-close, body scroll lock) - follows the same pattern as
// ConsultationModal, pulled into a reusable primitive since this is the
// second place that needs it.
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Rendered via a portal straight onto <body> rather than inline in the
  // tree. `position: fixed` only escapes the page layout if no ancestor
  // has a CSS `transform` set - and framer-motion's AnimateOnScroll /
  // StaggerContainer (used in ~16 places across this codebase) leaves a
  // `transform` style on its wrapper even after its reveal animation
  // finishes. Render inline and this modal would silently break (clipped
  // to, or mispositioned within, whatever animated ancestor happens to
  // wrap it) the moment it's placed under one of those - a portal makes
  // that ancestor irrelevant.
  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-clash-display text-lg font-bold text-blue">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-slate-500">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors duration-300 hover:bg-gray-100 hover:text-blue"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
