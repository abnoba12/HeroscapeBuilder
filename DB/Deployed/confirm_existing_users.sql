-- Run once on each database BEFORE deploying the email-confirmation change, so accounts that
-- already exist can still log in.
UPDATE AspNetUsers SET EmailConfirmed = 1 WHERE EmailConfirmed = 0;
