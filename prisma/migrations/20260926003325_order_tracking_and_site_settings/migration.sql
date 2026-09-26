-- CreateEnum
CREATE TYPE "OrderEventType" AS ENUM ('PLACED', 'PAID', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'NOTE');

-- CreateEnum
CREATE TYPE "OrderEventSource" AS ENUM ('SYSTEM', 'ADMIN', 'COURIER');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "courierName" TEXT,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "trackingNumber" TEXT,
ADD COLUMN     "trackingUrl" TEXT;

-- CreateTable
CREATE TABLE "OrderEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "OrderEventType" NOT NULL,
    "source" "OrderEventSource" NOT NULL DEFAULT 'SYSTEM',
    "message" TEXT,
    "location" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" UUID NOT NULL,

    CONSTRAINT "OrderEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "address" TEXT NOT NULL,
    "phones" TEXT[],
    "email" TEXT NOT NULL,
    "businessHours" TEXT NOT NULL,
    "mapEmbedUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderEvent_orderId_occurredAt_idx" ON "OrderEvent"("orderId", "occurredAt");

-- AddForeignKey
ALTER TABLE "OrderEvent" ADD CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill the timeline with the events we have real timestamps for.
-- Shipped/delivered/cancelled dates were never recorded, so those steps
-- show as done without a date rather than with an invented one.
INSERT INTO "OrderEvent" ("type", "source", "message", "occurredAt", "orderId")
SELECT 'PLACED', 'SYSTEM', 'Order placed', o."createdAt", o."id" FROM "Order" o;

INSERT INTO "OrderEvent" ("type", "source", "message", "occurredAt", "orderId")
SELECT 'PAID', 'SYSTEM', 'Payment confirmed', o."paidAt", o."id"
FROM "Order" o
WHERE o."paymentStatus" = 'PAID' AND o."paidAt" IS NOT NULL;

-- The contact details that were hardcoded on the contact page.
INSERT INTO "SiteSettings" ("id", "address", "phones", "email", "businessHours", "mapEmbedUrl", "updatedAt")
VALUES (
  'default',
  '12, Akin Osiyemi Street, Allen Ikeja, Lagos State, Nigeria',
  ARRAY['+234 808 472 9494', '+234 706 835 4374'],
  'info@primedialsolutions.com',
  'Mon-Fri, 8:00am-6:00pm',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4190.413420094946!2d3.3510445752416347!3d6.603769193390117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b923125f28875%3A0xeff45dbb34799958!2s12%20Akin%20Osiyemi%20St%2C%20Allen%2C%20Lagos%20101233%2C%20Lagos!5e1!3m2!1sen!2sng!4v1788620841043!5m2!1sen!2sng',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
