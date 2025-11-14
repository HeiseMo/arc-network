# 🔧 Quick Fix: Missing User Profiles

## The Problem
When you sign up, a user is created in `auth.users` but NOT in your `public.users` table. This is because the database trigger hasn't been set up yet.

## The Fix (2 minutes)

### Step 1: Run the Migration

1. Go to your Supabase Dashboard → **SQL Editor**
   - Direct link: https://supabase.com/dashboard/project/lwkaguufobvkyeluajco/sql/new

2. Copy the ENTIRE contents of this file:
   `supabase/migrations/20251114000000_fix_user_registration_rls.sql`

3. Paste it into the SQL Editor

4. Click **"Run"** (or press Ctrl+Enter)

5. You should see "Success. No rows returned"

### Step 2: Manually Create Profile for Existing User

Since you already have a user in `auth.users`, you need to manually create their profile:

1. In Supabase Dashboard → **SQL Editor**

2. Run this query (replace with your actual user ID from auth.users):

```sql
-- First, get your user ID from auth.users
SELECT id, email, raw_user_meta_data->>'username' as username 
FROM auth.users;

-- Then create the profile (replace YOUR_USER_ID and YOUR_USERNAME)
INSERT INTO public.users (id, username, reputation, role)
VALUES (
  'YOUR_USER_ID',  -- Copy the UUID from the query above
  'YOUR_USERNAME', -- Your desired username
  0,
  'both'
);
```

### Step 3: Verify

1. Go to **Table Editor** → **users**
2. You should see your profile now
3. Refresh your app and log in again
4. You should be logged in successfully!

## Future Users

Once the trigger is set up (Step 1), all NEW users will automatically get their profile created. The trigger extracts the username from signup metadata.

---

## Alternative: Quick SQL to Create Your Profile

If you know your user ID from the auth panel, run this one-liner:

```sql
-- Get user ID first
SELECT id, email FROM auth.users;

-- Then create profile (replace the values)
INSERT INTO public.users (id, username, reputation, role)
VALUES ('paste-user-id-here', 'ftgglin3', 0, 'both')
ON CONFLICT (id) DO NOTHING;
```

---

## ✅ After This Fix

- ✅ Existing user will have a profile
- ✅ New signups will automatically create profiles
- ✅ Login will work properly
- ✅ Dashboard will load user data

---

**Run the migration now and you'll be good to go!** 🚀
