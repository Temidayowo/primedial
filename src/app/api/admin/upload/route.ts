import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { isSessionExpired } from "@/lib/session";
import { createUpload, UPLOAD_KINDS, type UploadKind } from "@/lib/storage";

// Hands an admin a short-lived presigned URL to upload one file to R2.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || isSessionExpired(session)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const kind = body?.kind as UploadKind;
  const contentType = String(body?.contentType ?? "");
  const size = Number(body?.size);

  if (!(kind in UPLOAD_KINDS)) {
    return NextResponse.json({ error: "Unknown upload type." }, { status: 400 });
  }
  if (!Number.isFinite(size) || size <= 0 || size > UPLOAD_KINDS[kind].maxBytes) {
    const mb = UPLOAD_KINDS[kind].maxBytes / 1024 / 1024;
    return NextResponse.json(
      { error: `File must be under ${mb} MB.` },
      { status: 400 },
    );
  }

  try {
    const upload = await createUpload(kind, contentType);
    if (!upload) {
      return NextResponse.json(
        { error: "That file type isn't allowed." },
        { status: 400 },
      );
    }
    return NextResponse.json({
      uploadUrl: upload.uploadUrl,
      publicUrl: upload.publicUrl,
    });
  } catch (error) {
    console.error("Upload presign failed:", error);
    return NextResponse.json(
      { error: "File storage isn't configured." },
      { status: 500 },
    );
  }
}
