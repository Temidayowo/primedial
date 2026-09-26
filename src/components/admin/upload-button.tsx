"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadFile } from "@/lib/upload-client";

// File picker that uploads to R2 and reports the resulting public URL.
export function UploadButton({
  kind,
  label,
  onUploaded,
}: {
  kind: "image" | "document";
  label: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onUploaded(await uploadFile(file, kind));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/avif,image/gif" : "application/pdf"}
        onChange={onChange}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-blue hover:bg-slate-50 disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
        {busy ? "Uploading..." : label}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
