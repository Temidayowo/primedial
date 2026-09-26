-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('CONTACT', 'CONSULTATION', 'SERVICE_REQUEST');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingCost" DECIMAL(12,2),
ADD COLUMN     "shippingDetails" JSONB,
ADD COLUMN     "shippingMethod" TEXT,
ADD COLUMN     "subtotal" DECIMAL(12,2),
ADD COLUMN     "tax" DECIMAL(12,2);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "InquiryType" NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "subject" TEXT,
    "service" TEXT,
    "model" TEXT,
    "location" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Inquiry_status_createdAt_idx" ON "Inquiry"("status", "createdAt");

-- Backfill: snapshot the shipping address onto every existing order that
-- still has one linked, so those orders keep their address even if the
-- customer deletes it from their address book later.
UPDATE "Order" o
SET "shippingDetails" = jsonb_build_object(
  'fullName', a."fullName",
  'line1', a."line1",
  'line2', a."line2",
  'city', a."city",
  'state', a."state",
  'postalCode', a."postalCode",
  'country', a."country",
  'phone', a."phone"
)
FROM "Address" a
WHERE o."shippingAddressId" = a."id"
  AND o."shippingDetails" IS NULL;
