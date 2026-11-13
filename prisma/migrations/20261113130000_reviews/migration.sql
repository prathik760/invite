-- Hosts' reviews of their invitations (see the Review model and lib/reviews.ts).
-- New table only; nothing existing is changed. Not linked to "Event" on
-- purpose: invitations are deleted 30 days after their event, reviews stay.
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "rating" INTEGER,
    "text" TEXT,
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'asked',
    "emailedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Review_eventId_key" ON "Review"("eventId");

CREATE INDEX "Review_status_idx" ON "Review"("status");

CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- Closes the table to Supabase's public API. The site connects to the database
-- directly as the table's owner, so it is unaffected.
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
