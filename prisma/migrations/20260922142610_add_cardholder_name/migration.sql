-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "cardholderName" TEXT;

-- Backfill existing rows (added as nullable above so this can run) from
-- the owning user's name, falling back to a generic placeholder for
-- accounts without one set.
UPDATE "PaymentMethod" pm
SET "cardholderName" = COALESCE(u."name", 'Cardholder')
FROM "User" u
WHERE u.id = pm."userId" AND pm."cardholderName" IS NULL;

-- Now that every row has a value, enforce NOT NULL going forward.
ALTER TABLE "PaymentMethod" ALTER COLUMN "cardholderName" SET NOT NULL;
