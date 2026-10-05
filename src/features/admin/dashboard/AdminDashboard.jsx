import { useEffect, useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import axiosInstance from "../../../api/axiosInstance";

function AdminDashboard() {
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
        "/api/admin/dashboard"
      );

      setDashboard(response.data);
    } catch (err) {
      console.error(
        "Failed to load admin dashboard:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to view the admin dashboard."
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

      <Sidebar role="ADMIN" />

      <main className="dashboard-main">

        <Topbar role="ADMIN" />

        <section className="dashboard-content">

          <div className="welcome-section">
            <h1>Good afternoon, Admin 👋</h1>

            <p>
              Here's an overview of your placement operations.
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
                  <span>Total Students</span>

                  <strong>
                    {dashboard.totalStudents}
                  </strong>

                  <small>
                    Registered students
                  </small>
                </div>

                <div className="stat-card">
                  <span>Companies</span>

                  <strong>
                    {dashboard.totalCompanies}
                  </strong>

                  <small>
                    Registered companies
                  </small>
                </div>

                <div className="stat-card">
                  <span>Placement Drives</span>

                  <strong>
                    {dashboard.totalPlacementDrives}
                  </strong>

                  <small>
                    Total placement drives
                  </small>
                </div>

                <div className="stat-card">
                  <span>Applications</span>

                  <strong>
                    {dashboard.totalApplications}
                  </strong>

                  <small>
                    Application module pending
                  </small>
                </div>

              </div>

              <div className="dashboard-section">

                <div className="section-header">
                  <div>
                    <h2>Recent Placement Drives</h2>

                    <p>
                      Latest company placement activities
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
                    <span>Applications</span>
                    <span>Status</span>
                  </div>

                  {dashboard.recentDrives &&
                  dashboard.recentDrives.length > 0 ? (
                    dashboard.recentDrives.map((drive) => (
                      <div
                        className="table-row"
                        key={drive.driveId}
                      >
                        <span>
                          {drive.companyName}
                        </span>

                        <span>
                          {drive.jobTitle}
                        </span>

                        <span>
                          {drive.applicationCount}
                        </span>

                        <span
                          className={`status ${getStatusClass(
                            drive.status
                          )}`}
                        >
                          {formatStatus(drive.status)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="table-row">
                      <span>
                        No placement drives yet
                      </span>

                      <span>—</span>

                      <span>0</span>

                      <span className="status">
                        No data
                      </span>
                    </div>
                  )}

                </div>

              </div>
            </>
          ) : null}

        </section>

      </main>

    </div>
  );
}

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getStatusClass(status) {
  if (!status) {
    return "";
  }

  switch (status.toUpperCase()) {
    case "OPEN":
      return "active";

    case "CLOSED":
      return "completed";

    case "CANCELLED":
      return "cancelled";

    case "DRAFT":
      return "draft";

    default:
      return "";
  }
}

export default AdminDashboard;