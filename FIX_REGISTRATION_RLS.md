# 🐛 Fixing User Registration RLS Error

## The Problem

When you try to sign up, you get:
```
new row violates row-level security policy for table "users"
```

This happens because:
1. During signup, the user tries to insert a row into the `users` table
2. The RLS policy requires the user to be "authenticated"
3. But at the moment of insertion, the auth session isn't fully established yet
4. Result: Policy blocks the insertion ❌

---

## ✅ Solution: Database Trigger (Recommended)

Instead of your app inserting the user profile, let Supabase do it automatically using a database trigger.

### Step 1: Run the New Migration

1. Open Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Open the file: `supabase/migrations/20251114000000_fix_user_registration_rls.sql`
4. Copy and paste the entire contents
5. Click **"Run"** (or Ctrl+Enter)
6. Wait for "Success" message

### Step 2: Update Your AuthContext

We need to modify the signup code to pass the username in metadata instead of inserting manually.

Open `src/context/AuthContext.jsx` and update the `signUp` function:

**BEFORE (Current - Doesn't Work):**
```jsx
const signUp = async (email, password, username) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username,
          reputation: 0,
          role: 'both',
        });

      if (profileError) throw profileError;

      await fetchProfile(authData.user.id);
    }

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
```

**AFTER (Fixed - Works!):**
```jsx
const signUp = async (email, password, username) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (authError) throw authError;

    if (authData.user) {
      // The trigger will automatically create the profile
      // Just wait a moment for it to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchProfile(authData.user.id);
    }

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
```

### Step 3: Test

1. Refresh your browser (F5)
2. Try signing up again
3. Should work now! ✅

---

## How It Works

### Old Flow (Broken):
```
1. User clicks "Sign Up"
2. App calls supabase.auth.signUp() → Creates auth user
3. Auth session starts to initialize...
4. App tries to insert into users table ❌ RLS blocks!
5. Error! 😢
```

### New Flow (Fixed):
```
1. User clicks "Sign Up"
2. App calls supabase.auth.signUp() with username in metadata
3. Supabase creates auth user
4. Database trigger fires automatically
5. Trigger creates profile in users table (bypasses RLS) ✅
6. App fetches the profile
7. Success! 🎉
```

---

## Alternative Solution (If You Can't Use Triggers)

If for some reason the trigger approach doesn't work, you can temporarily allow anonymous inserts:

```sql
-- In SQL Editor
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

CREATE POLICY "Allow profile creation during signup"
  ON users FOR INSERT
  TO anon, authenticated
  WITH CHECK (auth.uid() = id);
```

But this is **less secure** and not recommended.

---

## Verification

After applying the fix:

1. Go to Supabase Dashboard → **Database** → **Functions**
2. You should see `handle_new_user()` function
3. Sign up a new user
4. Check **Authentication** → **Users** - user should be there
5. Check **Table Editor** → **users** - profile should be auto-created
6. Username should match what you entered during signup

---

## Need Help?

If you still get errors:
1. Check browser console (F12) for detailed error messages
2. Check Supabase Dashboard → **Logs** → **Postgres Logs**
3. Verify the migration ran successfully
4. Make sure you updated the `AuthContext.jsx` file

---

**This fix will make your registration work properly!** 🚀
