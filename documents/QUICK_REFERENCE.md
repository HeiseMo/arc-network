# 📝 Quick Reference - Arc Raiders Bounty Hunter

## 🚀 Quick Commands

```powershell
# Initial setup
.\setup.ps1                # Check environment & install dependencies

# Open Supabase dashboard pages
.\open-dashboard.ps1       # Helper to open relevant dashboard URLs

# Development
npm run dev                # Start dev server (http://localhost:5173)
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # Run linter
npm run typecheck          # Check TypeScript types
```

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `.env` | Your Supabase credentials (DO NOT commit!) |
| `src/lib/supabase.js` | Supabase client configuration |
| `supabase/migrations/*.sql` | Database schema files |
| `SUPABASE_SETUP.md` | Complete setup guide |
| `SETUP_CHECKLIST.md` | Track your setup progress |

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User profiles, reputation, roles |
| `bounties` | Active bounties on players |
| `confirmations` | Proof of bounty kills |
| `active_sessions` | Live session tracking |
| `session_messages` | Real-time chat messages |

## 🔐 Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

Get these from: Supabase Dashboard → Settings → API

## 📂 Project Structure

```
src/
├── components/
│   ├── Auth/          # Login, Register, AuthPage
│   ├── Bounty/        # BountyCard, BountyFeed, BountyForm
│   ├── Layout/        # Navbar
│   ├── Leaderboard/   # Leaderboard
│   ├── Notifications/ # NotificationToast
│   └── Session/       # SessionManager
├── context/           # AuthContext
├── lib/              # Supabase client
└── pages/            # Dashboard
```

## 🔗 Useful Supabase URLs

Replace `YOUR-PROJECT-ID` with your actual project ID:

- **Dashboard**: `https://supabase.com/dashboard/project/YOUR-PROJECT-ID`
- **API Settings**: `https://supabase.com/dashboard/project/YOUR-PROJECT-ID/settings/api`
- **SQL Editor**: `https://supabase.com/dashboard/project/YOUR-PROJECT-ID/sql`
- **Tables**: `https://supabase.com/dashboard/project/YOUR-PROJECT-ID/editor`
- **Storage**: `https://supabase.com/dashboard/project/YOUR-PROJECT-ID/storage/buckets`
- **Auth**: `https://supabase.com/dashboard/project/YOUR-PROJECT-ID/auth/users`

## 🐛 Troubleshooting Quick Fixes

### Environment Variables Not Working
```powershell
# Stop dev server (Ctrl+C)
# Update .env file
# Restart server
npm run dev
```

### Need to Re-run Migrations
1. Go to SQL Editor in Supabase
2. Paste contents of migration file
3. Click "Run"

### Clear All Data (Fresh Start)
1. Supabase Dashboard → Table Editor
2. Select table → Delete all rows
3. Or drop and recreate tables via SQL Editor

## 📚 Documentation Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 🆘 Getting Help

1. Check browser console for errors (F12)
2. Check Supabase Dashboard → Logs
3. Read `SUPABASE_SETUP.md` for detailed help
4. Visit [Supabase Discord](https://discord.supabase.com)
5. Check [GitHub Issues](https://github.com/HeiseMo/arc-network/issues)

## ✅ Health Check

Your setup is working if:
- ✅ `npm run dev` starts without errors
- ✅ You can visit http://localhost:5173
- ✅ Registration/login works
- ✅ Creating a bounty works
- ✅ Bounty appears in Supabase dashboard

---

**Keep this file handy for quick reference! 📌**
