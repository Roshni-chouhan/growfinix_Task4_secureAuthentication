from fastapi import FastAPI, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)


# ============================================================
# APP CONFIGURATION
# ============================================================

app = FastAPI(
    title="AppIndex Secure Authentication API",
    description="Secure JWT Authentication API for AppIndex",
    version="1.0.0"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# DEMO USER DATABASE
# ============================================================

users_db = {
    "student@gmail.com": {
        "email": "student@gmail.com",
        "name": "Growfinix Student",
        "password": hash_password("password123")
    }
}


# ============================================================
# OAUTH2 CONFIGURATION
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)


# ============================================================
# HOME ROUTE
# ============================================================

@app.get("/")
def home():

    return {
        "message": "AppIndex Secure Authentication API is running",
        "status": "online"
    }


# ============================================================
# LOGIN ROUTE
# ============================================================

@app.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...)
):

    # Clean user input
    username = username.strip().lower()
    password = password.strip()

    # Find user
    user = users_db.get(username)

    # User does not exist
    if user is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    password_valid = verify_password(
        password,
        user["password"]
    )

    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT token
    access_token = create_access_token(
        {
            "sub": user["email"],
            "name": user["name"]
        }
    )

    # Return token
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ============================================================
# PROTECTED ROUTE
# ============================================================

@app.get("/protected")
def protected_route(
    token: str = Depends(oauth2_scheme)
):

    try:

        # Decode JWT token
        payload = decode_access_token(token)

        # Get user information from token
        email = payload.get("sub")
        name = payload.get("name")

        # Check email
        if not email:

            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        # Return protected data
        return {
            "message": "Access granted to protected route",

            "user": {
                "email": email,
                "name": name
            }
        }

    except HTTPException:

        raise

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "AppIndex Authentication API"
    }