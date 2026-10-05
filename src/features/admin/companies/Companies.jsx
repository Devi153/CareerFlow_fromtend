import { useEffect, useMemo, useState } from "react";

import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";

import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../../../api/adminApi";

function Companies() {
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    location: "",
  });

  /*
   * ------------------------------------------------
   * LOAD COMPANIES
   * ------------------------------------------------
   */

  async function loadCompanies() {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanies();

      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load companies:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  /*
   * ------------------------------------------------
   * FORM
   * ------------------------------------------------
   */

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData({
      companyName: "",
      website: "",
      location: "",
    });

    setEditingCompanyId(null);
  }

  function openCreateModal() {
    resetForm();
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  function openEditModal(company) {
    setEditingCompanyId(company.companyId);

    setFormData({
      companyName: company.companyName || "",
      website: company.website || "",
      location: company.location || "",
    });

    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setIsModalOpen(false);
    resetForm();
    setError("");
  }

  /*
   * ------------------------------------------------
   * VALIDATION
   * ------------------------------------------------
   */

  function validateForm() {
    const companyName = formData.companyName.trim();
    const website = formData.website.trim();
    const location = formData.location.trim();

    if (!companyName) {
      setError("Company name is required.");
      return false;
    }

    if (companyName.length > 150) {
      setError(
        "Company name must not exceed 150 characters."
      );
      return false;
    }

    if (website.length > 255) {
      setError(
        "Website must not exceed 255 characters."
      );
      return false;
    }

    if (location.length > 150) {
      setError(
        "Location must not exceed 150 characters."
      );
      return false;
    }

    return true;
  }

  /*
   * ------------------------------------------------
   * CREATE / UPDATE
   * ------------------------------------------------
   */

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    const payload = {
      companyName: formData.companyName.trim(),
      website: formData.website.trim(),
      location: formData.location.trim(),
    };

    try {
      setSaving(true);

      if (editingCompanyId) {
        const updatedCompany = await updateCompany(
          editingCompanyId,
          payload
        );

        setCompanies((previous) =>
          previous.map((company) =>
            company.companyId === editingCompanyId
              ? updatedCompany
              : company
          )
        );

        setSuccess("Company updated successfully.");
      } else {
        const createdCompany =
          await createCompany(payload);

        setCompanies((previous) => [
          createdCompany,
          ...previous,
        ]);

        setSuccess("Company created successfully.");
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Company save failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save company."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ------------------------------------------------
   * DELETE
   * ------------------------------------------------
   */

  async function handleDelete(companyId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCompany(companyId);

      setCompanies((previous) =>
        previous.filter(
          (company) =>
            company.companyId !== companyId
        )
      );

      setSuccess("Company deleted successfully.");
    } catch (err) {
      console.error(
        "Company deletion failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete company."
      );
    }
  }

  /*
   * ------------------------------------------------
   * SEARCH
   * ------------------------------------------------
   */

  const filteredCompanies = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return companies;
    }

    return companies.filter((company) => {
      return (
        company.companyName
          ?.toLowerCase()
          .includes(search) ||
        company.location
          ?.toLowerCase()
          .includes(search) ||
        company.website
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [companies, searchTerm]);

  /*
   * ------------------------------------------------
   * STATISTICS
   * ------------------------------------------------
   */

  const totalCompanies = companies.length;

  const totalLocations = new Set(
    companies
      .map((company) =>
        company.location?.trim().toLowerCase()
      )
      .filter(Boolean)
  ).size;

  const companiesWithWebsite = companies.filter(
    (company) =>
      company.website &&
      company.website.trim() !== ""
  ).length;

  /*
   * ------------------------------------------------
   * UI
   * ------------------------------------------------
   */

  return (
    <div className="dashboard-layout">

      {/* ADMIN SIDEBAR */}
      <Sidebar role="ADMIN" />

      <main className="dashboard-main">

        {/* ADMIN TOPBAR */}
        <Topbar role="ADMIN" />

        <section className="dashboard-content">

          <div className="companies-page">

            {/* PAGE HEADER */}
            <section className="companies-header">

              <div>
                <div className="breadcrumb">
                  Administration / Companies
                </div>

                <h1>Companies</h1>

                <p>
                  Manage companies participating in
                  campus placement activities.
                </p>
              </div>

              <button
                type="button"
                className="primary-button add-company-button"
                onClick={openCreateModal}
              >
                <span>+</span>
                Add Company
              </button>

            </section>

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="company-alert success-alert">

                <span className="alert-icon">
                  ✓
                </span>

                <span>{success}</span>

                <button
                  type="button"
                  onClick={() => setSuccess("")}
                >
                  ×
                </button>

              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && !isModalOpen && (
              <div className="company-alert error-alert">

                <span className="alert-icon">
                  !
                </span>

                <span>{error}</span>

                <button
                  type="button"
                  onClick={() => setError("")}
                >
                  ×
                </button>

              </div>
            )}

            {/* STATISTICS */}
            <section className="company-stat-grid">

              <div className="company-stat-card">

                <div className="stat-icon">
                  🏢
                </div>

                <div>
                  <span className="stat-label">
                    Total Companies
                  </span>

                  <strong className="stat-value">
                    {totalCompanies}
                  </strong>
                </div>

              </div>

              <div className="company-stat-card">

                <div className="stat-icon">
                  📍
                </div>

                <div>
                  <span className="stat-label">
                    Locations
                  </span>

                  <strong className="stat-value">
                    {totalLocations}
                  </strong>
                </div>

              </div>

              <div className="company-stat-card">

                <div className="stat-icon">
                  🌐
                </div>

                <div>
                  <span className="stat-label">
                    Websites Added
                  </span>

                  <strong className="stat-value">
                    {companiesWithWebsite}
                  </strong>
                </div>

              </div>

            </section>

            {/* COMPANY TABLE CARD */}
            <section className="companies-table-card">

              <div className="companies-table-header">

                <div>
                  <h2>Company Directory</h2>

                  <p>
                    {filteredCompanies.length}{" "}
                    {filteredCompanies.length === 1
                      ? "company"
                      : "companies"}{" "}
                    displayed
                  </p>
                </div>

                <div className="company-search">

                  <span>⌕</span>

                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchTerm("")
                      }
                    >
                      ×
                    </button>
                  )}

                </div>

              </div>

              {/* TABLE CONTENT */}
              {loading ? (

                <div className="companies-loading">

                  <div className="loading-spinner" />

                  <p>
                    Loading companies...
                  </p>

                </div>

              ) : filteredCompanies.length === 0 ? (

                <div className="companies-empty">

                  <div className="empty-company-icon">
                    🏢
                  </div>

                  <h3>
                    {searchTerm
                      ? "No companies found"
                      : "No companies yet"}
                  </h3>

                  <p>
                    {searchTerm
                      ? "Try changing your search term."
                      : "Add your first company to start managing placement activities."}
                  </p>

                  {!searchTerm && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={openCreateModal}
                    >
                      + Add Company
                    </button>
                  )}

                </div>

              ) : (

                <div className="companies-table-wrapper">

                  <table className="companies-table">

                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Website</th>
                        <th>Added</th>
                        <th className="actions-column">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredCompanies.map(
                        (company) => (
                          <tr
                            key={
                              company.companyId
                            }
                          >

                            <td>
                              <div className="company-name-cell">

                                <div className="company-avatar">
                                  {company.companyName
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <strong>
                                    {
                                      company.companyName
                                    }
                                  </strong>

                                  <span>
                                    ID #
                                    {
                                      company.companyId
                                    }
                                  </span>
                                </div>

                              </div>
                            </td>

                            <td>
                              {company.location ? (
                                <div className="location-cell">

                                  <span>
                                    📍
                                  </span>

                                  {
                                    company.location
                                  }

                                </div>
                              ) : (
                                <span className="muted">
                                  Not provided
                                </span>
                              )}
                            </td>

                            <td>
                              {company.website ? (
                                <a
                                  href={
                                    company.website
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="website-link"
                                >
                                  <span>
                                    🌐
                                  </span>

                                  Visit website
                                </a>
                              ) : (
                                <span className="muted">
                                  Not provided
                                </span>
                              )}
                            </td>

                            <td>
                              <span className="date-cell">

                                {company.createdAt
                                  ? new Date(
                                      company.createdAt
                                    ).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month:
                                          "short",
                                        year:
                                          "numeric",
                                      }
                                    )
                                  : "—"}

                              </span>
                            </td>

                            <td>

                              <div className="company-actions">

                                <button
                                  type="button"
                                  className="icon-action edit-action"
                                  title="Edit company"
                                  onClick={() =>
                                    openEditModal(
                                      company
                                    )
                                  }
                                >
                                  ✎
                                </button>

                                <button
                                  type="button"
                                  className="icon-action delete-action"
                                  title="Delete company"
                                  onClick={() =>
                                    handleDelete(
                                      company.companyId
                                    )
                                  }
                                >
                                  🗑
                                </button>

                              </div>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </div>

        </section>

      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div
          className="company-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="company-modal">

            <div className="company-modal-header">

              <div>

                <span className="modal-eyebrow">
                  Company Management
                </span>

                <h2>
                  {editingCompanyId
                    ? "Edit Company"
                    : "Add New Company"}
                </h2>

                <p>
                  Enter the company information
                  below.
                </p>

              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>

            </div>

            {error && (
              <div className="company-modal-error">

                <span>!</span>

                {error}

              </div>
            )}

            <form
              className="company-form"
              onSubmit={handleSubmit}
            >

              <div className="company-form-group">

                <label htmlFor="companyName">
                  Company Name
                  <span>*</span>
                </label>

                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={
                    formData.companyName
                  }
                  onChange={handleChange}
                  placeholder="e.g. Tata Consultancy Services"
                  maxLength={150}
                  disabled={saving}
                  required
                />

                <small>
                  Maximum 150 characters
                </small>

              </div>

              <div className="company-form-group">

                <label htmlFor="website">
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="text"
                  value={
                    formData.website
                  }
                  onChange={handleChange}
                  placeholder="https://www.company.com"
                  maxLength={255}
                  disabled={saving}
                />

                <small>
                  Optional
                </small>

              </div>

              <div className="company-form-group">

                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={
                    formData.location
                  }
                  onChange={handleChange}
                  placeholder="e.g. Chennai"
                  maxLength={150}
                  disabled={saving}
                />

                <small>
                  Optional
                </small>

              </div>

              <div className="company-modal-actions">

                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-submit-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingCompanyId
                    ? "Save Changes"
                    : "Create Company"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Companies;