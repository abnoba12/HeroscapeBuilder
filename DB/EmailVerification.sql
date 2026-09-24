-- Login now requires a verified email (AspNetUsers.EmailConfirmed).
-- Accounts created before verification existed are treated as verified so they aren't locked out.
-- Run once per environment when deploying the email verification feature.
UPDATE dbo.AspNetUsers
SET EmailConfirmed = 1
WHERE EmailConfirmed = 0;
