import { useEffect, useState } from "react";

import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";

import { getStudentPlacementDrives } from "../../../api/studentApi";

import "./PlacementDrives.css";

function PlacementDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlacementDrives();
  }, []);

  async function loadPlacementDrives() {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentPlacementDrives();

      setDrives(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Failed to load placement drives:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to view placement drives."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load placement drives. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateTime(dateValue) {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusClass(status) {
    if (!status) {
      return "status-default";
    }

    return `status-${status
      .toString()
      .toLowerCase()}`;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar role="STUDENT" />

      <main className="dashboard-main">
        <Topbar role="STUDENT" />

        <section className="dashboard-content">
          {/* PAGE HEADER */}
          <div className="page-header">
            <div>
              <h1>Placement Drives</h1>

              <p>
                Explore placement opportunities available
                for you.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={loadPlacementDrives}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="dashboard-error">
              <span>{error}</span>

              <button
                type="button"
                onClick={loadPlacementDrives}
              >
                Retry
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="dashboard-loading">
              <p>Loading placement drives...</p>
            </div>
          ) : (
            <>
              {/* SUMMARY */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span>Available Drives</span>

                  <strong>{drives.length}</strong>

                  <small>
                    Currently open placement drives
                  </small>
                </div>
              </div>

              {/* DRIVES */}
              <div className="dashboard-section">
                <div className="section-header">
                  <div>
                    <h2>Available Placement Drives</h2>

                    <p>
                      Placement drives currently open
                      for students.
                    </p>
                  </div>
                </div>

                {drives.length === 0 ? (
                  <div className="empty-state">
                    <h3>No placement drives available</h3>

                    <p>
                      There are currently no open placement
                      drives. Please check again later.
                    </p>
                  </div>
                ) : (
                  <div className="placement-drive-list">
                    {drives.map((drive) => (
                      <article
                        className="placement-drive-card"
                        key={drive.driveId}
                      >
                        <div className="placement-drive-header">
                          <div>
                            <h3>
                              {drive.jobTitle ||
                                drive.position ||
                                "Placement Opportunity"}
                            </h3>

                            <p className="company-name">
                              {drive.companyName ||
                                "Company information unavailable"}
                            </p>
                          </div>

                          <span
                            className={`status-badge ${getStatusClass(
                              drive.status
                            )}`}
                          >
                            {drive.status || "OPEN"}
                          </span>
                        </div>

                        <div className="placement-drive-details">
                          <div className="detail-item">
                            <span className="detail-label">
                              Location
                            </span>

                            <strong>
                              {drive.location || "—"}
                            </strong>
                          </div>

                          <div className="detail-item">
                            <span className="detail-label">
                              Start Date
                            </span>

                            <strong>
                              {formatDate(
                                drive.startDate ||
                                  drive.driveStartDate
                              )}
                            </strong>
                          </div>

                          <div className="detail-item">
                            <span className="detail-label">
                              Application Deadline
                            </span>

                            <strong>
                              {formatDate(
                                drive.applicationDeadline ||
                                  drive.deadline
                              )}
                            </strong>
                          </div>

                          <div className="detail-item">
                            <span className="detail-label">
                              Created
                            </span>

                            <strong>
                              {formatDateTime(
                                drive.createdAt
                              )}
                            </strong>
                          </div>
                        </div>

                        {drive.description && (
                          <div className="placement-drive-description">
                            <span className="detail-label">
                              Description
                            </span>

                            <p>
                              {drive.description}
                            </p>
                          </div>
                        )}

                        <div className="placement-drive-actions">
                          <button
                            type="button"
                            className="primary-button"
                            disabled
                            title="Application module will be connected later"
                          >
                            Apply
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default PlacementDrives;