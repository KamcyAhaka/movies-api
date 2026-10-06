# Movies & Reviews REST API

CSE341 Web Services - Project 2

---

## Live Render Deployment

- **Base URL:** [https://movies-api-j8pw.onrender.com](https://movies-api-j8pw.onrender.com)
- **API Documentation (Swagger UI):** [https://movies-api-j8pw.onrender.com/api-docs](https://movies-api-j8pw.onrender.com/api-docs)

---

## Project Overview

The Movies & Reviews REST API is a full-stack backend service built with Node.js, Express, and MongoDB. The system manages two primary business collections (`movies` and `reviews`) and a secure `users` collection for authentication.

It includes full Create, Read, Update, and Delete (CRUD) operations, rigorous data validation, comprehensive error handling, interactive Swagger/OpenAPI documentation, and production security measures using OAuth 2.0 and bcrypt password hashing.

---

## Features & Security Measures

### 1. Data Collections & Schemas
- **Movies Collection:** Contains 9 rich data attributes (exceeds the 7-field requirement).
- **Reviews Collection:** Relational reference to movies via MongoDB ObjectId, capturing reviewer feedback and ratings.
- **Users Collection:** Stores user credentials with salted bcrypt hashes for local accounts or OAuth profile IDs. No plain-text passwords are ever stored.

### 2. Authentication & Authorization (Phase 2)
- **GitHub OAuth 2.0:** Users can authenticate using their GitHub account via Passport.js (`/login`, `/github/callback`).
- **Local Account Creation:** Users can register (`/auth/register`) with an email, username, and password. Passwords are encrypted using `bcryptjs` (salt rounds: 10).
- **Session Management:** Secure sessions maintained with `express-session` cookies.
- **Protected Operations:** Data modification routes (`POST`, `PUT`, `DELETE` on movies and reviews) are strictly protected by authentication middleware. Unauthorized requests receive `401 Unauthorized`.
- **Restricted Views:** Authenticated users gain access to exclusive views unavailable to the public:
  - `GET /auth/profile`: Displays private user account details, role, and granted access permissions.
  - `GET /reviews/user/my-reviews`: Displays a personalized dashboard of reviews authored by the logged-in user.
- **Public Endpoints:** Catalog browsing remains openly accessible (`GET /movies`, `GET /reviews`, `GET /api-docs`).

---

## Data Models

### 1. Movies Collection (`movies`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Title of the film (required) |
| `director` | String | Director name (required) |
| `releaseYear` | Number | Release year, e.g., 2010 (required) |
| `genre` | String | Movie genre, e.g., "Sci-Fi", "Drama" (required) |
| `rating` | Number | Rating score from 0 to 10 (required) |
| `runtime` | Number | Total duration in minutes (required) |
| `synopsis` | String | Plot summary (required) |
| `language` | String | Spoken language (required) |
| `posterUrl` | String | URL to movie poster image (required) |

### 2. Reviews Collection (`reviews`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `movieId` | String (ObjectId) | Valid 24-character hexadecimal movie reference (required) |
| `reviewerName` | String | Name of the reviewer (required) |
| `rating` | Number | Rating score from 1 to 10 (required) |
| `comment` | String | Review feedback or commentary (required) |
| `reviewDate` | String | Date of review formatted as YYYY-MM-DD (required) |
| `userId` | String | Optional ID of the authenticated author |

### 3. Users Collection (`users`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `username` | String | Unique username for display and login |
| `email` | String | Unique email address |
| `password` | String | Salted bcrypt password hash (never stored in plain text) |
| `provider` | String | Authentication source ('github' or 'local') |
| `role` | String | User permission role ('user' or 'admin') |
| `createdAt` | Date | Timestamp of account registration |

---

## API Endpoints

### Authentication & User Management

| Method | Endpoint | Access | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/login` | Public | Initiates GitHub OAuth authentication flow | `302` / `503` |
| `GET` | `/github/callback` | Public | GitHub OAuth redirect callback | `302` |
| `GET` | `/logout` | Public | Logs out user session and redirects home | `302` |
| `POST` | `/auth/register` | Public | Create local account (password hashed with bcrypt) | `201` / `400` / `409` |
| `POST` | `/auth/login` | Public | Log in with email/username and password | `200` / `400` / `401` |
| `POST` | `/auth/logout` | Public | Log out current API session | `200` |
| `GET` | `/auth/status` | Public | Check current authentication state | `200` |
| `GET` | `/auth/profile` | Protected | View user profile (only available when logged in) | `200` / `401` |

### Movies (`/movies`)

| Method | Endpoint | Access | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/movies` | Public | Retrieve all movies | `200` / `500` |
| `GET` | `/movies/:id` | Public | Retrieve single movie by MongoDB ObjectId | `200` / `400` / `404` |
| `POST` | `/movies` | Protected | Create a new movie document (requires login) | `201` / `400` / `401` |
| `PUT` | `/movies/:id` | Protected | Update existing movie (requires login) | `204` / `400` / `401` / `404` |
| `DELETE` | `/movies/:id` | Protected | Delete a movie by ObjectId (requires login) | `200` / `400` / `401` / `404` |

### Reviews (`/reviews`)

| Method | Endpoint | Access | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/reviews` | Public | Retrieve all reviews | `200` / `500` |
| `GET` | `/reviews/user/my-reviews` | Protected | View personal reviews (only available when logged in) | `200` / `401` |
| `GET` | `/reviews/:id` | Public | Retrieve single review by ObjectId | `200` / `400` / `404` |
| `POST` | `/reviews` | Protected | Create review (validates movie exists, requires login) | `201` / `400` / `401` / `404` |
| `PUT` | `/reviews/:id` | Protected | Update existing review (requires login) | `204` / `400` / `401` / `404` |
| `DELETE` | `/reviews/:id` | Protected | Delete review by ObjectId (requires login) | `200` / `400` / `401` / `404` |

---

## Local Setup & Installation

### 1. Install Dependencies
```bash
git clone <repository-url>
cd movies-api
npm install
```

### 2. Configure Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Populate the required configuration keys in `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=movies_db
HOST=localhost:3000
SESSION_SECRET=your_super_secret_session_key

# GitHub OAuth 2.0 Setup
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
CALLBACK_URL=http://localhost:3000/github/callback
```

### 3. Setting Up GitHub OAuth Credentials
1. Go to your GitHub profile: **Settings** > **Developer Settings** > **OAuth Apps**.
2. Click **New OAuth App**.
3. Set the fields:
   - **Application name:** Movies API
   - **Homepage URL:** `http://localhost:3000` (or your Render URL)
   - **Authorization callback URL:** `http://localhost:3000/github/callback` (or `https://movies-api-j8pw.onrender.com/github/callback`)
4. Copy the generated **Client ID** and generate a new **Client Secret**.
5. Paste them into your `.env` file (and into Render Environment Variables for production).

### 4. Build Swagger Documentation
```bash
npm run swagger
```

### 5. Start the Application
- Development mode (with hot reloading):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

---

## Testing & Demonstration

### Interactive Swagger UI
Visit `http://localhost:3000/api-docs` (or the live URL on Render).
- Public GET routes can be executed directly.
- Protected routes display security requirements.
- Authenticate via `/login` or `/auth/login` to obtain a session and test protected routes.

### VS Code REST Client
Use the included `routes.rest` file:
1. Test `/auth/status` (verify loggedIn is false).
2. Test `POST /movies` (verify response is `401 Unauthorized`).
3. Test `POST /auth/register` or `POST /auth/login` to establish a session.
4. Test `/auth/status` and `/auth/profile` (verify response is `200 OK` with user data).
5. Test `POST /movies` again (verify response is `201 Created`).
6. Test `POST /auth/logout` and re-test protected routes to confirm access is revoked.

---

## Deployment to Render

1. Push your changes to GitHub.
2. In the Render Dashboard, open your Web Service.
3. Under the **Environment** tab, set:
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `DB_NAME`: `movies_db`
   - `SESSION_SECRET`: your secret session key
   - `GITHUB_CLIENT_ID`: GitHub OAuth app Client ID
   - `GITHUB_CLIENT_SECRET`: GitHub OAuth app Client Secret
   - `CALLBACK_URL`: `https://movies-api-j8pw.onrender.com/github/callback`
   - `HOST`: `movies-api-j8pw.onrender.com`
4. Trigger manual deploy or push to your deployment branch.
