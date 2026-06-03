# Test Management Application

A responsive web application built with **React + TypeScript** for managing tests, questions, and publishing test papers.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Development](#setup--development)
- [Running the App](#running-the-app)
- [API Integration & Mock Mode](#api-integration--mock-mode)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Demo
*(Add a screenshot or link to a live demo if available.)*

## Features
- User authentication with JWT token handling.
- Dashboard displaying all tests with create/edit/delete actions.
- Test creation form with rich validation (React Hook Form + Zod).
- Question builder supporting multiple‑choice questions, marks, negative marks, and correct answer selection.
- Preview & publish workflow.
- Graceful **Mock Mode** fallback when the staging API returns errors.
- Responsive UI built with Tailwind CSS v4, featuring modern design tokens and smooth micro‑animations.

## Tech Stack
- **React 18** with **TypeScript**
- **Vite** build tooling
- **React Router** for client‑side routing
- **Zustand** for global state management
- **React Hook Form** + **Zod** for form handling and validation
- **Axios** for HTTP requests (with interceptors for auth token)
- **Tailwind CSS v4** for styling (custom design tokens, Inter & Outfit fonts)
- **Lucide React** icons

## Setup & Development
```bash
# Clone the repository
git clone <repo-url>
cd test-management-application

# Install dependencies
npm install

# Environment variables (create a .env file at the project root)
# .env
VITE_API_BASE_URL=https://admin-moderator-backend-staging.up.railway.app/api

# Start the development server
npm run dev
```
The app will be available at `http://localhost:5173`.

## Running the App
- **Login** – Use the provided credentials:
  - Username: `vedant-admin`
  - Password: `vedant123`
- After login you will be redirected to the dashboard where you can manage tests.
- All forms include client‑side validation; error messages appear inline.

## API Integration & Mock Mode
The application talks to the staging backend at the URL defined in `VITE_API_BASE_URL`. Because the staging environment can be unstable, each store (`authStore`, `testStore`, `questionStore`) falls back to **Mock Mode** when an API request fails (e.g., 500 error). This ensures the UI remains functional for demo purposes.

## Deployment
The project can be built for production and deployed to any static‑hosting platform (Vercel, Netlify, Railway, etc.).
```bash
# Build production assets
npm run build
```
Deploy the contents of the `dist/` directory.

### Railway (example)
1. Create a new Railway project and link the repository.
2. Set the environment variable `VITE_API_BASE_URL` to the production API endpoint.
3. Enable the *Static Site* deployment and point to the `dist` folder.

## Project Structure
```
src/
├─ api/                 # Axios instance & service files
├─ components/          # Reusable UI components (Button, Input, Loader, Modal, etc.)
├─ pages/               # Page components (Login, Dashboard, TestForm, Questions, Preview)
├─ store/               # Zustand stores (authStore, testStore, questionStore)
├─ types/               # TypeScript type definitions
├─ utils/               # Validation schemas (Zod)
├─ routes/             # React Router configuration & protected routes
├─ App.tsx, main.tsx    # Entry point
└─ index.css            # Tailwind base & custom design tokens
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
MIT © 2026 NXTWAVE
