# 🎯 Setup Checklist for Arc Raiders Bounty Hunter

Use this checklist to track your progress through the setup process.

## ✅ Setup Progress

### Phase 1: Initial Setup
- [x] Clone repository
- [x] Install Node.js dependencies (`npm install`)
- [x] Create `.env` file
- [ ] Update `.env` with your Supabase credentials

### Phase 2: Supabase Account Setup
- [ ] Create Supabase account at https://supabase.com
- [ ] Create new Supabase project
- [ ] Save database password securely
- [ ] Copy Project URL from Settings → API
- [ ] Copy anon public key from Settings → API

### Phase 3: Database Configuration
- [ ] Open Supabase SQL Editor
- [ ] Run migration: `20251113234830_create_bounty_hunter_schema.sql`
- [ ] Run migration: `20251113235352_create_storage_bucket.sql`
- [ ] Verify tables exist in Database → Tables:
  - [ ] `users`
  - [ ] `bounties`
  - [ ] `confirmations`
  - [ ] `active_sessions`
  - [ ] `session_messages`
- [ ] Verify `bounty-proofs` storage bucket exists

### Phase 4: Authentication Setup
- [ ] Enable Email auth in Authentication → Providers
- [ ] Add Site URL: `http://localhost:5173`
- [ ] Add Redirect URL: `http://localhost:5173/**`
- [ ] (Optional) Configure additional auth providers (Google, Discord, etc.)

### Phase 5: Testing
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to `http://localhost:5173`
- [ ] Test user registration
- [ ] Test login
- [ ] Try creating a bounty
- [ ] Verify bounty appears in Supabase dashboard
- [ ] Test image upload (if implemented)

### Phase 6: Production (When Ready)
- [ ] Choose hosting provider (Vercel, Netlify, etc.)
- [ ] Set up production environment variables
- [ ] Update Supabase Auth URLs with production domain
- [ ] Deploy application
- [ ] Test production deployment

## 🆘 Common Issues

### "Invalid API key" Error
- Double-check your `.env` values
- No extra spaces or quotes
- Restart dev server after changing `.env`

### "Table does not exist" Error
- Run the migration SQL files in Supabase SQL Editor
- Check Database → Tables to verify they exist

### Can't Create User
- Check Authentication → Providers (Email should be enabled)
- Verify RLS policies were created from migrations
- Check browser console for detailed error messages

### Can't Upload Images
- Verify `bounty-proofs` bucket exists in Storage
- Check storage policies in the migration file
- Ensure you're logged in when uploading

## 📞 Need Help?

If you get stuck:
1. Read `SUPABASE_SETUP.md` for detailed instructions
2. Check Supabase dashboard for error messages
3. Look at browser console for frontend errors
4. Visit [Supabase Discord](https://discord.supabase.com/)

---

**Once all checkboxes are complete, you're ready to start developing! 🚀**
