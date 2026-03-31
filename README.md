# NullNode
<<<<<<< HEAD
NullNode is a minimalist text-based social network with a cyberpunk/Matrix aesthetic.
=======

![NullNode Preview](./public/preview.jpg)

> A modern, minimal, and fully secured social networking experiment.

NullNode is a sleek platform built to visualize connections, share thoughts in real-time, and explore a cyberpunk-inspired digital network. It's built with clean architecture in mind, using a strict MVC backend and robust React abstraction on the frontend.

## ✨ Features

- **Robust Clean Architecture**: A fully separated Model-View-Controller backend schema ensuring maintainability and separation of business logic from routing.
- **JWT Security & Validation**: The API securely verifies standard JWT Tokens across all protected endpoints, keeping unauthorized users out. XSS sanitization safeguards post injections.
- **Real-Time Feed**: Powered by native WebSockets, see new posts instantly as they happen.
- **Dynamic 3D Network**: Visualize the user grid with interactive Three.js environments (City Grid mode).
- **Interactive Terminal**: A pseudo-CLI interface for interacting with the platform.
- **Global & Following Streams**: Seamlessly toggle between all network activity and your curated feed.

## 🛠 Tech Stack

**Frontend:**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- Local Storage State Management + Custom Hooks
- [Three.js](https://threejs.org/) (for 3D network visualizations)
- [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)

**Backend (Node.js & Express):**
- Strict **MVC Layering** (`routes` -> `controllers` -> `services` -> `models`)
- `jsonwebtoken` for secure Auth flows and `xss` for input validation.
- Centralized Error Handling Middleware.
- Custom Local JSON Database wrappers.
- Native WebSockets (`ws`).

## 🚀 Quick Start

Ensure you have Node.js (v18+) installed.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nullnode.git
cd nullnode
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup the database

The database relies on a seeded JSON file. Copy the setup file to the DB instance file:

```bash
cp server/db.seed.json server/db.json
```

### 4. Setup environment variables

```bash
cp .env.example .env
```

### 5. Run the application

To start both the client and the server concurrently:

```bash
npm run dev
```

- The UI will be available at `http://localhost:5173`
- The API & WebSocket Server run on `http://localhost:5174`

## 📁 System Architecture

```text
├── server/
│   ├── routes/        # Express API endpoints
│   ├── controllers/   # Req/Res parsing map
│   ├── services/      # Business logic & sanitization validation
│   ├── models/        # Application Data Access Layer abstraction
│   ├── middlewares/   # JWT parsing & global error formatting
│   ├── utils/         # Core utilities (DB reader, WS broadcast)
│   └── index.js       # Entry point for express config
├── src/
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React Global Store Context
│   ├── hooks/         # Custom React Hooks (JWT management, fetching)
│   ├── data/          # Initial seed data constants
│   └── App.tsx        # Main application layout
```

## 📜 License

[MIT](./LICENSE)
>>>>>>> b1df1ed (V01)
