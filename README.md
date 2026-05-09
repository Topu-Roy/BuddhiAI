# BuddhiAI

An AI-powered quiz application built with modern technologies. Generate quizzes on any topic using Google Gemini AI and test your knowledge.

![BuddhiAI](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **AI Quiz Generation** — Create quizzes instantly using Google Gemini AI
- **Multiple Categories** — Science, Technology, History, and more
- **Progress Tracking** — Track your quiz history and scores
- **Social Authentication** — Sign in with Google or GitHub
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: tRPC, Prisma, PostgreSQL
- **Authentication**: Better Auth
- **AI**: Google Gemini (via @ai-sdk/google)
- **UI Components**: shadcn/ui, Motion

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Bun (recommended) or npm/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/buddhi-ai.git
cd buddhi-ai

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and auth credentials

# Generate Prisma client
bun run postinstall
# or
npx prisma generate

# Push database schema
bun run db:push
# or
npx prisma db push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
# Database (PostgreSQL)
DATABASE_URL=

# Auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Next.js
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint and TypeScript checks |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:studio` | Open Prisma Studio |

## Project Structure

```
buddhi-ai/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (auth, quiz explore)
│   ├── (protected)/      # Protected routes (dashboard, quiz)
│   └── _components/       # Shared components
├── components/            # UI components (shadcn/ui)
├── server/                # Backend (tRPC, Prisma)
│   ├── api/              # tRPC routers and procedures
│   └── db.ts             # Database connection
├── lib/                   # Utilities and helpers
└── prisma/                # Database schema
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/auth/sign-in` | Sign in (Google/GitHub) |
| `/quiz/explore` | Browse public quizzes |
| `/quiz/take/[id]` | Take a quiz |
| `/dashboard` | User dashboard |
| `/profile` | User profile |
| `/admin` | Admin dashboard |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with 💖 by [Topu](https://github.com/topuroy)