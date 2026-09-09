import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

/* ============================================================
   LOCK GRAPHIC
============================================================ */

function LockGraphic() {
  return (
    <div className="lock-graphic">
      <div className="glow"></div>

      <svg
        viewBox="0 0 400 400"
        className="security-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="200"
          cy="200"
          r="155"
          className="orbit orbit-one"
        />

        <circle
          cx="200"
          cy="200"
          r="125"
          className="orbit orbit-two"
        />

        {/* Key */}
        <g className="key">
          <circle cx="105" cy="170" r="38" />
          <circle
            cx="105"
            cy="170"
            r="16"
            className="key-hole"
          />

          <rect
            x="135"
            y="160"
            width="120"
            height="20"
            rx="10"
          />

          <rect
            x="220"
            y="180"
            width="18"
            height="35"
            rx="4"
          />

          <rect
            x="250"
            y="180"
            width="18"
            height="25"
            rx="4"
          />
        </g>

        {/* Lock */}
        <rect
          x="145"
          y="195"
          width="110"
          height="95"
          rx="18"
          className="lock-body"
        />

        <path
          d="M165 200V165C165 125 235 125 235 165V200"
          className="lock-shackle"
        />

        <circle
          cx="200"
          cy="235"
          r="12"
          className="lock-hole"
        />

        <rect
          x="196"
          y="235"
          width="8"
          height="28"
          rx="4"
          className="lock-line"
        />
      </svg>

      <div className="floating-dot dot-one"></div>
      <div className="floating-dot dot-two"></div>
      <div className="floating-dot dot-three"></div>
    </div>
  );
}

/* ============================================================
   APP
============================================================ */

