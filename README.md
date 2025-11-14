# Academlo Auth API

A robust authentication service built with Node.js, Express, TypeScript, and Sequelize ORM. This API provides comprehensive user authentication features including registration, email verification, login, password reset, and user management.

## 🚀 Features

- **User Registration** - Create new user accounts with email verification
- **Email Verification** - Secure email verification using unique codes
- **User Login** - JWT-based authentication system
- **Password Reset** - Request and reset passwords via email
- **User Management** - Full CRUD operations for user profiles
- **Protected Routes** - Middleware-based route protection with JWT
- **Email Service** - Integration with Nodemailer for email notifications
- **PostgreSQL Database** - Reliable data persistence with Sequelize ORM
- **Type Safety** - Full TypeScript implementation for better code quality

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) (v10.22.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v15 or higher)
- [Docker](https://www.docker.com/) (optional, for containerized database)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd academlo-auth
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (Local Development)
DB_NAME=auth_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Database Configuration (Production)
# DATABASE_URL=postgresql://user:password@host:port/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cookie Configuration
COOKIE_SECRET=your-cookie-secret-key

# Email Configuration
GOOGLE_APP_PASSWORD=your-google-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### 4. Start PostgreSQL Database

**Option A: Using Docker (Recommended)**

```bash
docker-compose up -d
```

**Option B: Local PostgreSQL**

Make sure your PostgreSQL service is running and create the database:

```sql
CREATE DATABASE auth_db;
```

### 5. Run the development server

```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication Endpoints

#### Register a New User
```http
POST /users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "country": "USA",
  "image": "https://example.com/avatar.jpg"
}
```

#### Verify Email
```http
GET /users/verify/:code
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "isVerify": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile (Protected)
```http
GET /users/me
Authorization: Bearer <your-jwt-token>
```

#### Request Password Reset
```http
POST /users/reset_password
Content-Type: application/json

{
  "email": "john@example.com",
  "frontBaseUrl": "http://localhost:3000/reset-password"
}
```

#### Reset Password
```http
POST /users/reset_password/:code
Content-Type: application/json

{
  "password": "newSecurePassword123"
}
```

### User Management Endpoints (Protected)

All these endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### Get All Users
```http
GET /users
Authorization: Bearer <your-jwt-token>
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <your-jwt-token>
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe Updated",
  "country": "Canada",
  "image": "https://example.com/new-avatar.jpg"
}
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <your-jwt-token>
```

## 🏗️ Project Structure

```
academlo-auth/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Sequelize database connection
│   │   └── smtp.ts      # Email transporter configuration
│   ├── controllers/     # Request handlers
│   │   ├── authController.ts    # Authentication logic
│   │   └── usersController.ts   # User CRUD operations
│   ├── middlewares/     # Custom middleware
│   │   └── guardMiddleware.ts   # JWT authentication guard
│   ├── models/          # Sequelize models
│   │   ├── User.ts      # User model
│   │   ├── EmailCode.ts # Email verification code model
│   │   └── index.ts     # Model associations
│   ├── routes/          # API routes
│   │   ├── index.ts     # Main router
│   │   └── usersRoutes.ts # User routes
│   ├── utils/           # Utility functions
│   │   ├── jwt.ts       # JWT generation and verification
│   │   └── password.ts  # Password hashing utilities
│   ├── app.ts           # Express application setup
│   └── index.ts         # Application entry point
├── docker-compose.yml   # Docker configuration for PostgreSQL
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt with 10 salt rounds for secure password storage
- **JWT Authentication**: Secure token-based authentication with 5-minute expiration
- **Email Verification**: Prevents unauthorized access until email is verified
- **Protected Routes**: Middleware guards to protect sensitive endpoints
- **CORS Configuration**: Configurable CORS for cross-origin requests
- **Cookie Security**: Signed cookies for enhanced security

## 🗄️ Database Schema

### User Table
| Field        | Type      | Description                    |
|--------------|-----------|--------------------------------|
| id           | INTEGER   | Primary key, auto-increment    |
| first_name   | STRING    | User's first name              |
| last_name    | STRING    | User's last name               |
| email        | STRING    | Unique email address           |
| password     | STRING    | Hashed password                |
| country      | STRING    | User's country                 |
| image        | STRING    | Profile image URL              |
| isVerify     | BOOLEAN   | Email verification status      |
| createdAt    | TIMESTAMP | Record creation time           |
| updatedAt    | TIMESTAMP | Record last update time        |

### EmailCode Table
| Field      | Type      | Description                      |
|------------|-----------|----------------------------------|
| id         | INTEGER   | Primary key, auto-increment      |
| code       | STRING    | Verification/reset code          |
| user_id    | INTEGER   | Foreign key to User              |
| createdAt  | TIMESTAMP | Record creation time             |
| updatedAt  | TIMESTAMP | Record last update time          |

## 📦 Scripts

```bash
# Development mode with hot reload
pnpm dev

# Build TypeScript to JavaScript
pnpm build

# Start production server
pnpm start

# Sync database (creates/updates tables)
pnpm db:sync

# Seed database with initial data
pnpm db:seed
```

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure `DATABASE_URL` for your production database
3. Set strong `JWT_SECRET` and `COOKIE_SECRET` values
4. Configure SMTP credentials for email service
5. Update `FRONTEND_URL` to your production frontend URL

### Deployment Platforms

#### Render.com (Recommended)

1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

#### Heroku

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

## 🧪 Testing

Test the API using tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)

## 🛡️ Environment Variables Reference

| Variable              | Required | Description                                    |
|-----------------------|----------|------------------------------------------------|
| PORT                  | No       | Server port (default: 3000)                    |
| NODE_ENV              | No       | Environment mode (development/production)      |
| DB_NAME               | Yes*     | PostgreSQL database name                       |
| DB_USER               | Yes*     | PostgreSQL username                            |
| DB_PASSWORD           | Yes*     | PostgreSQL password                            |
| DB_HOST               | Yes*     | PostgreSQL host                                |
| DB_PORT               | Yes*     | PostgreSQL port                                |
| DATABASE_URL          | Yes**    | Full database connection string (production)   |
| JWT_SECRET            | Yes      | Secret key for JWT signing                     |
| COOKIE_SECRET         | Yes      | Secret key for cookie signing                  |
| GOOGLE_APP_PASSWORD   | Yes      | Gmail app password for sending emails          |
| FRONTEND_URL          | Yes      | Frontend application URL for email links       |

\* Required for local development  
\** Required for production deployment

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Developed by Artiyx Development Team

## 📧 Support

For support or questions, please contact: artisandevx@gmail.com

---

**Note**: Remember to never commit your `.env` file or expose sensitive credentials in your repository. Always use environment variables for sensitive configuration.
