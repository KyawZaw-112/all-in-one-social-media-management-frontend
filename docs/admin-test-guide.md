# Admin Test Guide (Login, Payment Approval, User CRUD)

This guide helps you verify:
1. Admin login works
2. Payment approval works
3. User Management CRUD works at `/admin/dashboard`

## 1) Create a test auth user in Supabase

In Supabase Dashboard:

1. Go to **Authentication → Users**
2. Click **Add user**
3. Create:
   - Email: `john@gmail.com`
   - Password: `TempPassword123!`

## 2) Grant admin permission

1. Copy the user UUID from **Authentication → Users**
2. Open **SQL Editor**
3. Run `scripts/create_test_admin_account.sql`
4. Replace `REPLACE_WITH_AUTH_USER_UUID` before running

This keeps `profiles` and `admin_users` aligned for admin checks.

## 3) Test admin login

1. Start frontend
   ```bash
   pnpm dev
   ```
2. Open `/admin/login`
3. Login with:
   - `john@gmail.com`
   - `TempPassword123!`
4. Expected: redirect to `/admin`

## 4) Test payment approval

1. Open `/admin/payments`
2. Expected: pending payments list appears
3. Click **Approve** on one payment
4. Expected: success message and refreshed list

## 5) Test user management CRUD dashboard

1. Open `/admin/dashboard` (aliases to user management)
2. **Create**:
   - Fill create form (email required)
   - Click **Create**
   - Expected: new user appears in table
3. **Read**:
   - Expected: existing users are listed in table
4. **Update**:
   - Click **Update** on any row
   - Edit fields and click **Save**
   - Expected: row data refreshes
5. **Delete**:
   - Click **Delete** on any row
   - Confirm browser prompt
   - Expected: user removed from table

## 6) Negative checks

- Remove admin role or set inactive in DB and retry `/admin/login`
- Expected: blocked with `You do not have admin access`
