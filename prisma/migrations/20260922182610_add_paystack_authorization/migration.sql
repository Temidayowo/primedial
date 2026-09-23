-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "paystackAuthorizationCode" TEXT,
ADD COLUMN     "paystackCustomerEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_paystackAuthorizationCode_key" ON "PaymentMethod"("paystackAuthorizationCode");

