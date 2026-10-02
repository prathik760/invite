-- Visitor activity journal (see the Activity model and /admin/activity).
-- New table only; nothing existing is changed.
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Activity_visitorId_createdAt_idx" ON "Activity"("visitorId", "createdAt");
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");
