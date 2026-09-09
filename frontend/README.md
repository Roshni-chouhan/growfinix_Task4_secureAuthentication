# AppIndex – Secure Frontend-to-Backend Authentication

A secure full-stack authentication system built using **React, FastAPI, JWT, Passlib, and bcrypt**.

This project demonstrates how a React frontend communicates securely with a FastAPI backend using JWT-based authentication.

---

## 🚀 Features

- User Login
- Password Hashing using bcrypt
- JWT-based Authentication
- Protected API Route
- Token Expiration
- CORS Configuration
- React Frontend
- FastAPI Backend
- Login Error Handling
- Logout Functionality
- Responsive Authentication UI

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- PyJWT
- Passlib
- bcrypt
- python-multipart

---

## 📁 Project Structure

```text
Task4_Secure_Authentication/
│
├── backend/
│   ├── auth.py
│   ├── main.py
│   └── venv/
│
└── frontend/
    └── src/
        ├── App.jsx
        ├── App.css
        ├── index.css
        └── main.jsx

React Frontend
      │
      │ Email + Password
      ▼
FastAPI /login
      │
      │ Verify hashed password
      ▼
Generate JWT Token
      │
      ▼
React stores token
      │
      │ Bearer Token
      ▼
/protected API
      │
      ▼
Authenticated User Data



👤 Demo Credentials

Use the following credentials to test the application:

Email: student@gmail.com
Password: password123

After successful login, the application displays:

Growfinix Student
⚙️ Backend Setup

Open PowerShell and navigate to the backend:

cd C:\Users\HP\Desktop\Growfinix\Task4_Secure_Authentication\backend

Activate the virtual environment:

.\venv\Scripts\activate

Install dependencies:

pip install fastapi uvicorn PyJWT passlib bcrypt==4.0.1 python-multipart

Start the FastAPI server:

uvicorn main:app --reload

Backend will run at:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs
💻 Frontend Setup

Open another PowerShell terminal:

cd C:\Users\HP\Desktop\Growfinix\Task4_Secure_Authentication\frontend

Install dependencies:

npm install

Start the React application:

npm run dev

The frontend will normally run at:

http://localhost:5173
🔑 API Endpoints
Home
GET /

Checks whether the authentication API is running.

Login
POST /login

Accepts:

username
password

Returns:

{
  "access_token": "JWT_TOKEN",
  "token_type": "bearer"
}
Protected Route
GET /protected

Requires a valid JWT token:

Authorization: Bearer <JWT_TOKEN>

Returns authenticated user information.

Example:

{
  "message": "Access granted to protected route",
  "user": {
    "email": "student@gmail.com",
    "name": "Growfinix Student"
  }
}
Health Check
GET /health

Returns:

{
  "status": "healthy",
  "service": "AppIndex Authentication API"
}
🔒 Security Implementation
Password Hashing

Passwords are never stored as plain text.

The application uses bcrypt through Passlib to securely hash and verify passwords.

JWT Authentication

After successful login, the backend generates a JWT access token.

The token contains:

User email
User name
Expiration time

The protected API verifies the token before returning user information.

CORS

The backend allows requests from the React development server:

http://localhost:5173
http://127.0.0.1:5173
🧪 Testing

The authentication flow was tested using FastAPI Swagger UI.

Tested operations:

Successful login
Invalid login
JWT token generation
Protected route access
Invalid/expired token handling
Password verification
CORS configuration

Expected successful requests:

POST /login       → 200 OK
GET  /protected   → 200 OK
GET  /health      → 200 OK
📸 Application

The application provides:

Modern AppIndex login screen
Password visibility toggle
Remember me option
Authentication error messages
Secure dashboard
Profile section
Security section
Settings section
Logout functionality
📌 Project Objective

The objective of this project is to demonstrate a secure authentication architecture where a React frontend communicates with a FastAPI backend using password hashing and JWT authentication.

👩‍💻 Author

Roshni Chouhan

B.Tech Computer Science Engineering Student