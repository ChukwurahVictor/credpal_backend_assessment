# Todo CRUD API

A RESTful API for managing todos with JWT authentication, built with Express, TypeScript, and MongoDB.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Testing**: Jest + Supertest + MongoDB Memory Server

## Project Structure

```
src/
├── config/          # Database connection
├── controllers/     # Request handlers
├── middleware/      # Auth middleware
├── models/          # Mongoose schemas
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Response helpers
├── validators/      # Input validation
└── __tests__/       # Unit tests
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/ChukwurahVictor/credpal_backend_assessment.git
cd credpal_backend_assessment

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file
MONGODB_URI=mongodb://localhost:27017/todo_app
JWT_SECRET=your_super_secret_key
PORT=3000
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

### Running Tests

```bash
npm test              # Run all tests with coverage
npm run test:watch    # Watch mode
```

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Todo Endpoints

> All todo endpoints require authentication via Bearer token.

### Get All Todos
```http
GET /api/todos
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Todos retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project",
      "description": "Finish the API documentation",
      "completed": false,
      "user": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-29T12:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z"
    }
  ]
}
```

---

### Get Single Todo
```http
GET /api/todos/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Todo retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project",
    "description": "Finish the API documentation",
    "completed": false,
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T12:00:00.000Z"
  }
}
```

---

### Create Todo
```http
POST /api/todos
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the API documentation"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project",
    "description": "Finish the API documentation",
    "completed": false,
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T12:00:00.000Z"
  }
}
```

---

### Update Todo
```http
PUT /api/todos/:id
Authorization: Bearer <token>
```

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated title",
    "description": "Updated description",
    "completed": true,
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T12:30:00.000Z"
  }
}
```

---

### Delete Todo
```http
DELETE /api/todos/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Todo removed successfully",
  "data": null
}
```

---

## Error Codes

| Status | Description |
|--------|-------------|
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Invalid/missing token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `PORT` | Server port (default: 3000) | No |

---

## Author

Victor Chukwurah

## License

ISC
