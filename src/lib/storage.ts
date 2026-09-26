import "server-only";
import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 through its S3-compatible API. Browsers upload straight to
// R2 with a short-lived presigned URL (so files never pass through the
// Next.js server and its body-size limit); the public URL is what gets
// stored in the database.

export const UPLOAD_KINDS = {
  image: {
    folder: "images",
    maxBytes: 8 * 1024 * 1024,
    types: {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
      "image/gif": "gif",
    },
  },
  document: {
    folder: "documents",
    maxBytes: 20 * 1024 * 1024,
    types: { "application/pdf": "pdf" },
  },
} as const;

export type UploadKind = keyof typeof UPLOAD_KINDS;

const PRESIGN_TTL_SECONDS = 60;

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set (see .env.example).`);
  return value;
}

let client: S3Client | undefined;
function getClient() {
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env("R2_ACCESS_KEY_ID"),
      secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

export async function createUpload(kind: UploadKind, contentType: string) {
  const config = UPLOAD_KINDS[kind];
  const ext = (config.types as Record<string, string>)[contentType];
  if (!ext) return null;

  const key = `${config.folder}/${randomUUID()}.${ext}`;
  const uploadUrl = await getSignedUrl(
    getClient(),
    new PutObjectCommand({
      Bucket: env("R2_BUCKET_NAME"),
      Key: key,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
    { expiresIn: PRESIGN_TTL_SECONDS },
  );

  const publicUrl = `${env("R2_PUBLIC_URL").replace(/\/+$/, "")}/${key}`;
  return { uploadUrl, publicUrl, maxBytes: config.maxBytes };
}
