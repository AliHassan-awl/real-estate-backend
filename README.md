# EstateVista Properties — Backend

Production-oriented REST API for EstateVista. Built with Express, PostgreSQL, Prisma, JWT, bcrypt, Zod, Multer and Cloudinary-compatible uploads.

## Requirements

- Node.js 20+
- PostgreSQL 14+ (local, Neon, Supabase, Railway Postgres or another compatible provider)

## Local installation and database setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

Set a valid PostgreSQL connection in `DATABASE_URL` first. API: `http://localhost:5000/api`; health: `http://localhost:5000/api/health`.

## Demo administrator

- Email: `admin@estatevista.com`
- Password: `Admin@12345`

**Change this password before any production use.** The seed hashes it with bcrypt; no plaintext password is stored in the database.

## Production database

1. Create a managed PostgreSQL database.
2. Copy its pooled or direct Prisma-compatible connection string into `DATABASE_URL` (include provider-required SSL parameters).
3. Run `npx prisma generate` and `npx prisma migrate deploy`.
4. Run `npm run seed` once for the commercial demo dataset.
5. Use provider backups and access controls for real client data.

## Railway deployment

1. Push this folder to its own Git repository and create a Railway service from it.
2. Add all variables listed below. Railway supplies `PORT`; the server reads it dynamically.
3. Set `FRONTEND_URL` to the exact Netlify origin. Separate multiple allowed origins with commas.
4. Deploy. `railway.json` installs packages, generates Prisma Client, applies migrations and starts the API.
5. Configure the health check as `/api/health`.
6. Put `https://YOUR-RAILWAY-DOMAIN/api` in the frontend `VITE_API_BASE_URL` and redeploy Netlify.

Never rely on the service filesystem for uploads. This project holds uploads in memory only while sending them to Cloudinary.

## Environment variables

- `PORT` — local port; default 5000
- `NODE_ENV` — `development` or `production`
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — at least 32 random characters
- `JWT_EXPIRES_IN` — e.g. `8h`
- `FRONTEND_URL` — allowed browser origin(s), comma-separated
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Without Cloudinary credentials, seeded remote images work and the site remains browsable, but new uploads return a clear 503 error.

## Commands

```bash
npm run dev
npm start
npm run validate
npm run prisma:deploy
npm run seed
npm test
```

## API design

Routes are under `/api`. Public reads/forms are rate-limited and validated. Administrative mutations require a JWT and sensitive user management requires `SUPER_ADMIN`. Responses consistently use `{ success, message, data }`; production errors never include stack traces.
