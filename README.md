# 🎮 Arc Raiders Bounty Hunter

A real-time bounty tracking web application for Arc Raiders players. Report kills, post bounties, and track active sessions with the community.

## ✨ Features

- 🎯 **Bounty System**: Report and track bounties on other players
- 👥 **User Profiles**: Reputation system and role-based access
- 💬 **Session Chat**: Real-time messaging within game sessions
- 📍 **Active Sessions**: Track which hunters are in your session
- 🔐 **Secure Authentication**: Powered by Supabase Auth
- 📷 **Proof Upload**: Image/video evidence for bounties and confirmations
- ⏰ **24-Hour Expiry**: Bounties automatically expire after 24 hours

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/HeiseMo/arc-network.git
cd arc-network
```

### 2. Run Setup Script

```powershell
.\setup.ps1
```

This will check your environment and install dependencies.

### 3. Set Up Supabase

Follow the comprehensive guide in **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** to:
- Create a Supabase project
- Configure your `.env` file
- Run database migrations
- Set up authentication

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app! 🎉

## 📁 Project Structure

```
arc-network/
├── src/
│   ├── components/      # React components
│   │   ├── Auth/       # Login & Registration
│   │   ├── Bounty/     # Bounty management
│   │   ├── Layout/     # Navigation & Layout
│   │   ├── Leaderboard/
│   │   └── Session/    # Session management
│   ├── context/        # React Context (Auth)
│   ├── lib/           # Supabase client
│   └── pages/         # Page components
├── supabase/
│   └── migrations/    # Database schema
├── .env.example       # Environment template
└── SUPABASE_SETUP.md  # Detailed setup guide
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Icons**: Lucide React

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## 🗄️ Database Schema

The app uses the following main tables:
- `users` - User profiles with reputation and roles
- `bounties` - Active bounty tracking
- `confirmations` - Bounty kill confirmations
- `active_sessions` - Live session tracking
- `session_messages` - Real-time chat

See migration files in `supabase/migrations/` for full schema details.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase Auth URLs with your production URL

### Deploy to Netlify

1. Push your code to GitHub
2. Create new site from Git in Netlify
3. Add environment variables
4. Build command: `npm run build`
5. Publish directory: `dist`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Need Help?

- 📖 Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup help
- 🐛 [Report issues](https://github.com/HeiseMo/arc-network/issues)
- 💬 Check [Supabase Discord](https://discord.supabase.com/)

---

Built with ❤️ for the Arc Raiders community