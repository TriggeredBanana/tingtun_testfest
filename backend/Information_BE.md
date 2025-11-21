# Backend Documentation (backend)

This directory contains the backend application for Tingtun Testfest, built with Node.js and Express.

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Database:** MySQL / MariaDB (using `mysql2` driver)
- **Authentication:** JWT (JSON Web Tokens) & `bcrypt` for password hashing
- **Validation:** `joi`
- **Environment:** `dotenv`

## Prerequisites

- Node.js (v16+)
- MySQL or MariaDB instance

## Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root of the `backend` folder with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# JWT Secret (for authentication)
JWT_SECRET=your_secure_jwt_secret
```

## Running the Server

### `npm start`
Runs the server using `nodemon`, which automatically restarts the server when file changes are detected.
The server defaults to port **8800**.

## API Routes

The API is structured into the following main routes:

- **/brukere**: User management (registration, login, etc.)
- **/testfester**: Management of Testfest events
- **/oppgaver**: Management of tasks/assignments
- **/program**: Program schedule management

## Database Connection

The database connection is managed in `connect.js`. It uses a connection pool for efficient resource management. Ensure your MySQL/MariaDB server is running and accessible with the credentials provided in the `.env` file.
