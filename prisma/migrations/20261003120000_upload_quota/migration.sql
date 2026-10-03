-- Hourly upload allowance for signed-out visitors (see the UploadQuota model).
-- New table only; nothing existing is changed.
CREATE TABLE "UploadQuota" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UploadQuota_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "UploadQuota_expiresAt_idx" ON "UploadQuota"("expiresAt");

-- Closes the table to Supabase's public API. The site connects to the database
-- directly as the table's owner, so it is unaffected.
ALTER TABLE "UploadQuota" ENABLE ROW LEVEL SECURITY;
