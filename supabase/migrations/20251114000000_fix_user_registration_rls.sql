/*
  # Fix RLS Policy for User Registration
  
  This migration adds a database trigger to automatically create user profiles
  when a new user signs up via Supabase Auth, avoiding the RLS policy conflict.
*/

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a more permissive INSERT policy that allows both authenticated users
-- and the service to create profiles
CREATE POLICY "Enable insert for authenticated users and service"
  ON users FOR INSERT
  TO authenticated, anon
  WITH CHECK (auth.uid() = id);

-- Better solution: Use a trigger to auto-create user profiles
-- This runs with elevated privileges and bypasses RLS

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, username, reputation, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    0,
    'both'
  );
  RETURN new;
END;
$$;

-- Trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Now we can simplify the INSERT policy since the trigger handles creation
DROP POLICY IF EXISTS "Enable insert for authenticated users and service" ON users;

-- Optional: Allow service role to insert directly (for manual admin operations)
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  TO service_role
  WITH CHECK (true);
