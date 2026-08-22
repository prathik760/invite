-- Guest wishes now publish straight to the invitation instead of waiting in a
-- dashboard approval queue.

-- New wishes are visible on arrival.
ALTER TABLE "Wish" ALTER COLUMN "isApproved" SET DEFAULT true;

-- Release the existing backlog of real guest wishes. These were submitted by
-- guests to be shown and were only held back by the approval step that this
-- change removes, so leaving them hidden would permanently bury wishes on
-- invitations already shared.
--
-- The "__custom-requests__" event is excluded deliberately. Custom enquiries
-- are stored as Wish rows on that sentinel event (see app/api/custom-request),
-- and the admin view at /admin/requests reads isApproved = false as "pending
-- reply". Sweeping those to true would silently mark every unanswered sales
-- enquiry as handled and destroy the lead queue.
UPDATE "Wish" w
SET "isApproved" = true
WHERE w."isApproved" = false
  AND NOT EXISTS (
    SELECT 1 FROM "Event" e
    WHERE e.id = w."eventId"
      AND e.slug = '__custom-requests__'
  );
