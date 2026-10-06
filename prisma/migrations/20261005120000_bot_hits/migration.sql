-- Pages fetched by bots, counted per bot, page and day (see the BotHit model
-- and the Bots tab of /admin/activity). New table only; nothing existing is changed.
CREATE TABLE "BotHit" (
    "day" TEXT NOT NULL,
    "bot" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 1,
    "lastAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotHit_pkey" PRIMARY KEY ("day", "bot", "path")
);

-- Closes the table to Supabase's public API. The site connects to the database
-- directly as the table's owner, so it is unaffected.
ALTER TABLE "BotHit" ENABLE ROW LEVEL SECURITY;
