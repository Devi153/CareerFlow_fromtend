import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./authService";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await register(
        email.trim(),
        password
      );

      setSuccess(
        response.message ||
          "Registration successful. Please sign in."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (error) {

      if (error.response?.status === 409) {
        setError(
          "An account with this email already exists."
        );

      } else if (error.response?.data?.message) {
        setError(error.response.data.message);

      } else {
        setError(
          "Unable to create your account. Please try again."
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
              Start your journey.
              <br />
              Build your career.
            </h1>

            <p>
              Create your CareerFlow account and manage
              your placement journey from one centralized
              platform.
            </p>
          </div>

          <div className="brand-features">
            <div>
              <span>✓</span>
              Manage your placement profile
            </div>

            <div>
              <span>✓</span>
              Track applications and interviews
            </div>

            <div>
              <span>✓</span>
              Stay updated with placement opportunities
            </div>
          </div>

        </div>

        <div className="brand-footer">
          © 2026 CareerFlow
        </div>

      </section>


      {/* Register Section */}
      <section className="auth-section">

        <div className="auth-container">

          <div className="mobile-logo">
            <span className="brand-logo-icon">C</span>
            CareerFlow
          </div>

          <div className="auth-card">

            <div className="auth-header">

              <h2>Create your account</h2>

              <p>
                Register to get started with CareerFlow.
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

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="new-password"
                />

              </div>


              <div className="form-group">

                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  autoComplete="new-password"
                />

              </div>


              {error && (
                <div
                  className="auth-error"
                  role="alert"
                >
                  {error}
                </div>
              )}


              {success && (
                <div
                  className="auth-success"
                  role="status"
                >
                  {success}
                </div>
              )}


              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating account..."
                  : "Create account"}

                {!isLoading && (
                  <span>→</span>
                )}
              </button>

            </form>


            <div className="auth-divider">
              <span>Already have an account?</span>
            </div>


            <Link
              to="/login"
              className="register-button"
            >
              Sign in
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

export default Register;