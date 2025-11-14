# Supabase Redirect URL Configuration Fix

## Problem
When users sign up for the first time, Supabase redirects them to `localhost:3000` instead of your Vite dev server at `localhost:5173`.

## Solution

### 1. Configure Redirect URLs in Supabase Dashboard

1. **Go to your Supabase Project Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `lwkaguufobvkyeluajco`

2. **Navigate to Authentication Settings**
   - Click on `Authentication` in the left sidebar
   - Click on `URL Configuration`

3. **Update Site URL**
   - Set **Site URL** to: `http://localhost:5173`
   - For production, change this to your production domain (e.g., `https://your-domain.com`)

4. **Add Redirect URLs**
   Add the following URLs to **Redirect URLs** list:
   ```
   http://localhost:5173
   http://localhost:5173/**
   http://localhost:5173/auth/callback
   ```

   For production, also add:
   ```
   https://your-domain.com
   https://your-domain.com/**
   https://your-domain.com/auth/callback
   ```

5. **Save Changes**
   - Click `Save` at the bottom of the page

### 2. Code Changes (Already Applied)

✅ Updated `src/lib/supabase.js`:
- Added auth configuration with `detectSessionInUrl` and `flowType: 'pkce'`

✅ Updated `src/context/AuthContext.jsx`:
- Added `emailRedirectTo: window.location.origin` to signUp function
- This ensures users are redirected to the correct origin dynamically

### 3. Testing

After updating Supabase settings:

1. **Clear browser storage**:
   - Open DevTools (F12)
   - Go to `Application` tab
   - Clear `Local Storage` and `Session Storage`

2. **Test signup flow**:
   - Register a new user
   - Check email for confirmation link
   - Click link - should redirect to `localhost:5173` (or current origin)

3. **Test signin flow**:
   - Sign in with existing account
   - Should stay on correct port

### 4. Production Deployment

When deploying to production:

1. **Update Supabase Site URL**:
   - Change Site URL from `http://localhost:5173` to your production URL
   - Example: `https://arc-raiders-bounty.vercel.app`

2. **Update Redirect URLs**:
   - Add your production domain to the Redirect URLs list
   - Keep localhost URLs for local development

3. **Environment Variables**:
   - Ensure `.env` files are properly configured for each environment

### 5. Why This Happened

Supabase defaults to port 3000 (common for Next.js/Create React App) when no Site URL is configured. Vite uses port 5173 by default, causing the mismatch.

The `emailRedirectTo` parameter in the signUp function ensures the redirect uses the current window origin dynamically, making it work across different environments.

## Verification

After making these changes, test the following scenarios:

- [ ] New user signup redirects to correct URL
- [ ] Email confirmation link redirects to correct URL  
- [ ] Existing user login works correctly
- [ ] Session persists after page refresh
- [ ] Sign out works correctly

## Additional Notes

- The `flowType: 'pkce'` provides better security for single-page applications
- `detectSessionInUrl: true` allows Supabase to detect auth tokens from URL parameters
- `autoRefreshToken: true` keeps users logged in by refreshing tokens automatically

## Support

If you still experience redirect issues:
1. Check browser console for errors
2. Verify Supabase dashboard settings match this guide
3. Clear all browser storage and cookies
4. Try incognito/private browsing mode