function App() {
  const [email, setEmail] = useState("student@gmail.com");
  const [password, setPassword] = useState("password123");

  const [token, setToken] = useState(
    () => localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);

  const [activeTab, setActiveTab] = useState("Dashboard");

  /* ============================================================
     GET PROTECTED USER DATA
  ============================================================ */

  const getProtectedData = async (accessToken) => {
    if (!accessToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Session expired. Please login again."
        );
      }

      if (!data.user) {
        throw new Error("Invalid user data received from server.");
      }

      setUser(data.user);
      setError("");

      return true;
    } catch (err) {
      console.error("Protected route error:", err);

      localStorage.removeItem("access_token");

      setToken(null);
      setUser(null);

      return false;
    }
  };

  /* ============================================================
     CHECK SAVED TOKEN ON PAGE LOAD
  ============================================================ */

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");

    if (!savedToken) {
      return;
    }

    getProtectedData(savedToken);
  }, []);

  /* ============================================================
     LOGIN
  ============================================================ */

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (!cleanEmail || !cleanPassword) {
        throw new Error("Please enter email and password.");
      }

      /* --------------------------------------------------------
         Prepare FastAPI OAuth2 form
      -------------------------------------------------------- */

      const formData = new URLSearchParams();

      formData.append("username", cleanEmail);
      formData.append("password", cleanPassword);

      /* --------------------------------------------------------
         Login request
      -------------------------------------------------------- */

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          Accept: "application/json",
        },

        body: formData.toString(),
      });

      const data = await response.json();

      /* --------------------------------------------------------
         Check login response
      -------------------------------------------------------- */

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password."
        );
      }

      /* --------------------------------------------------------
         Check JWT
      -------------------------------------------------------- */

      if (!data.access_token) {
        throw new Error(
          "Login succeeded but no access token was received."
        );
      }

      const newToken = data.access_token;

      /* --------------------------------------------------------
         Store token
      -------------------------------------------------------- */

      if (rememberMe) {
        localStorage.setItem(
          "access_token",
          newToken
        );
      } else {
        localStorage.removeItem("access_token");
      }

      /*
       * IMPORTANT:
       * Set the NEW token in React state.
       */
      setToken(newToken);

      /* --------------------------------------------------------
         Verify protected route using NEW token
      -------------------------------------------------------- */

      const success = await getProtectedData(newToken);

      if (!success) {
        throw new Error(
          "Login succeeded, but the protected route rejected the token."
        );
      }

      /* --------------------------------------------------------
         Login successful
      -------------------------------------------------------- */

      setError("");

    } catch (err) {
      console.error("Login error:", err);

      setToken(null);
      setUser(null);

      localStorage.removeItem("access_token");

      setError(
        err.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    setToken(null);
    setUser(null);

    setEmail("student@gmail.com");
    setPassword("password123");

    setError("");

    setActiveTab("Dashboard");
  };

  /* ============================================================
     LOGIN PAGE
  ============================================================ */

  if (!token) {
    return (
      <div className="auth-page">

        <div className="background-grid"></div>

        <div className="background-glow glow-left"></div>

        <div className="background-glow glow-right"></div>

        <div className="auth-container">

          {/* ====================================================
              LEFT SIDE
          ==================================================== */}

          <div className="auth-brand-section">

            <div className="brand-logo">

              <div className="brand-icon">
                A
              </div>

              <div>
                <h2>AppIndex</h2>

                <span>
                  Secure Access Platform
                </span>
              </div>

            </div>

            <div className="brand-content">

              <div className="security-label">

                <span className="status-dot"></span>

                Secure Authentication

              </div>

              <h1>
                Your security.
                <br />

                <span>
                  Our priority.
                </span>
              </h1>

              <p>
                Access your AppIndex account through
                a secure authentication system powered
                by JWT technology.
              </p>

              <LockGraphic />

              <div className="security-features">

                <div className="feature">

                  <span>✓</span>

                  <div>
                    <strong>
                      JWT Authentication
                    </strong>

                    <small>
                      Secure token-based access
                    </small>
                  </div>

                </div>

                <div className="feature">

                  <span>✓</span>

                  <div>
                    <strong>
                      Password Protection
                    </strong>

                    <small>
                      Bcrypt password hashing
                    </small>
                  </div>

                </div>

                <div className="feature">

                  <span>✓</span>

                  <div>
                    <strong>
                      Protected Routes
                    </strong>

                    <small>
                      Authorized users only
                    </small>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ====================================================
              RIGHT SIDE
          ==================================================== */}

          <div className="login-section">

            <div className="login-card">

              <div className="mobile-brand">

                <div className="brand-icon">
                  A
                </div>

                <strong>
                  AppIndex
                </strong>

              </div>

              <div className="login-header">

                <div className="login-icon">
                  🔐
                </div>

                <h2>
                  Welcome back
                </h2>

                <p>
                  Sign in to continue to your
                  AppIndex account.
                </p>

              </div>

              <form onSubmit={handleLogin}>

                {/* ==================================================
                    EMAIL
                ================================================== */}

                <div className="input-group">

                  <label>
                    Email address
                  </label>

                  <div className="input-wrapper">

                    <span>
                      ✉
                    </span>

                    <input
                      type="email"
                      placeholder="student@gmail.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      autoComplete="email"
                      required
                    />

                  </div>

                </div>

                {/* ==================================================
                    PASSWORD
                ================================================== */}

                <div className="input-group">

                  <div className="password-label">

                    <label>
                      Password
                    </label>

                    <button
                      type="button"
                      className="forgot-btn"
                      onClick={() =>
                        alert(
                          "Password reset functionality can be added here."
                        )
                      }
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="input-wrapper">

                    <span>
                      🔑
                    </span>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      className="show-password"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword
                        ? "🙈"
                        : "👁"}
                    </button>

                  </div>

                </div>

                {/* ==================================================
                    REMEMBER ME
                ================================================== */}

                <div className="remember-row">

                  <label className="remember">

                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      Remember me
                    </span>

                  </label>

                  <span className="secure-text">
                    🛡 Secure connection
                  </span>

                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                  <div className="error-message">
                    ⚠ {error}
                  </div>
                )}

                {/* ==================================================
                    LOGIN BUTTON
                ================================================== */}

                <button
                  className="login-button"
                  type="submit"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span className="spinner"></span>

                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign in

                      <span>
                        →
                      </span>
                    </>
                  )}

                </button>

              </form>

              {/* ==================================================
                  DEMO ACCOUNT
              ================================================== */}

              <div className="demo-account">

                <div className="demo-title">
                  Demo Account
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    student@gmail.com
                  </strong>
                </div>

                <div>
                  <span>
                    Password
                  </span>

                  <strong>
                    password123
                  </strong>
                </div>

              </div>

              <div className="login-footer">

                🔒 Your connection is secured
                with JWT authentication

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* ============================================================
     DASHBOARD
  ============================================================ */

  return (
    <div className="dashboard-page">

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-icon">
            A
          </div>

          <div>

            <strong>
              AppIndex
            </strong>

            <span>
              Secure Platform
            </span>

          </div>

        </div>

        <nav>

          {[
            "Dashboard",
            "Profile",
            "Security",
            "Settings",
          ].map((item) => (

            <button
              key={item}
              className={
                activeTab === item
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                setActiveTab(item)
              }
            >

              <span>

                {item === "Dashboard" && "▦"}

                {item === "Profile" && "👤"}

                {item === "Security" && "🛡"}

                {item === "Settings" && "⚙"}

              </span>

              {item}

            </button>

          ))}

        </nav>

        <div className="sidebar-bottom">

          <div className="logged-user">

            <div className="avatar">

              {user?.name?.charAt(0) || "G"}

            </div>

            <div>

              <strong>
                {user?.name || "Growfinix Student"}
              </strong>

              <span>
                {user?.email || "student@gmail.com"}
              </span>

            </div>

          </div>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <span className="breadcrumb">
              AppIndex / {activeTab}
            </span>

            <h1>
              {activeTab}
            </h1>

            <p>
              Manage your secure AppIndex account.
            </p>

          </div>

          <div className="header-security">

            <span className="status-dot"></span>

            System Secure

          </div>

        </header>

        {/* ======================================================
            DASHBOARD
        ====================================================== */}

        {activeTab === "Dashboard" && (

          <>

            <section className="welcome-banner">

              <div>

                <span className="welcome-label">
                  AUTHENTICATION SUCCESSFUL
                </span>

                <h2>
                  Welcome,{" "}
                  {user?.name ||
                    "Growfinix Student"}{" "}
                  👋
                </h2>

                <p>
                  You are securely authenticated
                  and have access to protected
                  resources.
                </p>

              </div>

              <div className="dashboard-lock">
                🔐
              </div>

            </section>

            <section className="stats-grid">

              <div className="security-card">

                <div className="card-icon purple">
                  🔐
                </div>

                <div>

                  <span>
                    Authentication
                  </span>

                  <strong>
                    JWT Active
                  </strong>

                </div>

                <div className="card-check">
                  ✓
                </div>

              </div>

              <div className="security-card">

                <div className="card-icon blue">
                  🔑
                </div>

                <div>

                  <span>
                    Password
                  </span>

                  <strong>
                    Protected
                  </strong>

                </div>

                <div className="card-check">
                  ✓
                </div>

              </div>

              <div className="security-card">

                <div className="card-icon green">
                  🛡
                </div>

                <div>

                  <span>
                    Protected Route
                  </span>

                  <strong>
                    Authorized
                  </strong>

                </div>

                <div className="card-check">
                  ✓
                </div>

              </div>

            </section>

            <section className="content-grid">

              <div className="panel">

                <div className="panel-header">

                  <div>

                    <h3>
                      Account Information
                    </h3>

                    <p>
                      Your authenticated account details
                    </p>

                  </div>

                  <span className="verified">
                    ✓ Verified
                  </span>

                </div>

                <div className="account-details">

                  <div>

                    <span>
                      Full Name
                    </span>

                    <strong>
                      {user?.name || "Growfinix Student"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Email Address
                    </span>

                    <strong>
                      {user?.email || "student@gmail.com"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Authentication
                    </span>

                    <strong>
                      JWT Bearer Token
                    </strong>

                  </div>

                  <div>

                    <span>
                      Access Status
                    </span>

                    <strong className="green-text">
                      Authorized
                    </strong>

                  </div>

                </div>

              </div>

              <div className="panel security-panel">

                <div className="panel-header">

                  <div>

                    <h3>
                      Security Status
                    </h3>

                    <p>
                      Current protection status
                    </p>

                  </div>

                </div>

                <div className="security-status">

                  <div className="big-check">
                    ✓
                  </div>

                  <h3>
                    You're protected
                  </h3>

                  <p>
                    Your session is authenticated
                    using a secure JWT token.
                  </p>

                </div>

              </div>

            </section>

          </>
        )}

        {/* ======================================================
            PROFILE
        ====================================================== */}

        {activeTab === "Profile" && (

          <section className="single-panel">

            <h2>
              Profile
            </h2>

            <p>
              Authenticated user profile information.
            </p>

            <div className="profile-box">

              <div className="large-avatar">
                {user?.name?.charAt(0) || "G"}
              </div>

              <h2>
                {user?.name || "Growfinix Student"}
              </h2>

              <p>
                {user?.email || "student@gmail.com"}
              </p>

              <span className="verified">
                ✓ Verified Account
              </span>

            </div>

          </section>
        )}

        {/* ======================================================
            SECURITY
        ====================================================== */}

        {activeTab === "Security" && (

          <section className="single-panel">

            <h2>
              Security
            </h2>

            <p>
              Your AppIndex security configuration.
            </p>

            <div className="security-list">

              <div>

                <span>
                  🔐
                </span>

                <div>

                  <strong>
                    JWT Authentication
                  </strong>

                  <p>
                    Active
                  </p>

                </div>

              </div>

              <div>

                <span>
                  🔑
                </span>

                <div>

                  <strong>
                    Password Hashing
                  </strong>

                  <p>
                    Bcrypt protected
                  </p>

                </div>

              </div>

              <div>

                <span>
                  🛡
                </span>

                <div>

                  <strong>
                    Protected API Routes
                  </strong>

                  <p>
                    Enabled
                  </p>

                </div>

              </div>

              <div>

                <span>
                  🌐
                </span>

                <div>

                  <strong>
                    CORS Protection
                  </strong>

                  <p>
                    Configured
                  </p>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* ======================================================
            SETTINGS
        ====================================================== */}

        {activeTab === "Settings" && (

          <section className="single-panel">

            <h2>
              Settings
            </h2>

            <p>
              AppIndex account settings.
            </p>

            <div className="settings-row">

              <div>

                <strong>
                  Authentication Status
                </strong>

                <p>
                  Your account is currently authenticated.
                </p>

              </div>

              <span className="toggle active"></span>

            </div>

            <div className="settings-row">

              <div>

                <strong>
                  JWT Protected Access
                </strong>

                <p>
                  Protected API routes are enabled.
                </p>

              </div>

              <span className="toggle active"></span>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;