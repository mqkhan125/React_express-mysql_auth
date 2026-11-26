# React Express MySQL Auth

A full-stack authentication starter built with React and Express. It supports account registration, login, protected profile access, and email-based password reset.

## Features

- User registration with password strength checks
- Login with bcrypt password hashing and JWT authentication
- Protected profile route and logout
- Forgot-password email with a time-limited reset link
- MySQL database integration
- Responsive React interface

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Email:** Nodemailer

## Project Structure

```text
.
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   └── sever.js
└── frontend/
    └── src/
        ├── Components/
        ├── pages/
        └── utils/
```

## Prerequisites

- Node.js and npm
- MySQL server
- Gmail account or another configured SMTP provider for password-reset emails

## Database Setup

Create the database and user table in MySQL:

```sql
CREATE DATABASE auth_system;
USE auth_system;

CREATE TABLE register (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

## Environment Variables

Create `backend/.env` with your local configuration:

```env
PORT=3000

DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=auth_system
DB_PORT=3307

JWT_SECRET=replace_with_a_long_random_secret
RESET_TOKEN_SECRET=use_a_different_long_random_secret

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:5173
```

Use separate, randomly generated values for `JWT_SECRET` and `RESET_TOKEN_SECRET`. Do not commit `.env` files or real credentials.

## Run Locally

Install and start the backend:

```bash
cd backend
npm install
npm run dev
```

In a second terminal, install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal. The frontend currently sends API requests to `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Register an account |
| `POST` | `/auth/login` | Sign in and receive a JWT |
| `GET` | `/auth/profile` | Fetch the authenticated user's profile |
| `POST` | `/auth/forgot-password` | Request a password-reset email |
| `POST` | `/auth/reset-password/:userId/:token` | Set a new password |

## Security Note

This project is a learning/demo starter, not a production-hardened authentication service. Review token storage, CORS policy, request rate limiting, password-reset token reuse, and server-side input validation before deploying it publicly.
