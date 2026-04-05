# Buddy Script — Social Media Platform

A full-stack social media application featuring posts, comments, nested replies, reactions, and sharing. Built with a modern TypeScript stack on both client and server sides.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [API Routes](#api-routes)
8. [Client Routes](#client-routes)
9. [Database Schema](#database-schema)
10. [Caching Strategy](#caching-strategy)
11. [Docker Deployment](#docker-deployment)
12. [Development Scripts](#development-scripts)

---

## Overview

**Buddy Script** is a production-grade social networking application that enables users to share posts, engage through comments and nested replies, react with multiple emoji reactions, and share content across their network. The project is organised as a monorepo containing two primary packages:

- **`client/`** — A Next.js 16 frontend using the App Router, React 19, TailwindCSS 4, and React Query for data management.
- **`server/`** — An Express 5 backend running on Bun, backed by PostgreSQL via Prisma ORM, with Redis caching and S3-compatible image storage.

The application supports both email/password authentication and Google OAuth, uses cookie-based sessions with automatic token refresh, and implements Redis caching across every read endpoint with proper invalidation on mutations.

---

## Tech Stack

### Backend (`server/`)

| Category   | Technology                        |
| ---------- | --------------------------------- |
| Runtime    | Bun                               |
| Framework  | Express 5                         |
| Language   | TypeScript                        |
| Database   | PostgreSQL (via Prisma 7)         |
| Cache      | Redis (ioredis)                   |
| Auth       | Better Auth + JWT                 |
| Storage    | AWS S3 / MinIO                    |
| Validation | Zod                               |
| Logging    | Winston (daily rotation) + Morgan |
| API Docs   | Swagger UI                        |

### Frontend (`client/`)

| Category      | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | Next.js 16 (App Router)                 |
| UI Library    | React 19                                |
| Styling       | TailwindCSS 4                           |
| Data Fetching | TanStack React Query 5                  |
| Forms         | React Hook Form + Zod                   |
| Theme         | next-themes (dark mode)                 |
| Notifications | Sonner                                  |
| Icons         | Centralized SVG library (`lib/svg.tsx`) |

---

## Project Structure

```
buddy-script/
├── client/                          # Next.js frontend
│   ├── app/
│   │   ├── (auth)/                  # Auth group (login, registration)
│   │   ├── (feed)/                  # Feed group (home, post detail)
│   │   │   ├── layout.tsx           # Sidebars, headers, nav
│   │   │   ├── page.tsx             # Home feed
│   │   │   └── feed/[id]/           # Individual post detail
│   │   ├── api/auth/google/callback # OAuth callback route handler
│   │   └── auth/google/callback     # Deprecated, kept for compatibility
│   ├── components/
│   │   ├── auth/                    # Auth forms, input fields
│   │   ├── feed/                    # Feed components, modals
│   │   ├── ui/                      # Reusable UI (Modal, Avatar)
│   │   └── theme/                   # Theme provider + toggle
│   ├── hooks/                       # React Query hooks
│   ├── lib/
│   │   ├── api.ts                   # Server-side API proxy
│   │   ├── client-api.ts            # Client-side fetch
│   │   ├── svg.tsx                  # Central icon library
│   │   └── utils.ts
│   └── Dockerfile
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/             # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── post/
│   │   │   │   ├── comment/
│   │   │   │   ├── reply/
│   │   │   │   ├── like/
│   │   │   │   └── share/
│   │   │   ├── middlewares/         # Auth check, error handler, validation
│   │   │   ├── lib/                 # Prisma, Better Auth client
│   │   │   └── utils/               # Cache, tokens, cookies, logger
│   │   ├── config/                  # Redis, secrets (env parsing)
│   │   └── server.ts                # Entry point
│   ├── prisma/
│   │   ├── schema/                  # Prisma schema files
│   │   └── migrations/              # Migration history
│   └── Dockerfile
│
├── docker-compose.yml               # Full-stack Docker orchestration
└── README.md
```

---

## Features

### Authentication

- Email/password registration and login
- Google OAuth via Better Auth
- JWT access + refresh tokens with automatic rotation
- HttpOnly secure cookies
- Server-side session validation
- Automatic redirect on 401 responses

#### Why Better Auth instead of a direct OAuth implementation?

While Google OAuth could be wired up directly with a few HTTP calls, this project uses [Better Auth](https://www.better-auth.com/) because it is designed to scale with the application. As the user base and feature set grow, Better Auth provides the following benefits out of the box — benefits that would otherwise require substantial custom code:

- **Centralised session management.** Every login, regardless of provider (email/password, Google, or future providers), creates a session record in the database. This gives a single source of truth for authentication state across the entire application.
- **Device & session tracking.** Each session stores the IP address, user agent, and creation timestamp, so it is straightforward to show a user the list of devices and browsers they have signed in from, along with _when_ and _how many_ active sessions exist at any given moment.
- **Granular session invalidation.** Any individual session can be revoked at any time without forcing the user to log out everywhere. This is critical for features such as "Log out from other devices", handling lost/stolen devices, or responding to suspicious activity.
- **Easy provider extensibility.** Adding GitHub, Apple, Facebook, or magic-link login later requires only a few lines of configuration instead of a full re-implementation of the OAuth dance.
- **Battle-tested security.** CSRF protection, cookie signing, token rotation, and email verification flows are handled by a maintained library rather than hand-rolled code that can easily drift out of date.

In short, Better Auth is an investment in the long-term maintainability and security of the platform: if Buddy Script grows to support multiple login methods, team accounts, or session audit logs, the required infrastructure is already in place.

### Posts

- Create posts with optional image upload (S3/MinIO)
- Public or private visibility
- Infinite scroll feed with cursor-based pagination
- Single post pages with SEO meta tags (OpenGraph + Twitter cards)
- Server-rendered post detail pages for shareable links
- Inline edit & delete for the post author

### Reactions

- Six distinct reactions: 👍 Like, ❤️ Love, 😂 Haha, 😢 Sad, 😮 Wow, 😡 Angry
- Hover-based reaction selector
- Recent liker avatars displayed on each post
- Modal to view all users who reacted, filterable by reaction type

### Comments & Replies

- Create, edit, and delete comments on posts
- Nested replies on any comment
- Reactions on comments and replies
- Inline edit and three-dot menu for owner actions

### Sharing

- Modal to copy shareable post link
- Share count increments on copy
- Modal to view the list of users who shared a post

### Other

- Dark mode with persistent preference
- Responsive layout (desktop + mobile with dedicated header and bottom nav)
- Skeleton loading states while the feed loads
- Reusable `Modal` component driven by props
- Reusable `AvatarGroup` component for stacked avatars
- Password show/hide toggle with eye icon

---

## Getting Started

### Prerequisites

- **Bun** (v1.1 or later) — [https://bun.sh](https://bun.sh)
- **PostgreSQL** (v14 or later)
- **Redis** (v6 or later)
- **Node.js** (v20+) is acceptable as a fallback runtime
- An S3-compatible object store (AWS S3 or MinIO)

### Local Development

Clone the repository and install dependencies for each package:

```bash
git clone <repository-url> buddy-script
cd buddy-script

# Install server dependencies
cd server
bun install
bunx prisma migrate deploy
bunx prisma generate
bun run dev

# In another terminal, install and start the client
cd ../client
bun install
bun run dev
```

The server will start at `http://localhost:5000` and the client at `http://localhost:3000`.

---

## Environment Variables

Both packages require their own `.env` file. Copy the provided examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Server Variables (`server/.env`)

| Variable               | Description                                  | Example                                              |
| ---------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `PORT`                 | Port the Express server listens on           | `5000`                                               |
| `NODE_ENV`             | Runtime environment                          | `development`                                        |
| `DATABASE_URL`         | PostgreSQL connection string                 | `postgresql://user:pass@localhost:5432/buddy_script` |
| `REDIS_URL`            | Redis connection string                      | `redis://localhost:6379`                             |
| `BETTER_AUTH_SECRET`   | Secret used by Better Auth to sign sessions  | `random_32_char_string`                              |
| `BETTER_AUTH_URL`      | Public URL of the backend                    | `http://localhost:5000`                              |
| `ACCESS_TOKEN_SECRET`  | JWT access token secret                      | `random_string`                                      |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret                     | `random_string`                                      |
| `ACCESS_TOKEN_EXPIRY`  | Access token TTL (ms)                        | `900000`                                             |
| `REFRESH_TOKEN_EXPIRY` | Refresh token TTL (ms)                       | `604800000`                                          |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                       | `xxxxx.apps.googleusercontent.com`                   |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                   | `GOCSPX-xxxxxxx`                                     |
| `S3_ENDPOINT`          | S3-compatible endpoint URL                   | `http://localhost:9000`                              |
| `S3_REGION`            | S3 region                                    | `us-east-1`                                          |
| `S3_ACCESS_KEY`        | Access key                                   | `minioadmin`                                         |
| `S3_SECRET_KEY`        | Secret key                                   | `minioadmin`                                         |
| `S3_BUCKET`            | Bucket name                                  | `buddy-script-uploads`                               |
| `CLIENT_WHITE_LIST`    | Comma-separated list of allowed CORS origins | `http://localhost:3000`                              |
| `CLIENT_URL`           | Primary client URL for OAuth redirects       | `http://localhost:3000`                              |

### Client Variables (`client/.env`)

| Variable              | Description                                                   | Example                 |
| --------------------- | ------------------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend base URL                                              | `http://localhost:5000` |
| `NEXT_PUBLIC_APP_URL` | Public frontend URL (used for OAuth redirects behind proxies) | `http://localhost:3000` |

---

## API Routes

All backend routes are prefixed with `/api/v1`. Authenticated routes require a valid access token cookie.

### Authentication — `/api/v1/auth`

| Method | Path               | Description                          | Auth                     |
| ------ | ------------------ | ------------------------------------ | ------------------------ |
| `POST` | `/register`        | Register a new user                  | ❌                       |
| `POST` | `/login`           | Log in with email + password         | ❌                       |
| `GET`  | `/me`              | Get the current authenticated user   | ✅                       |
| `POST` | `/refresh`         | Refresh access + refresh tokens      | ❌ (uses refresh cookie) |
| `GET`  | `/google`          | Redirect to Google OAuth             | ❌                       |
| `GET`  | `/google/callback` | OAuth callback — redirects to client | ❌                       |

### Posts — `/api/v1/posts`

| Method   | Path   | Description                               | Auth |
| -------- | ------ | ----------------------------------------- | ---- |
| `GET`    | `/`    | Get paginated feed (cursor-based)         | ✅   |
| `GET`    | `/:id` | Get a single post with recent likers      | ✅   |
| `POST`   | `/`    | Create a post (multipart, image optional) | ✅   |
| `PATCH`  | `/:id` | Update a post (owner only)                | ✅   |
| `DELETE` | `/:id` | Soft-delete a post (owner only)           | ✅   |

### Comments — `/api/v1/comments`

| Method   | Path            | Description                        | Auth |
| -------- | --------------- | ---------------------------------- | ---- |
| `GET`    | `/post/:postId` | List comments for a post           | ✅   |
| `POST`   | `/post/:postId` | Create a comment                   | ✅   |
| `PATCH`  | `/:id`          | Update a comment (owner only)      | ✅   |
| `DELETE` | `/:id`          | Soft-delete a comment (owner only) | ✅   |

### Replies — `/api/v1/replies`

| Method   | Path                  | Description                      | Auth |
| -------- | --------------------- | -------------------------------- | ---- |
| `GET`    | `/comment/:commentId` | List replies for a comment       | ✅   |
| `POST`   | `/comment/:commentId` | Create a reply                   | ✅   |
| `PATCH`  | `/:id`                | Update a reply (owner only)      | ✅   |
| `DELETE` | `/:id`                | Soft-delete a reply (owner only) | ✅   |

### Likes — `/api/v1/likes`

| Method | Path                  | Description                                                    | Auth |
| ------ | --------------------- | -------------------------------------------------------------- | ---- |
| `POST` | `/post/:postId`       | Toggle reaction on a post                                      | ✅   |
| `POST` | `/comment/:commentId` | Toggle reaction on a comment                                   | ✅   |
| `POST` | `/reply/:replyId`     | Toggle reaction on a reply                                     | ✅   |
| `GET`  | `/:type/:id`          | List users who reacted (type = `post` \| `comment` \| `reply`) | ✅   |

### Shares — `/api/v1/shares`

| Method | Path       | Description                           | Auth |
| ------ | ---------- | ------------------------------------- | ---- |
| `POST` | `/:postId` | Share a post (increments share count) | ✅   |
| `GET`  | `/:postId` | List users who shared a post          | ✅   |

### Documentation

- `GET /api/v1/api-docs` — Swagger UI for the full API contract

---

## Client Routes

| Path                        | Type          | Description                                        |
| --------------------------- | ------------- | -------------------------------------------------- |
| `/`                         | Server        | Home feed (protected)                              |
| `/feed/[id]`                | Server        | Single post detail page with dynamic OG metadata   |
| `/login`                    | Client        | Login form                                         |
| `/registration`             | Client        | Registration form                                  |
| `/api/auth/google/callback` | Route handler | Sets auth cookies and redirects after Google OAuth |

Route groups `(auth)` and `(feed)` organise pages without affecting URLs. The `(feed)` group applies the shared layout with header, sidebars, and mobile nav.

---

## Database Schema

Prisma schema files live in `server/prisma/schema/`. The primary models are:

- **User** — `id`, `firstName`, `lastName`, `email`, `image`, `status` (`ACTIVE` \| `BLOCKED` \| `DELETED`), soft-delete fields, timestamps
- **Session**, **Account**, **Verification** — managed by Better Auth
- **Post** — `id` (UUID v7), `content`, `image`, `visibility` (`PUBLIC` \| `PRIVATE`), `shareCount`, soft-delete fields
- **Comment** — belongs to a `Post`, linked to `Replies` and `Likes`
- **Reply** — belongs to a `Comment`
- **Like** — polymorphic via `likeableType` (`POST` \| `COMMENT` \| `REPLY`) with a `reaction` string
- **Share** — unique per user/post pair

All relational IDs use UUID v7 for ordered, time-sortable primary keys.

---

## Caching Strategy

The server uses Redis to cache every read endpoint. Cache keys and TTLs are:

| Key Pattern                      | TTL   | Invalidation Trigger                                                  |
| -------------------------------- | ----- | --------------------------------------------------------------------- |
| `feed:{userId}:{cursor}:{limit}` | 60 s  | Post create/update/delete, like on post, comment create/delete, share |
| `post:{postId}:{userId}`         | 120 s | Post update/delete, like on post, share                               |
| `comments:{postId}:{userId}`     | 120 s | Comment create/update/delete, like on comment, reply create/delete    |
| `replies:{commentId}:{userId}`   | 120 s | Reply create/update/delete, like on reply                             |
| `likes:{type}:{id}`              | 120 s | Any like toggled on the subject                                       |
| `shares:{postId}`                | 120 s | Share created                                                         |
| `user:{userId}`                  | 300 s | (refreshed on TTL expiry)                                             |

Mutations use `cache.delByPattern()` to invalidate groups of keys, ensuring no stale data is served.

---

## Docker Deployment

Both `client/` and `server/` ship with multi-stage `Dockerfile`s using the `oven/bun:1` base image. The repository root includes a `docker-compose.yml` that orchestrates the full stack (client + server + PostgreSQL + Redis).

### Environment File for Docker

> ⚠️ **Important:** The `docker-compose.yml` reads environment variables from a single `.env` file **at the project root**. Create it before running compose:
>
> ```bash
> cp server/.env.example .env
> # then edit .env with your production secrets and merge client vars too
> ```
>
> The `.env` file at the root is what Docker Compose uses for variable substitution and for the `env_file` directive of every service. Values such as `DATABASE_URL`, `REDIS_URL`, `BETTER_AUTH_SECRET`, and Google OAuth credentials must be present in this root `.env` file.

### Running with Docker Compose

```bash
# From the project root
docker compose up -d --build

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

The services will be available at:

- Client: `http://localhost:3000`
- Server: `http://localhost:5000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

## Development Scripts

### Server (`server/package.json`)

| Command                      | Purpose                         |
| ---------------------------- | ------------------------------- |
| `bun run dev`                | Start the server in watch mode  |
| `bun run build`              | Build TypeScript to `dist/`     |
| `bun run start`              | Run the built server            |
| `bunx prisma migrate dev`    | Apply migrations in development |
| `bunx prisma migrate deploy` | Apply migrations in production  |
| `bunx prisma generate`       | Regenerate the Prisma client    |
| `bunx prisma studio`         | Open Prisma Studio              |

### Client (`client/package.json`)

| Command         | Purpose                   |
| --------------- | ------------------------- |
| `bun run dev`   | Start Next.js dev server  |
| `bun run build` | Build for production      |
| `bun run start` | Run the production server |
| `bun run lint`  | Run ESLint                |
