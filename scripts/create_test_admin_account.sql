-- Create/upgrade a test admin mapping for an existing Supabase Auth user.
-- Step 1: Create the user in Supabase Dashboard -> Authentication -> Users.
-- Suggested credentials for local testing:
--   Email: john@gmail.com
--   Password: TempPassword123!

-- Step 2: Run this SQL in Supabase SQL Editor after replacing user UUID.
-- You can get the UUID from Authentication -> Users.

-- Replace this with the actual auth.users.id UUID
-- e.g. '11111111-2222-3333-4444-555555555555'
\set test_user_id 'REPLACE_WITH_AUTH_USER_UUID'

-- If your app uses profiles for roles, ensure it exists and is admin.
insert into public.profiles (id, role, is_active)
values (:'test_user_id', 'admin', true)
on conflict (id)
do update set role = excluded.role, is_active = excluded.is_active;

-- Ensure admin_users mapping exists (used by admin login guard).
insert into public.admin_users (user_id, role, is_active)
values (:'test_user_id', 'admin', true)
on conflict (user_id)
do update set role = excluded.role, is_active = excluded.is_active;
