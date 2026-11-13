-- One row per design a customer has bought (see the Purchase model and
-- lib/entitlements.ts). New table only; nothing existing is changed, and
-- earlier customers' plans in "Subscription" are left exactly as they are.
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "razorpayPaymentId" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Purchase_razorpayPaymentId_key" ON "Purchase"("razorpayPaymentId");

CREATE UNIQUE INDEX "Purchase_userId_templateId_key" ON "Purchase"("userId", "templateId");

ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Closes the table to Supabase's public API. The site connects to the database
-- directly as the table's owner, so it is unaffected.
ALTER TABLE "Purchase" ENABLE ROW LEVEL SECURITY;
