# Render + MongoDB Atlas: step-by-step checklist

## A. Atlas
1. Create an Atlas project and cluster.
2. Create a dedicated database user and strong password in **Database Access**.
3. In **Network Access**, add your current public IP for local seeding/testing.
4. Use **Connect → Drivers → Node.js** to copy the connection URI.
5. Replace the username, password and host placeholders. If password symbols are reserved URI characters, percent-encode them.
6. Database name in this project is `abroadmate`.

## B. Local project
1. Open the repository root in VS Code (the folder with `package.json`, `Frontend/`, and `Backend/`).
2. Install dependencies: `npm install`, `npm install --prefix Backend`, `npm install --prefix Frontend`.
3. Copy `Backend/.env.example` to `Backend/.env` and add your Atlas URI and a random JWT secret.
4. Run `npm run seed` to insert the starter university catalogue into Atlas.
5. Run `npm run dev` and visit `http://localhost:5173`.

## C. GitHub
1. Create a repository and push the source.
2. Ensure `Backend/.env`, `Frontend/.env`, and all secrets are ignored by Git.
3. Confirm `git status` does not show credentials.

## D. Render
1. Create a Web Service from the repository.
2. Root directory: blank.
3. Build command: `npm install && npm install --prefix Backend && npm install --prefix Frontend && npm run build --prefix Frontend`
4. Start command: `npm start --prefix Backend`
5. Set `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `COOKIE_SECURE=true`, and `CLIENT_ORIGIN` to your service URL.
6. Add the Render service's outbound IP ranges to Atlas Network Access. Avoid `0.0.0.0/0` for a production database where possible.
7. Deploy and inspect the logs for `MongoDB connected` and `AbroadMate server listening`.
8. Test `https://YOUR-SERVICE.onrender.com/api/health`.

## E. Verify data persistence
1. Register a test user.
2. In Atlas Data Explorer, open `abroadmate.users` and verify a user document appears. The password must be a bcrypt hash, not plain text.
3. Save a university and inspect `abroadmate.shortlists`.
4. Save preferences and inspect `abroadmate.preferences`.
5. Refresh the page and confirm the shortlist is still present.

## Troubleshooting
- `bad auth`: confirm Atlas database user/password and URI encoding.
- `IP not allowed`: add the current IP for local work and Render outbound IP ranges for deployed work.
- `MONGODB_URI is missing`: set it in `Backend/.env` locally or Render environment settings in production.
- frontend API 404: check `/api/health`, ensure the build command generated `Frontend/dist`, and ensure the server serves that directory.
- login cookie not retained in production: confirm HTTPS is used and `COOKIE_SECURE=true`; test that frontend and API are same-origin for this deployment mode.
- no universities: run `npm run seed` against the intended Atlas database and verify `abroadmate.universities` in Data Explorer.
