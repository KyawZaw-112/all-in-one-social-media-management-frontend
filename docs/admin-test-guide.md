# Admin Login Test Guide

This guide helps you create and verify a local/staging **test admin account**.

## 1) Create the auth user

In Supabase dashboard:

1. Go to **Authentication → Users**.
2. Click **Add user**.
3. Use test credentials:
   - Email: `john@gmail.com`
   - Password: `TempPassword123!`

## 2) Grant admin access in DB

1. Copy the new user's UUID from **Authentication → Users**.
2. Open **SQL Editor** and run `scripts/create_test_admin_account.sql`.
3. Replace `REPLACE_WITH_AUTH_USER_UUID` with the copied UUID before running.

This script ensures both tables are in sync:
- `profiles` (role-based checks)
- `admin_users` (admin mapping checks)

## 3) Verify frontend login

1. Start frontend:
   ```bash
   pnpm dev
   ```
2. Open `/admin/login`.
3. Login with:
   - Email: `john@gmail.com`
   - Password: `TempPassword123!`
4. Expected: redirect to `/admin` without “You do not have admin access”.

## 4) Negative checks

- Set `is_active = false` in either `profiles` or `admin_users` for the same user.
- Try logging in again.
- Expected: blocked with “You do not have admin access”.
