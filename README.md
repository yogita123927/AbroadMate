# AbroadMate — Complete MERN Project + MongoDB Atlas Connection

A full-stack study-abroad planning starter built with React, Vite, Node.js, Express, Mongoose and MongoDB Atlas. The production architecture uses **one Render Web Service** to serve both the built React UI and the API, plus a MongoDB Atlas database.

## Features

- Responsive forest-green / warm-ivory UI
- Registration and login using bcrypt password hashes and an HTTP-only JWT cookie
- University directory with search, country, subject, degree and tuition filters
- Persistent user shortlist with status, deadline, application date and notes
- Saved destination, course, degree, budget, currency, intake and scholarship preferences
- Transparent top-five catalogue-based preference matching
- PDF export of recommendations
- Profile name update and account deletion API routes
- MongoDB Atlas connection through an environment variable
- Seed script for a starter catalogue

## Project structure

```text
abroadmate/
  package.json                         # root commands for development, build, start and seed
  Frontend/                              # FRONTEND: React + Vite
    index.html                         # HTML document
    vite.config.js                     # Vite config and local API proxy
    src/
      main.jsx                         # React entry point
      App.jsx                          # route definitions and shared app shell
      context/AuthContext.jsx          # signed-in user state and auth actions
      pages/Pages.jsx                  # landing, auth, universities, shortlist, preferences and recommendations
      services/api.js                  # Axios client and API base URL
      styles/global.css                # global styles and theme
  Backend/                              # BACKEND: Node.js + Express + MongoDB
    server.js                          # environment setup, database connection and listener
    app.js                             # middleware, API routes, health check and production UI serving
    config/db.js                       # MongoDB connection
    middleware/                        # authentication and error handling
    models/                            # Mongoose schemas
    routes/                            # HTTP endpoints grouped by feature
    services/recommendationService.js  # recommendation matching logic
    seed/                              # university data and database seed command
```

The frontend lives entirely under `Frontend/`; its source code is under `Frontend/src/`. The backend lives under `Backend/`, with routes handling HTTP requests and models defining stored data. Install dependencies from the repository root and use the root npm commands shown below.

## Requirements

- Node.js 20 LTS or a compatible current LTS release
- npm
- Git (for deployment)
- MongoDB Atlas account

## Local setup (Windows / VS Code)

1. Extract this ZIP. In VS Code, open the folder containing the root `package.json`, `Frontend/`, and `Backend/`. Do not run npm from a parent or nested folder that does not contain this file.
2. Install packages:

   ```powershell
   npm install
   npm install --prefix Backend
   npm install --prefix Frontend
   ```

3. In MongoDB Atlas, create a project and cluster, create a database user, and add your current public IP in Network Access.
4. Copy `Backend/.env.example` to `Backend/.env`. Replace the `MONGODB_URI` placeholder with the Atlas driver URI. Generate a secret with:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   Put the output in `JWT_SECRET`. For local use set `COOKIE_SECURE=false` and `CLIENT_ORIGIN=http://localhost:5173`.
5. Copy `Frontend/.env.example` to `Frontend/.env` (its default is already suitable for local use).
6. Seed the database:

   ```powershell
   npm run seed
   ```

7. Run both applications:

   ```powershell
   npm run dev
   ```

8. Open `http://localhost:5173`. Backend health check: `http://localhost:5000/api/health`.

### Local environment example

`Backend/.env`:

```dotenv
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_ENCODED_PASSWORD@YOUR_CLUSTER_HOST/abroadmate?retryWrites=true&w=majority
JWT_SECRET=PASTE_A_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
COOKIE_SECURE=false
CLIENT_ORIGIN=http://localhost:5173
```

`Frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files or credentials.

## Deploy to Render (single web service)

1. Push the project to a GitHub repository. Confirm `Backend/.env` and `Frontend/.env` are not staged.
2. In Render, create **New → Web Service** and connect the repository.
3. Root Directory: leave blank (repository root).
4. Build Command:

   ```bash
   npm install && npm install --prefix Backend && npm install --prefix Frontend && npm run build --prefix Frontend
   ```

5. Start Command:

   ```bash
   npm start --prefix Backend
   ```

6. Add Render environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI` = your Atlas connection URI
   - `JWT_SECRET` = a unique random secret
   - `COOKIE_SECURE=true`
   - `CLIENT_ORIGIN` = your Render service URL (not used for same-origin API calls in this single-service setup, but keep it configured)
7. In Atlas Network Access, add the Render service's outbound IP ranges from the Render service dashboard/docs. Add your current IP too if you will run the seed command locally.
8. After the service deploys, seed the cloud database once from your local terminal using the same Atlas URI in `Backend/.env`:

   ```powershell
   npm run seed
   ```

   Alternatively, use Render Shell (if available on your plan) and run `npm run seed --prefix Backend` from the repository root. Ensure the environment is set to the Atlas URI, not a local URI. Do not repeatedly run the seed script on every app startup; it is an explicit data operation.
9. Test `https://YOUR-SERVICE.onrender.com/api/health` and then register a test account, save a university, refresh the page, and inspect Atlas collections.

## How requests and data connect

- `Frontend/src/services/api.js` sends requests to `VITE_API_URL` locally and `/api` in production.
- `Backend/app.js` mounts API routers at `/api/...` and serves `Frontend/dist` for frontend routes.
- `Backend/server.js` loads environment variables, connects to MongoDB, and only then starts listening.
- `Backend/config/db.js` calls `mongoose.connect(process.env.MONGODB_URI)`.
- Models define the document schemas in MongoDB collections: `users`, `universities`, `preferences`, and `shortlists`.
- The browser never receives the MongoDB URI. Atlas credentials exist only in backend environment variables or the local server `.env` file.

## API quick reference

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Logout |
| GET | `/api/auth/me` | Yes | Current user |
| PATCH | `/api/auth/profile` | Yes | Update display name |
| DELETE | `/api/auth/account` | Yes | Delete user and associated data |
| GET | `/api/universities` | No | Search/filter/paginate |
| GET | `/api/universities/:id` | No | University detail |
| GET | `/api/universities/compare?ids=id1,id2` | No | Comparison data |
| GET | `/api/shortlist` | Yes | List user's saved universities |
| POST | `/api/shortlist` | Yes | Add university (`{ "universityId": "..." }`) |
| PATCH | `/api/shortlist/:id` | Yes | Update status/deadline/applicationDate/notes |
| DELETE | `/api/shortlist/:id` | Yes | Remove saved university |
| GET | `/api/preferences` | Yes | Get preferences |
| PUT | `/api/preferences` | Yes | Save preferences |
| POST | `/api/recommendations` | Yes | Generate up to five preference matches |

## Collections and data model

- `users`: name, normalized email, bcrypt password hash, embedded preference copy, timestamps.
- `universities`: catalogue data, course/degree arrays, estimated tuition fields, official website, verification note.
- `preferences`: one preference document per user.
- `shortlists`: one record per user/university pair, application status, dates and notes.

The dedicated `preferences` document is the primary saved preference record; a copy is also embedded in the user document for convenience. The unique compound index on shortlist `(user, university)` prevents duplicate saves for the same user.

## Important data and production caveats

- The included 30 university records are **starter/sample records**. Tuition figures are illustrative estimates normalized to USD and must be verified with official university sources before being presented as factual current tuition. The website displays a data note in this starter catalogue.
- Recommendation scores indicate catalogue-based preference fit, not admission likelihood, scholarship eligibility or personal satisfaction.
- PDF generation happens in the browser; the downloaded PDF is not uploaded to the server.
- Comparison selections are not yet saved as a durable MongoDB entity.
- Before production use, add automated tests, review rate limits, add CSRF protections if your threat model requires them, audit account deletion and retention requirements, replace placeholder contact/privacy information, and have the privacy policy reviewed.
- This is a functional starter implementation, not a guarantee that all university information is complete or suitable for real admissions decisions.
#   A b r o a d M a t e  
 