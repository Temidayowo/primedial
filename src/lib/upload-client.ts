// Browser side of the R2 upload flow: ask /api/admin/upload for a
// presigned URL, PUT the file straight to R2, return its public URL.

export async function uploadFile(
  file: File,
  kind: "image" | "document",
): Promise<string> {
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, contentType: file.type, size: file.size }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed.");

  const put = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body: file,
  });
  if (!put.ok) throw new Error("Upload to storage failed. Check the bucket's CORS settings.");

  return data.publicUrl as string;
}
