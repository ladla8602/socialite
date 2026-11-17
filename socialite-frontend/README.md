# Socialite Frontend

Socialite Frontend is built with **React 18**, **TypeScript**, **Vite**, **Redux Toolkit**, **React Router v6**, and **Tabler UI**.

---

## Prerequisites

Ensure you have the following installed:
- **Node.js**: `v18+` or `v20+` (compatible with `v20.17.0+` and `v22.x`)
- **Package Manager**: `yarn` (`npm install -g yarn` or `corepack enable`)
- **Socialite Backend**: Running on `http://localhost:5000` (or as configured in `.env`)

---

## 1. Environment Configuration

1. Create a `.env` file in the `socialite-frontend` directory by copying the example:
   ```bash
   cp .env.example .env
   ```

2. Review the environment variables:
   ```env
   # Backend API Proxy Target
   VITE_API_TARGET=http://localhost:5000

   # Application Base URL
   VITE_URL_GENERATION=http://localhost:3000

   # External / Social Links (Optional)
   VITE_URL_FACEBOOK=https://facebook.com
   VITE_URL_INSTAGRAM=https://instagram.com
   VITE_URL_OTHER=http://localhost:3000
   ```

> **Note**: Vite's dev server proxies any `/api/*` requests to the target configured in `VITE_API_TARGET`.

---

## 2. Installation

Install all dependencies using Yarn:

```bash
yarn install
```

---

## 3. Running the Application

### Development Server
Start the local development server with HMR (Hot Module Replacement):

```bash
yarn dev
```

The frontend application will be available at:
- **Local URL**: [http://localhost:3000](http://localhost:3000)

### Production Build
To create an optimized production build:

```bash
yarn build
```

To locally preview the production build:

```bash
yarn preview
```

---

## 4. Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Runs the Vite development server on port 3000 |
| `yarn build` | Runs TypeScript type checking and builds the production bundle in `dist/` |
| `yarn preview` | Serves the production build locally for verification |
| `yarn lint` | Lints the project files with ESLint |
