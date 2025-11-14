# Supabase Setup Guide - Arc Raiders Bounty Hunter

This guide will walk you through setting up Supabase for the Arc Raiders Bounty Hunter application.

## 📋 Prerequisites

- Node.js installed (v18 or higher recommended)
- A GitHub/GitLab account (for Supabase login)
- Basic understanding of databases (helpful but not required)

## 🚀 Step-by-Step Setup

### 1. Create a Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** and sign in with GitHub/GitLab
3. Click **"New Project"**
4. Fill in the project details:
   - **Organization**: Select or create your organization
   - **Name**: `arc-bounty-hunter` (or your preferred name)
   - **Database Password**: Create a strong password (**SAVE THIS!**)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier (perfect for development)
5. Click **"Create new project"**
6. Wait 2-3 minutes for your project to be provisioned ☕

### 2. Get Your API Credentials

1. In your Supabase project dashboard, navigate to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long JWT token starting with `eyJ...`
4. Keep this tab open - you'll need these values in the next step

### 3. Configure Environment Variables

1. Open the `.env` file in the root of this project (already created for you)
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **IMPORTANT**: Never commit the `.env` file to git (it's already in `.gitignore`)

### 4. Run Database Migrations

You have two options to set up your database schema:

#### Option A: Using Supabase SQL Editor (Recommended for Beginners)

1. In your Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **"New query"**
3. Open `supabase/migrations/20251113234830_create_bounty_hunter_schema.sql` from this project
4. Copy the entire contents and paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. Wait for the query to complete (should say "Success")
7. Repeat steps 2-6 for `supabase/migrations/20251113235352_create_storage_bucket.sql`

#### Option B: Using Supabase CLI (For Advanced Users)

1. Install Supabase CLI:
   ```powershell
   npm install -g supabase
   ```

2. Link your project:
   ```powershell
   supabase link --project-ref your-project-id
   ```
   (Get project-ref from Settings -> General)

3. Push migrations:
   ```powershell
   supabase db push
   ```

### 5. Verify Database Setup

1. In Supabase dashboard, go to **Database** → **Tables**
2. You should see the following tables:
   - ✅ `users`
   - ✅ `bounties`
   - ✅ `confirmations`
   - ✅ `active_sessions`
   - ✅ `session_messages`

3. Go to **Storage** in the sidebar
4. You should see the `bounty-proofs` bucket

### 6. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure other providers (Google, Discord, etc.) if desired
4. Go to **Authentication** → **URL Configuration**
5. Add your site URL:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: `http://localhost:5173/**` (for development)

### 7. Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages including `@supabase/supabase-js`.

### 8. Start the Development Server

```powershell
npm run dev
```

Your app should now be running at `http://localhost:5173`

## 🧪 Testing Your Setup

### Test Authentication

1. Navigate to `http://localhost:5173`
2. You should see the login/register page
3. Try creating a new account:
   - Enter an email and password
   - Check your email for the confirmation link (if email confirmation is enabled)
   - Or check Supabase dashboard → Authentication → Users to see your new user

### Test Database Connection

1. After logging in, try creating a bounty
2. Go to Supabase dashboard → Table Editor → `bounties`
3. You should see your newly created bounty

## 🔧 Troubleshooting

### Error: "Invalid API key" or "Project URL not found"

- Double-check your `.env` file values match exactly from Supabase dashboard
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env`: Stop (Ctrl+C) and run `npm run dev` again

### Error: "relation 'users' does not exist"

- Your migrations haven't been run
- Go back to Step 4 and run the SQL migrations in the Supabase SQL Editor

### Error: "new row violates row-level security policy"

- RLS policies are blocking your action
- Check Supabase dashboard → Authentication to ensure you're logged in
- Verify the RLS policies in the SQL migrations were created correctly

### Users can't upload images

- Check that the `bounty-proofs` storage bucket exists
- Verify the storage policies were created (Step 4, second migration file)
- Go to Storage → Policies and ensure upload policies are active

### Email confirmation not working

- In development, check Supabase dashboard → Authentication → Users
- Click on the user and manually confirm their email
- Or disable email confirmation: Authentication → Settings → Enable Email Confirmations (toggle off)

## 📚 Next Steps

Once everything is working:

1. **Customize your app**: Modify components in `src/components/`
2. **Add more features**: Extend the database schema as needed
3. **Deploy**: When ready, deploy to Vercel/Netlify/etc.
4. **Update environment variables**: Set production URLs in deployment platform

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

## 📞 Need Help?

- Check the [Supabase Discord](https://discord.supabase.com/)
- Review [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
- Search for similar issues on Stack Overflow

---

**Happy Bounty Hunting! 🎮🎯**
