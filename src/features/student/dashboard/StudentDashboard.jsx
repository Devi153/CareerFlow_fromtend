import { useEffect, useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import axiosInstance from "../../../api/axiosInstance";

function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/api/student/dashboard"
      );

      setDashboard(response.data);
    } catch (err) {
      console.error(
        "Failed to load student dashboard:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to view the student dashboard."
        );
      } else {
        setError(
          err.response?.data?.message ||
          "Failed to load dashboard. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-layout">

      <Sidebar role="STUDENT" />

      <main className="dashboard-main">

        <Topbar role="STUDENT" />

        <section className="dashboard-content">

          <div className="welcome-section">
            <h1>Welcome back, Student 👋</h1>

            <p>
              Here's what's happening with your
              placement journey.
            </p>
          </div>

          {error && (
            <div className="dashboard-error">
              <span>{error}</span>

              <button
                type="button"
                onClick={loadDashboard}
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="dashboard-loading">
              <p>Loading dashboard...</p>
            </div>
          ) : dashboard ? (
            <>
              <div className="stats-grid">

                <div className="stat-card">
                  <span>Applications</span>

                  <strong>
                    {dashboard.totalApplications}
                  </strong>

                  <small>
                    Application module pending
                  </small>
                </div>

                <div className="stat-card">
                  <span>Interviews</span>

                  <strong>
                    {dashboard.upcomingInterviews}
                  </strong>

                  <small>
                    No interview data yet
                  </small>
                </div>

                <div className="stat-card">
                  <span>Shortlisted</span>

                  <strong>
                    {dashboard.shortlistedApplications}
                  </strong>

                  <small>
                    No application data yet
                  </small>
                </div>

                <div className="stat-card">
                  <span>Profile</span>

                  <strong>
                    {dashboard.profileCompletion}%
                  </strong>

                  <small>
                    Profile completion
                  </small>
                </div>

              </div>

              <div className="dashboard-section">

                <div className="section-header">
                  <div>
                    <h2>Recent Applications</h2>

                    <p>
                      Your latest placement applications
                    </p>
                  </div>

                  <button
                    type="button"
                    className="secondary-button"
                  >
                    View all
                  </button>
                </div>

                <div className="dashboard-table">

                  <div className="table-row table-header">
                    <span>Company</span>
                    <span>Position</span>
                    <span>Status</span>
                    <span>Date</span>
                  </div>

                  <div className="table-row">
                    <span>
                      No applications yet
                    </span>

                    <span>
                      Application module
                    </span>

                    <span className="status">
                      Not available
                    </span>

                    <span>
                      —
                    </span>
                  </div>

                </div>

              </div>
            </>
          ) : null}

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;