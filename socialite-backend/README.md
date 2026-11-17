# Socialite Backend

Socialite Backend is built with **NestJS**, **GraphQL (Apollo Server)**, **TypeORM (MySQL)**, **Redis (Bull Queue)**, and **JWT / Google Authentication**.

---

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js**: `v20.17.0` or higher (`v20.x` recommended)
- **Package Manager**: `yarn` (`npm install -g yarn` or `corepack enable`)
- **MySQL**: `v8.0` or higher running on port `3306`
- **Redis**: `v6+` or `v7+` running on port `6379` (used for background job queues via Bull)

*(Tip: You can start MySQL and Redis from the root directory with `docker compose up -d`)*

---

## 1. Environment Configuration

1. Create a `.env` file in the `socialite-backend` directory by copying the example:
   ```bash
   cp .env.example .env
   ```

2. Review and update the environment variables in `.env`:
   ```env
   # Server Port
   PORT=5001
   NODE_ENV=development

   # Database Configuration (MySQL)
   DATABASE_TYPE=mysql
   DATABASE_MASTER_HOST=127.0.0.1
   DATABASE_MASTER_PORT=3306
   DATABASE_MASTER_USERNAME=root
   DATABASE_MASTER_PASSWORD=
   DATABASE_NAME=socialite

   # Replication / Slave (can point to master in dev)
   DATABASE_SLAVE_HOST=127.0.0.1
   DATABASE_SLAVE_PORT=3306
   DATABASE_SLAVE_USERNAME=root
   DATABASE_SLAVE_PASSWORD=
   DATABASE_SYNCHRONIZE=true

   # Authentication
   JWT_SECRET=supersecretjwtkey_replace_in_production
   JWT_ACCESS_TOKEN_EXP=1d
   JWT_REFRESH_TOKEN_EXP=7d
   SECRET=supersecretjwtkey_replace_in_production

   # Optional Integrations
   GOOGLE_CLIENT_ID=your_google_client_id
   OPENAI_API_KEY=your_openai_api_key
   SIGHTENGINE_URL=https://api.sightengine.com/1.0/
   SIGHTENGINE_API_USER=your_sightengine_user
   SIGHTENGINE_API_KEY=your_sightengine_key
   DIGITALOCEAN_SPACE_ENDPOINT=https://nyc3.digitaloceanspaces.com
   DIGITALOCEAN_SPACE_REGION=nyc3
   DIGITALOCEAN_SPACE_KEY=your_space_key
   DIGITALOCEAN_SPACE_SECRET=your_space_secret
   DIGITALOCEAN_SPACE_BUCKET=socialite
   DIGITALOCEAN_SPACE_URL=https://socialite.nyc3.digitaloceanspaces.com
   ```

---

## 2. Installation

Install all required dependencies using Yarn:

```bash
yarn install
```

---

## 3. Database Setup

1. **Create the MySQL Database**:
   ```sql
   CREATE DATABASE IF NOT EXISTS socialite;
   ```

2. **Schema Synchronization**:
   - In development, `DATABASE_SYNCHRONIZE=true` automatically generates database tables based on TypeORM entities.

3. **(Optional) Seed Database**:
   Populate test data (e.g. mock users):
   ```bash
   yarn seed
   ```

4. **(Optional) TypeORM Migrations**:
   ```bash
   # Generate migration from entity changes
   yarn migration:generate src/database/migrations/<MigrationName>

   # Run pending migrations
   yarn migration:run

   # Revert last migration
   yarn migration:revert
   ```

---

## 4. Running the Application

### Development Mode (with hot-reload)
```bash
yarn start:dev
```

### Production Build
```bash
yarn build
yarn start:prod
```

### GraphQL Playground & Endpoints
Once the server starts on `PORT=5000`:
- **Server URL**: [http://localhost:5000](http://localhost:5000)
- **GraphQL Playground**: [http://localhost:5000/graphql](http://localhost:5000/graphql)

---

## 5. Available Scripts

| Command | Description |
|---|---|
| `yarn start:dev` | Starts the application in watch/dev mode |
| `yarn build` | Compiles the TypeScript application into `dist/` |
| `yarn start:prod` | Runs the compiled production build from `dist/` |
| `yarn seed` | Seeds the database using `typeorm-extension` |
| `yarn gen:graphql` | Generates TypeScript types via GraphQL Codegen |
| `yarn lint` | Lints and fixes codebase files using ESLint |
| `yarn test` | Runs Jest unit tests |
