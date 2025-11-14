# 🔑 Supabase API Keys Guide

## ⚠️ CRITICAL: Understanding Supabase Keys

Supabase provides **two different keys** - using the wrong one is a major security risk!

### ✅ anon (public) Key - USE THIS IN YOUR .ENV
- **Purpose**: Safe for client-side/browser code
- **Security**: Respects Row Level Security (RLS) policies
- **Format**: JWT token starting with `eyJ...`
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3a2FndXVmb2J2a3llbHVhamNvIiwicm9sZSI6ImFub24i...`
- **Location**: Settings → API → Project API keys → **"anon public"**

### ❌ service_role (secret) Key - NEVER USE IN BROWSER
- **Purpose**: Server-side operations only (bypasses all security)
- **Security**: Full admin access, ignores RLS policies
- **Format**: JWT token or starts with `sb_secret_`
- **Risk**: If exposed in browser, anyone can access/delete ALL your data!
- **Location**: Settings → API → Project API keys → **"service_role secret"**

---

## 🐛 Current Error: "Forbidden use of secret API key in browser"

This error means you're using the **service_role secret key** in your `.env` file.

### Your Current (WRONG) Key:
```
VITE_SUPABASE_ANON_KEY=sb_secret_dAt_HFis53-hXlmzoCryRQ_Atq6nioL
```
☝️ This is a **secret key** (notice `sb_secret_` prefix)

---

## ✅ How to Fix

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/lwkaguufobvkyeluajco/settings/api
2. Scroll down to **"Project API keys"** section

### Step 2: Copy the Correct Key
Look for a section like this:

```
┌─────────────────────────────────────────────────┐
│ Project API keys                                 │
├─────────────────────────────────────────────────┤
│                                                  │
│ anon public                                      │
│ This key is safe to use in a browser if you     │
│ have enabled Row Level Security for your tables │
│                                                  │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...          │
│ [Copy]                                           │
│                                                  │
│ ─────────────────────────────────────────────── │
│                                                  │
│ service_role secret                              │
│ This key has the ability to bypass Row Level    │
│ Security. Never share it publicly.               │
│                                                  │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...          │
│ [Copy]                                           │
└─────────────────────────────────────────────────┘
```

**Click "Copy" under "anon public"** (the first one)

### Step 3: Update Your .env File
Replace the current key with the anon public key:

```env
VITE_SUPABASE_URL=https://lwkaguufobvkyeluajco.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.paste_your_anon_key_here
```

### Step 4: Save and Refresh
1. Save the `.env` file
2. Refresh your browser (F5)
3. Try signing up again

---

## 🔒 Security Best Practices

### ✅ DO:
- Use **anon public** key for frontend/browser code
- Use **service_role secret** key ONLY in backend/server code
- Keep `.env` file in `.gitignore` (already done ✅)
- Regenerate keys if accidentally exposed

### ❌ DON'T:
- Never commit secret keys to git
- Never use service_role key in browser
- Never share secret keys publicly

---

## 🧪 Test After Fix

After updating your `.env` with the correct key:

1. Refresh browser
2. Try to sign up
3. You should see a confirmation email or success message
4. Check Supabase Dashboard → Authentication → Users to verify

---

## 💡 Quick Comparison

| Feature | anon (public) | service_role (secret) |
|---------|---------------|----------------------|
| Use in browser | ✅ Safe | ❌ NEVER |
| Respects RLS | ✅ Yes | ❌ No (bypasses) |
| Can see all data | ❌ No | ✅ Yes (admin) |
| Format hint | JWT starting with `eyJ` | JWT or `sb_secret_` |
| In your .env | ✅ USE THIS | ❌ DON'T USE |

---

**Need more help?** Check the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
