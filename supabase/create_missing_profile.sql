-- ========================================
-- FIX: Create Missing User Profile
-- ========================================
-- Run this in Supabase SQL Editor after running the trigger migration

-- STEP 1: View your existing auth users
-- Copy the 'id' and 'username' from the results
SELECT 
  id,
  email,
  raw_user_meta_data->>'username' as username,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- STEP 2: Create the missing profile
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from Step 1
-- Replace 'ftgglin3' with your actual username
INSERT INTO public.users (id, username, reputation, role)
VALUES (
  'YOUR_USER_ID_HERE',  -- Paste the UUID from Step 1 here
  'ftgglin3',           -- Your username from Step 1
  0,                    -- Starting reputation
  'both'                -- Can be 'hunter', 'reporter', or 'both'
)
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Verify the profile was created
SELECT id, username, reputation, role, created_at
FROM public.users
ORDER BY created_at DESC;

-- ========================================
-- If you see your profile in Step 3, you're done!
-- Log out and log back in to test.
-- ========================================
