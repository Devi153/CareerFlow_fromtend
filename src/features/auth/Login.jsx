import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await login(
        email.trim(),
        password
      );

      /*
       * IMPORTANT:
       * The backend role is authoritative.
       *
       * We do NOT use the role selected in the UI
       * to decide whether the user is an admin/student.
       */
      if (result.role === "ADMIN") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else if (result.role === "STUDENT") {
        navigate("/student/dashboard", {
          replace: true,
        });
      } else {
        setError(
          "Invalid user role received from server."
        );
      }

    } catch (error) {

      if (error.response?.status === 401) {
        setError("Invalid email or password.");

      } else if (error.response?.status === 403) {
        setError(
          "You are not authorized to access this account."
        );

      } else if (error.response?.data?.message) {
        setError(error.response.data.message);

      } else if (error.message) {
        setError(error.message);

      } else {
        setError(
          "Unable to sign in. Please try again."
        );
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">

      {/* Left Branding Section */}
      <section className="auth-brand">

        <div className="brand-content">

          <div className="brand-logo">
            <span className="brand-logo-icon">C</span>
            <span>CareerFlow</span>
          </div>

          <div className="brand-message">
            <span className="brand-badge">
              PLACEMENT MANAGEMENT PLATFORM
            </span>

            <h1>
              Manage placements.
              <br />
              Build careers.
            </h1>

            <p>
              A centralized platform for managing students,
              companies, placement drives, applications and
              interviews.
            </p>
          </div>

          <div className="brand-features">
            <div>
              <span>✓</span>
              Centralized placement management
            </div>

            <div>
              <span>✓</span>
              Real-time application tracking
            </div>

            <div>
              <span>✓</span>
              Streamlined student experience
            </div>
          </div>

        </div>

        <div className="brand-footer">
          © 2026 CareerFlow
        </div>

      </section>


      {/* Login Section */}
      <section className="auth-section">

        <div className="auth-container">

          <div className="mobile-logo">
            <span className="brand-logo-icon">C</span>
            CareerFlow
          </div>

          <div className="auth-card">

            <div className="auth-header">

              <h2>Welcome back</h2>

              <p>
                Sign in to continue to your CareerFlow account.
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                />

              </div>


              <div className="form-group">

                <div className="label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                  >
                    Forgot password?
                  </button>

                </div>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                />

              </div>


              <div className="form-group">

                <div className="form-label">
                  Sign in as
                </div>

                <div
                  className="role-selector"
                  aria-label="Sign in as"
                >

                  <button
                    type="button"
                    className={
                      role === "student"
                        ? "role-option active"
                        : "role-option"
                    }
                    onClick={() => setRole("student")}
                    aria-pressed={role === "student"}
                  >
                    <span className="role-icon">
                      S
                    </span>

                    <span>
                      <strong>Student</strong>
                      <small>
                        Access your placement portal
                      </small>
                    </span>

                  </button>


                  <button
                    type="button"
                    className={
                      role === "admin"
                        ? "role-option active"
                        : "role-option"
                    }
                    onClick={() => setRole("admin")}
                    aria-pressed={role === "admin"}
                  >
                    <span className="role-icon">
                      A
                    </span>

                    <span>
                      <strong>Administrator</strong>
                      <small>
                        Manage placement operations
                      </small>
                    </span>

                  </button>

                </div>

              </div>


              {/* Authentication error */}
              {error && (
                <div
                  className="auth-error"
                  role="alert"
                >
                  {error}
                </div>
              )}


              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading
                  ? "Signing in..."
                  : "Sign in"}

                {!isLoading && (
                  <span>→</span>
                )}
              </button>

            </form>


            <div className="auth-divider">
              <span>New to CareerFlow?</span>
            </div>


            <Link
              to="/register"
              className="register-button"
            >
              Create an account
            </Link>

          </div>


          <p className="security-note">
            <span>●</span>
            Your information is securely protected.
          </p>

        </div>

      </section>

    </main>
  );
}

export default Login;