# Movies & Reviews REST API

CSE341 Web Services

---

## Project Overview

The Movies & Reviews REST API is a web service built with Node.js, Express, and MongoDB. The application manages two related data collections: **movies** and **reviews**. It provides full Create, Read, Update, and Delete (CRUD) capabilities, accompanied by strict input validation, comprehensive error handling, and interactive Swagger/OpenAPI documentation.

---

## Features

- **Two Distinct Collections:** Stores both `movies` and `reviews` in a MongoDB database.
- **Rich Document Schema:** The `movies` collection contains 9 distinct fields.
- **Complete CRUD Operations:** Full GET, POST, PUT, and DELETE routes implemented for both collections.
- **Data Validation:** Every route validates input types, required fields, and MongoDB ObjectId formats before interacting with the database.
- **Robust Error Handling:** Informative HTTP status codes (200, 201, 204, 400, 404, 500) and structured JSON error responses.
- **Swagger Documentation:** Auto-generated interactive API docs accessible directly via browser at `/api-docs`.
- **CORS Support:** Cross-Origin Resource Sharing enabled for external requests and web clients.

---

## Data Models

### 1. Movies Collection (`movies`)

| Field         | Type   | Description                                       |
| :------------ | :----- | :------------------------------------------------ |
| `title`       | String | Title of the film (required)                      |
| `director`    | String | Director name (required)                          |
| `releaseYear` | Number | Year the film was released, e.g., 2010 (required) |
| `genre`       | String | Movie genre, e.g., "Sci-Fi", "Drama" (required)   |
| `rating`      | Number | Rating score from 0 to 10 (required)              |
| `runtime`     | Number | Total duration in minutes (required)              |
| `synopsis`    | String | Plot summary (required)                           |
| `language`    | String | Primary spoken language (required)                |
| `posterUrl`   | String | URL pointing to the movie poster image (required) |

### 2. Reviews Collection (`reviews`)

| Field          | Type              | Description                                                    |
| :------------- | :---------------- | :------------------------------------------------------------- |
| `movieId`      | String (ObjectId) | Valid 24-character hexadecimal reference to a movie (required) |
| `reviewerName` | String            | Name of the reviewer (required)                                |
| `rating`       | Number            | Rating score from 1 to 10 (required)                           |
| `comment`      | String            | Review feedback or thoughts (required)                         |
| `reviewDate`   | String            | Date of the review in YYYY-MM-DD format (required)             |

---

## API Endpoints

### Movies (`/movies`)

| Method   | Endpoint      | Description                               | Expected Status                  |
| :------- | :------------ | :---------------------------------------- | :------------------------------- |
| `GET`    | `/movies`     | Retrieve all movies                       | `200 OK`                         |
| `GET`    | `/movies/:id` | Retrieve single movie by MongoDB ObjectId | `200 OK` / `400` / `404`         |
| `POST`   | `/movies`     | Create a new movie document               | `201 Created` / `400`            |
| `PUT`    | `/movies/:id` | Update an existing movie document         | `204 No Content` / `400` / `404` |
| `DELETE` | `/movies/:id` | Delete a movie by MongoDB ObjectId        | `200 OK` / `400` / `404`         |

### Reviews (`/reviews`)

| Method   | Endpoint       | Description                                | Expected Status                  |
| :------- | :------------- | :----------------------------------------- | :------------------------------- |
| `GET`    | `/reviews`     | Retrieve all reviews                       | `200 OK`                         |
| `GET`    | `/reviews/:id` | Retrieve single review by MongoDB ObjectId | `200 OK` / `400` / `404`         |
| `POST`   | `/reviews`     | Create a new review document               | `201 Created` / `400`            |
| `PUT`    | `/reviews/:id` | Update an existing review document         | `204 No Content` / `400` / `404` |
| `DELETE` | `/reviews/:id` | Delete a review by MongoDB ObjectId        | `200 OK` / `400` / `404`         |

### Documentation & Home

| Method | Endpoint    | Description                              |
| :----- | :---------- | :--------------------------------------- |
| `GET`  | `/`         | API status and welcome message           |
| `GET`  | `/api-docs` | Interactive Swagger UI API documentation |

---

## Local Setup Instructions

### 1. Prerequisites

- Node.js (version 18 or newer recommended)
- A MongoDB Atlas account or local MongoDB instance

### 2. Installation

Navigate into the project directory and install the necessary dependencies:

```bash
cd movies-api
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root folder based on `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and fill in your MongoDB connection string:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=movies_db
```

### 4. Generate Swagger Documentation

Generate the `swagger-output.json` file from route annotations:

```bash
npm run swagger
```

### 5. Start the Server

Start the development server with auto-reload:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

The server will be running at `http://localhost:3000`.

---

## Testing the API

### Option A: Swagger UI

Open your browser and navigate to:

```
http://localhost:3000/api-docs
```

You can execute requests and inspect response payloads directly from the web interface.

### Option B: REST Client (VS Code)

Open the included `routes.rest` file and click `Send Request` above any route to test GET, POST, PUT, and DELETE queries directly.

---

## Deployment to Render

1. Push this repository to GitHub.
2. Log in to your Render dashboard and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the following build and start configurations:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Under **Environment Variables**, add:
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `DB_NAME`: `movies_db`
   - `PORT`: `3000` (or leave default, Render sets this automatically)
6. Once deployed, update `host` in `swagger.js` with your Render URL (for example: `your-app-name.onrender.com`), change scheme to `https`, rerun `npm run swagger`, and push changes to GitHub.
