# NullNode

> A cyberpunk social network built around an explorable 3D city.

NullNode is a sleek, minimal platform where each user owns a house in a shared neon-lit city. Walk through the streets, visit residences, share thoughts in real-time, and explore a cyberpunk-inspired digital network — all rendered with Three.js in a first-person immersive view.

## ✨ Features

- **Explorable 3D City** — Walk through a procedurally generated cyberpunk city with WASD controls and mouse look. Each user has a unique house with a neon nameplate.
- **Real-Time Feed** — Powered by native WebSockets. See new posts and notifications as they happen.
- **Clean Architecture** — Strict MVC backend with Zod validation, JWT security, and a modular frontend built with isolated Zustand stores.
- **Dual Theme System** — Seamless Dark (Night) and Light (Grid Day) themes that sync across the entire UI and the 3D engine.
- **Interactive Terminal** — A pseudo-CLI interface for power users.
- **Global & Following Streams** — Toggle between all network activity and your curated feed.
- **Mobile-First Layout** — Responsive design with a bottom navigation bar on mobile and a full sidebar on desktop.

## 🛠 Tech Stack

**Frontend:**
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) with CSS variable design tokens
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [Three.js](https://threejs.org/) — First-person 3D city engine
- [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/) for animations
- [Zod](https://zod.dev/) for runtime validation

**Backend (Node.js & Express):**
- Strict **MVC Layering** (`routes` → `controllers` → `services` → `models`)
- `jsonwebtoken` for secure auth flows
- `xss` for input sanitization
- Centralized Error Handling Middleware
- Custom JSON Database wrappers
- Native WebSockets (`ws`) via `wsManager`

## 🚀 Quick Start

Ensure you have **Node.js v18+** installed.

### 1. Clone the repository

```bash
git clone https://github.com/pedrocabralrtdx/NullNode.git
cd NullNode
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup the database

```bash
cp server/db.seed.json server/db.json
```

### 4. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your `JWT_SECRET`.

### 5. Run the application

```bash
npm run dev
```

- **UI**: `http://localhost:5173`
- **API & WebSocket Server**: `http://localhost:5174`

### 6. Production build

```bash
npm run build
npm start
```

## 📜 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start frontend + backend concurrently |
| `npm run dev:client` | Start only the Vite dev server |
| `npm run dev:server` | Start only the Express API server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm start` | Start the production API server |

## 🎮 3D City Controls

| Action | Key |
| --- | --- |
| Move Forward | `W` / `↑` |
| Move Backward | `S` / `↓` |
| Strafe Left | `A` / `←` |
| Strafe Right | `D` / `→` |
| Look Around | Mouse |
| Select House | Click / `Enter` |
| Release Cursor | `Esc` |

## 📁 Project Architecture

```text
├── server/
│   ├── controllers/     # Request parsing + Zod validation
│   ├── middlewares/      # JWT auth & global error handling
│   ├── models/           # Data Access Layer (JSON DB)
│   ├── routes/           # Express API endpoints
│   ├── services/         # Business logic & sanitization
│   ├── utils/            # DB reader, WebSocket manager, Zod schemas
│   ├── db.seed.json      # Initial seed data
│   └── index.js          # Server entry point
├── src/
│   ├── app/              # ThemeContext, ErrorBoundary
│   ├── components/       # Reusable UI components
│   │   └── ui/           # Animated sub-components
│   ├── contexts/         # React Store Context
│   ├── data/             # Seed data constants
│   ├── engine3d/         # CityEngine (Three.js first-person city)
│   ├── features/         # Feature stores (auth, feed — Zustand)
│   ├── hooks/            # Custom React Hooks (useAuth, usePosts)
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript module declarations
│   ├── App.tsx           # Main application layout
│   ├── main.tsx          # React entry point
│   ├── index.css         # Design system & theme tokens
│   └── types.ts          # Shared TypeScript interfaces
├── .env.example          # Environment variable template
├── index.html            # HTML entry point
├── package.json          # Dependencies & scripts
├── tailwind.config.cjs   # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite bundler configuration
└── LICENSE               # MIT License
```

## 📜 License

[MIT](./LICENSE) — zezortdx

