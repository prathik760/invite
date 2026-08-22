-- Guest wishes now publish straight to the invitation instead of waiting in a
-- dashboard approval queue.

-- New wishes are visible on arrival.
ALTER TABLE "Wish" ALTER COLUMN "isApproved" SET DEFAULT true;

-- Release the existing backlog. These were submitted by guests to be shown and
-- were only held back by the approval step that this change removes, so leaving
-- them hidden would permanently bury wishes on invitations already shared.
UPDATE "Wish" SET "isApproved" = true WHERE "isApproved" = false;
