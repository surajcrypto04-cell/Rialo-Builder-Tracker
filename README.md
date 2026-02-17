<div align="center">

# ⚡ Rialo Builders Arena

### Where Builders Compete & Community Decides

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-rialo--builders--arena.vercel.app-blue?style=for-the-badge)](https://rialo-builders-arena.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Discord](https://img.shields.io/badge/Discord-OAuth2-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com)

<br />

<p align="center">
  <strong>A community-driven platform for tracking weekly Builder's Hub and Shark Tank participants with Discord-verified voting, GitHub-integrated profiles, and an achievement system.</strong>
</p>

<br />

</div>

---

## 🎯 What is Rialo Builders Arena?

Rialo Builders Arena is a web platform built for the **Rialo Discord community** to:

- 🏗️ **Builder's Hub** — Showcase weekly builder projects in a warm, workshop-themed environment
- 🦈 **Shark Tank** — Feature bold pitches in an intense, ocean-themed arena
- 🗳️ **Community Voting** — Discord-verified voting where Club Members get **2x voting power**
- 👤 **Builder Profiles** — GitHub-integrated profiles with stats, repos, and achievement badges
- 🏆 **Hall of Fame** — Immortalize weekly winners

---

## ✨ Features

### 🔐 Discord-Verified Voting System
- Sign in with Discord OAuth2
- **Automatic server membership verification** — only Rialo members can vote
- **Role-based vote weighting** — Club Members get 2x voting power
- One vote per participant per user (no double voting)

### 🏗️ Two Themed Worlds
- **Builder's Hub** — Warm orange/gold theme with blueprint grid background
- **Shark Tank** — Deep ocean blue/cyan theme with floating bubble animations
- Smooth visual transition between both worlds on the homepage

### 📊 GitHub-Integrated Profiles
- Auto-fetch profile data from GitHub API (avatar, bio, repos, stars, followers)
- **Language breakdown** with visual progress bars
- **Featured repositories** with stars, forks, and language tags
- **Builder journey timeline** showing all participations across weeks
- Stats that count up with smooth animations on scroll

### 🏅 Achievement & Badge System
| Badge | Requirement |
|-------|-------------|
| 🔰 First Timer | Submit your first project |
| 🏆 Champion | Win a Builder's Hub week |
| 🦈 Shark Survivor | Participate in Shark Tank |
| 👑 Shark King | Win a Shark Tank round |
| 💎 Diamond Builder | Win both events |
| ❤️ Fan Favorite | Get 50+ votes on one project |
| 🏗️ Veteran | Participate 5+ times |
| 💻 Code is Law | Link your GitHub profile |
| ⭐ Star Collector | 100+ GitHub stars |
| 🌟 Open Source King | 500+ GitHub stars |
| 🧠 Polyglot Dev | Code in 3+ languages |
| 👥 Community Builder | 100+ GitHub followers |

### 🛠️ Admin Panel
- **Event management** — Create, open/close voting, delete events
- **Participant management** — Add participants with GitHub auto-lookup
- **Winner declaration** — One-click winner selection with auto badge assignment
- **Avatar sync** — Keep avatars consistent across all participant cards
- **Existing user detection** — Auto-fills data when adding returning builders

### 📱 Responsive Design
- Full desktop layout with 3-column card grids
- Mobile-optimized with hamburger menu
- Touch-friendly vote buttons and navigation

### ⚡ Performance
- CSS-only animations (GPU accelerated)
- Intersection Observer for scroll-triggered effects
- Cached GitHub API responses
- Optimized image loading
- Server-side rendering with dynamic data

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | Full-stack React framework (App Router) |
| **TypeScript** | Type safety across the codebase |
| **Supabase** | PostgreSQL database + storage + RLS |
| **NextAuth.js** | Discord OAuth2 authentication |
| **Discord API** | Server membership + role verification |
| **GitHub API** | Builder profile data + repository stats |
| **Tailwind CSS v4** | Utility-first styling |
| **Lucide React** | Icon library |
| **Vercel** | Deployment + hosting |

---

## 📁 Project Structure
src/
├── app/
│ ├── page.tsx # Homepage (Hero + both sections)
│ ├── builders-hub/page.tsx # Full Builder's Hub page
│ ├── shark-tank/page.tsx # Full Shark Tank page
│ ├── profile/[discordId]/ # Dynamic builder profiles
│ ├── hall-of-fame/page.tsx # Winners showcase
│ ├── admin/page.tsx # Admin panel
│ └── api/
│ ├── auth/[...nextauth]/ # Discord OAuth
│ ├── vote/ # Voting endpoint
│ ├── github/[username]/ # GitHub data proxy
│ └── admin/ # Admin CRUD operations
├── components/
│ ├── home/ # Hero, sections, divider
│ ├── admin/ # Event manager, participant form
│ ├── profile/ # Profile page sections
│ ├── Navbar.tsx
│ ├── Footer.tsx
│ ├── BuilderCard.tsx
│ └── VoteButton.tsx
├── lib/
│ ├── supabase.ts # Public database client
│ ├── supabase-admin.ts # Admin database client
│ ├── auth.ts # NextAuth + Discord config
│ ├── github.ts # GitHub API helpers
│ ├── helpers.ts # Avatar sync helpers
│ └── constants.ts # Categories, badges, colors
├── hooks/
│ ├── useInView.ts # Scroll animation trigger
│ └── useCountUp.ts # Animated number counter
└── types/
└── index.ts # TypeScript interfaces

text


---

## 🗄️ Database Schema
events → Weekly Builder's Hub and Shark Tank events
participants → Project submissions linked to events
votes → Vote records with weight (1x or 2x)
builder_profiles → Persistent profiles across all events
site_settings → Global configuration

text


---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Discord Developer Application
- Supabase account
- GitHub Personal Access Token

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/rialo-builders-arena.git
cd rialo-builders-arena
Install dependencies
Bash

npm install
Configure environment variables
Bash

cp .env.example .env.local
Fill in your .env.local:

env

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
RIALO_SERVER_ID=
CLUB_MEMBER_ROLE_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GITHUB_TOKEN=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ADMIN_DISCORD_IDS=
Set up database
Run the SQL schema in your Supabase SQL editor (see /docs/schema.sql)

Run development server

Bash

npm run dev
Open http://localhost:3000
🗳️ Voting System Architecture
text

User clicks "Vote"
  │
  ├─ Not logged in? → Redirect to Discord OAuth
  │
  ├─ Logged in → Check Rialo server membership
  │   ├─ Not a member → "You must be a Rialo member to vote"
  │   └─ Is a member → Check roles
  │       ├─ Has Club Member role → Vote weight = 2x
  │       └─ Regular member → Vote weight = 1x
  │
  ├─ Already voted? → "You already voted for this participant"
  │
  └─ Cast vote → Update participant vote count → Show confirmation



📄 License
This project is built for the Rialo community.

🙏 Acknowledgments
Rialo Community — For the vision and opportunity
Supabase — For the amazing free-tier database
Vercel — For seamless deployment
Discord — For OAuth2 and community infrastructure
