import { useEffect, useMemo, useState } from "react";

import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";

import {
  getCompanies,
  getPlacementDrives,
  createPlacementDrive,
  updatePlacementDrive,
  updatePlacementDriveStatus,
  deletePlacementDrive,
} from "../../../api/adminApi";

import "./PlacementDrives.css";


/* =========================================================
   FORM FACTORY
   ========================================================= */

function createInitialForm() {
  return {
    companyId: "",
    jobTitle: "",
    description: "",
    minimumCgpa: "",
    minimumTenthPercentage: "",
    minimumTwelfthPercentage: "",
    applicationDeadline: "",
    driveDate: "",
  };
}


/* =========================================================
   COMPONENT
   ========================================================= */

function PlacementDrives() {

  /* =========================================================
     STATE
     ========================================================= */

  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [statusUpdatingDriveId, setStatusUpdatingDriveId] =
    useState(null);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingDrive, setEditingDrive] = useState(null);

  const [formData, setFormData] =
    useState(createInitialForm);


  /* =========================================================
     LOAD DATA
     ========================================================= */

  useEffect(() => {
    loadPageData();
  }, []);


  async function loadPageData() {

    try {

      setLoading(true);
      setError("");

      const [drivesData, companiesData] =
        await Promise.all([
          getPlacementDrives(),
          getCompanies(),
        ]);

      setDrives(
        Array.isArray(drivesData)
          ? drivesData
          : []
      );

      setCompanies(
        Array.isArray(companiesData)
          ? companiesData
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load placement drives:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to load placement drives."
        )
      );

    } finally {

      setLoading(false);
    }
  }


  /* =========================================================
     SEARCH
     ========================================================= */

  const filteredDrives = useMemo(() => {

    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return drives;
    }

    return drives.filter((drive) => {

      return (
        drive.companyName
          ?.toLowerCase()
          .includes(search) ||

        drive.jobTitle
          ?.toLowerCase()
          .includes(search) ||

        drive.status
          ?.toLowerCase()
          .includes(search)
      );

    });

  }, [drives, searchTerm]);


  /* =========================================================
     STATISTICS
     ========================================================= */

  const statistics = useMemo(() => {

    return {
      total: drives.length,

      draft: drives.filter(
        (drive) => drive.status === "DRAFT"
      ).length,

      open: drives.filter(
        (drive) => drive.status === "OPEN"
      ).length,

      closed: drives.filter(
        (drive) => drive.status === "CLOSED"
      ).length,

      cancelled: drives.filter(
        (drive) => drive.status === "CANCELLED"
      ).length,
    };

  }, [drives]);


  /* =========================================================
     OPEN CREATE MODAL
     ========================================================= */

  function handleAddDrive() {

    setEditingDrive(null);
    setFormData(createInitialForm());
    setFormError("");
    setShowModal(true);
  }


  /* =========================================================
     OPEN EDIT MODAL
     ========================================================= */

  function handleEditDrive(drive) {

    setEditingDrive(drive);

    setFormData({
      companyId: String(drive.companyId ?? ""),

      jobTitle:
        drive.jobTitle ?? "",

      description:
        drive.description ?? "",

      minimumCgpa:
        drive.minimumCgpa ?? "",

      minimumTenthPercentage:
        drive.minimumTenthPercentage ?? "",

      minimumTwelfthPercentage:
        drive.minimumTwelfthPercentage ?? "",

      applicationDeadline:
        drive.applicationDeadline ?? "",

      driveDate:
        drive.driveDate ?? "",
    });

    setFormError("");
    setShowModal(true);
  }


  /* =========================================================
     RESET MODAL
     ========================================================= */

  function resetModal() {

    setShowModal(false);
    setEditingDrive(null);
    setFormData(createInitialForm());
    setFormError("");
  }


  /* =========================================================
     CLOSE MODAL
     ========================================================= */

  function handleCloseModal() {

    if (submitting) {
      return;
    }

    resetModal();
  }


  /* =========================================================
     FORM CHANGE
     ========================================================= */

  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  }


  /* =========================================================
     FORM VALIDATION
     ========================================================= */

  function validateForm() {

    /* ---------- Company ---------- */

    if (!formData.companyId) {
      return "Please select a company.";
    }


    /* ---------- Job title ---------- */

    if (!formData.jobTitle.trim()) {
      return "Job title is required.";
    }

    if (formData.jobTitle.trim().length > 150) {
      return "Job title must not exceed 150 characters.";
    }


    /* ---------- Description ---------- */

    if (formData.description.length > 5000) {
      return "Description must not exceed 5000 characters.";
    }


    /* ---------- CGPA ---------- */

    if (formData.minimumCgpa !== "") {

      const cgpa =
        Number(formData.minimumCgpa);

      if (
        Number.isNaN(cgpa) ||
        cgpa < 0 ||
        cgpa > 10
      ) {
        return "Minimum CGPA must be between 0 and 10.";
      }
    }


    /* ---------- 10th percentage ---------- */

    if (
      formData.minimumTenthPercentage !== ""
    ) {

      const percentage =
        Number(
          formData.minimumTenthPercentage
        );

      if (
        Number.isNaN(percentage) ||
        percentage < 0 ||
        percentage > 100
      ) {
        return "Minimum 10th percentage must be between 0 and 100.";
      }
    }


    /* ---------- 12th percentage ---------- */

    if (
      formData.minimumTwelfthPercentage !== ""
    ) {

      const percentage =
        Number(
          formData.minimumTwelfthPercentage
        );

      if (
        Number.isNaN(percentage) ||
        percentage < 0 ||
        percentage > 100
      ) {
        return "Minimum 12th percentage must be between 0 and 100.";
      }
    }


    /* ---------- Application deadline ---------- */

    if (!formData.applicationDeadline) {
      return "Application deadline is required.";
    }

    const today = getToday();

    if (
      formData.applicationDeadline < today
    ) {
      return "Application deadline cannot be in the past.";
    }


    /* ---------- Drive date ---------- */

    if (formData.driveDate) {

      if (
        formData.driveDate <
        formData.applicationDeadline
      ) {
        return "Drive date cannot be before application deadline.";
      }
    }


    return "";
  }


  /* =========================================================
     CREATE / UPDATE
     ========================================================= */

  async function handleSubmit(event) {

    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {

      setFormError(validationError);

      return;
    }

    try {

      setSubmitting(true);
      setFormError("");

      if (editingDrive) {

        const updatedDrive =
          await updatePlacementDrive(
            editingDrive.driveId,
            formData
          );

        setDrives((previous) =>
          previous.map((drive) =>
            drive.driveId ===
            updatedDrive.driveId
              ? updatedDrive
              : drive
          )
        );

      } else {

        const createdDrive =
          await createPlacementDrive(
            formData
          );

        setDrives((previous) => [
          createdDrive,
          ...previous,
        ]);
      }

      /*
       * Do not use handleCloseModal() here because
       * submitting is still true.
       *
       * resetModal() intentionally closes the modal
       * after a successful API operation.
       */
      resetModal();

    } catch (err) {

      console.error(
        "Failed to save placement drive:",
        err
      );

      setFormError(
        getErrorMessage(
          err,
          "Unable to save placement drive."
        )
      );

    } finally {

      setSubmitting(false);
    }
  }


  /* =========================================================
     STATUS TRANSITIONS
     ========================================================= */

  function getAllowedStatuses(currentStatus) {

    switch (currentStatus) {

      case "DRAFT":
        return [
          "DRAFT",
          "OPEN",
          "CANCELLED",
        ];

      case "OPEN":
        return [
          "OPEN",
          "CLOSED",
          "CANCELLED",
        ];

      case "CLOSED":
        return [
          "CLOSED",
        ];

      case "CANCELLED":
        return [
          "CANCELLED",
        ];

      default:
        return [
          currentStatus,
        ];
    }
  }


  /* =========================================================
     UPDATE STATUS
     ========================================================= */

  async function handleStatusChange(
    drive,
    newStatus
  ) {

    if (
      !newStatus ||
      newStatus === drive.status
    ) {
      return;
    }

    const allowedStatuses =
      getAllowedStatuses(drive.status);

    if (
      !allowedStatuses.includes(newStatus)
    ) {

      setError(
        `Cannot change status from ${formatStatus(
          drive.status
        )} to ${formatStatus(newStatus)}.`
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to change "${drive.jobTitle}" status from ${formatStatus(
          drive.status
        )} to ${formatStatus(newStatus)}?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setStatusUpdatingDriveId(
        drive.driveId
      );

      setError("");

      const updatedDrive =
        await updatePlacementDriveStatus(
          drive.driveId,
          newStatus
        );

      setDrives((previous) =>
        previous.map((item) =>
          item.driveId ===
          updatedDrive.driveId
            ? updatedDrive
            : item
        )
      );

    } catch (err) {

      console.error(
        "Failed to update placement drive status:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to update placement drive status."
        )
      );

    } finally {

      setStatusUpdatingDriveId(null);
    }
  }


  /* =========================================================
     DELETE
     ========================================================= */

  async function handleDeleteDrive(drive) {

    /*
     * Frontend protection.
     * Backend must enforce the same business rules.
     */
    if (
      drive.status !== "DRAFT" &&
      drive.status !== "CANCELLED"
    ) {

      setError(
        "Only draft or cancelled placement drives can be deleted."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete the placement drive "${drive.jobTitle}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");

      await deletePlacementDrive(
        drive.driveId
      );

      setDrives((previous) =>
        previous.filter(
          (item) =>
            item.driveId !==
            drive.driveId
        )
      );

    } catch (err) {

      console.error(
        "Failed to delete placement drive:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to delete placement drive."
        )
      );
    }
  }


  /* =========================================================
     STATUS CLASS
     ========================================================= */

  function getStatusClass(status) {

    switch (status) {

      case "OPEN":
        return "open";

      case "CLOSED":
        return "closed";

      case "CANCELLED":
        return "cancelled";

      case "DRAFT":
      default:
        return "draft";
    }
  }


  /* =========================================================
     ERROR MESSAGE
     ========================================================= */

  function getErrorMessage(
    error,
    fallback
  ) {

    if (
      error?.response?.data?.message
    ) {
      return error.response.data.message;
    }

    if (
      typeof error?.response?.data ===
      "string"
    ) {
      return error.response.data;
    }

    if (error?.message) {
      return error.message;
    }

    return fallback;
  }


  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="dashboard-layout">

      {/* ADMIN SIDEBAR */}
      <Sidebar role="ADMIN" />

      <main className="dashboard-main">

        {/* ADMIN TOPBAR */}
        <Topbar role="ADMIN" />

        <section className="dashboard-content">

          <div className="placement-drives-page">

            {/* =================================================
                PAGE HEADER
                ================================================= */}

            <div className="placement-drives-header">

              <div>
                <h1>Placement Drives</h1>

                <p>
                  Manage company placement opportunities
                  and recruitment drives.
                </p>
              </div>

              <button
                type="button"
                className="add-drive-button"
                onClick={handleAddDrive}
              >
                + Add Placement Drive
              </button>

            </div>


            {/* =================================================
                ERROR
                ================================================= */}

            {error && (

              <div className="drive-error">

                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={() => setError("")}
                >
                  ×
                </button>

              </div>

            )}


            {/* =================================================
                STATISTICS
                ================================================= */}

            <div className="drive-stat-grid">

              <div className="drive-stat-card">

                <span>
                  Total Drives
                </span>

                <strong>
                  {statistics.total}
                </strong>

                <small>
                  All placement drives
                </small>

              </div>


              <div className="drive-stat-card">

                <span>
                  Draft
                </span>

                <strong>
                  {statistics.draft}
                </strong>

                <small>
                  Not yet opened
                </small>

              </div>


              <div className="drive-stat-card">

                <span>
                  Open
                </span>

                <strong>
                  {statistics.open}
                </strong>

                <small>
                  Currently open
                </small>

              </div>


              <div className="drive-stat-card">

                <span>
                  Closed
                </span>

                <strong>
                  {statistics.closed}
                </strong>

                <small>
                  Completed drives
                </small>

              </div>


              <div className="drive-stat-card">

                <span>
                  Cancelled
                </span>

                <strong>
                  {statistics.cancelled}
                </strong>

                <small>
                  Cancelled drives
                </small>

              </div>

            </div>


            {/* =================================================
                TABLE CARD
                ================================================= */}

            <div className="placement-drives-table-card">

              <div className="placement-drives-table-header">

                <div>

                  <h2>
                    Placement Drives
                  </h2>

                  <p>
                    View and manage all placement
                    opportunities.
                  </p>

                </div>


                <div className="drive-search-wrapper">

                  <input
                    type="text"
                    className="drive-search"
                    placeholder="Search drives..."
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* =================================================
                  LOADING
                  ================================================= */}

              {loading ? (

                <div className="drive-loading">
                  Loading placement drives...
                </div>

              ) : filteredDrives.length === 0 ? (

                <div className="drive-empty">

                  <div className="drive-empty-icon">
                    📋
                  </div>

                  <h3>
                    {searchTerm
                      ? "No matching drives"
                      : "No placement drives"}
                  </h3>

                  <p>
                    {searchTerm
                      ? "Try changing your search."
                      : "Create your first placement drive to get started."}
                  </p>

                  {!searchTerm && (

                    <button
                      type="button"
                      className="empty-add-drive-button"
                      onClick={handleAddDrive}
                    >
                      + Add Placement Drive
                    </button>

                  )}

                </div>

              ) : (

                <div className="placement-drives-table-wrapper">

                  <table className="placement-drives-table">

                    <thead>

                      <tr>
                        <th>Company</th>
                        <th>Position</th>
                        <th>Deadline</th>
                        <th>Drive Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>

                    </thead>


                    <tbody>

                      {filteredDrives.map(
                        (drive) => (

                          <tr
                            key={
                              drive.driveId
                            }
                          >

                            <td>

                              <div className="drive-company">

                                <strong>
                                  {
                                    drive.companyName
                                  }
                                </strong>

                                <span>
                                  Company ID:{" "}
                                  {
                                    drive.companyId
                                  }
                                </span>

                              </div>

                            </td>


                            <td>

                              <div className="drive-position">

                                <strong>
                                  {
                                    drive.jobTitle
                                  }
                                </strong>

                                {drive.description && (

                                  <span>
                                    {truncateText(
                                      drive.description,
                                      60
                                    )}
                                  </span>

                                )}

                              </div>

                            </td>


                            <td>
                              {formatDate(
                                drive.applicationDeadline
                              )}
                            </td>


                            <td>
                              {drive.driveDate
                                ? formatDate(
                                    drive.driveDate
                                  )
                                : "—"}
                            </td>


                            {/* =================================================
                                STATUS
                                ================================================= */}

                            <td>

                              <div className="drive-status-wrapper">

                                <span
                                  className={`drive-status ${getStatusClass(
                                    drive.status
                                  )}`}
                                >
                                  {formatStatus(
                                    drive.status
                                  )}
                                </span>


                                <select
                                  className="drive-status-select"
                                  value={drive.status}
                                  onChange={(event) =>
                                    handleStatusChange(
                                      drive,
                                      event.target.value
                                    )
                                  }
                                  disabled={
                                    statusUpdatingDriveId ===
                                    drive.driveId
                                  }
                                  aria-label={`Change status for ${drive.jobTitle}`}
                                >

                                  {getAllowedStatuses(
                                    drive.status
                                  ).map(
                                    (status) => (

                                      <option
                                        key={status}
                                        value={status}
                                      >
                                        {formatStatus(
                                          status
                                        )}
                                      </option>

                                    )
                                  )}

                                </select>


                                {statusUpdatingDriveId ===
                                  drive.driveId && (

                                  <small>
                                    Updating...
                                  </small>

                                )}

                              </div>

                            </td>


                            {/* =================================================
                                ACTIONS
                                ================================================= */}

                            <td>

                              <div className="drive-actions">

                                <button
                                  type="button"
                                  className="drive-edit-button"
                                  onClick={() =>
                                    handleEditDrive(
                                      drive
                                    )
                                  }
                                  disabled={
                                    statusUpdatingDriveId ===
                                    drive.driveId
                                  }
                                >
                                  Edit
                                </button>


                                <button
                                  type="button"
                                  className="drive-delete-button"
                                  onClick={() =>
                                    handleDeleteDrive(
                                      drive
                                    )
                                  }
                                  disabled={
                                    statusUpdatingDriveId ===
                                    drive.driveId
                                  }
                                >
                                  Delete
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

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          MODAL
          ===================================================== */}

      {showModal && (

        <div
          className="drive-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseModal();
            }

          }}
        >

          <div className="drive-modal">

            <div className="drive-modal-header">

              <div>

                <h2>
                  {editingDrive
                    ? "Edit Placement Drive"
                    : "Add Placement Drive"}
                </h2>

                <p>
                  {editingDrive
                    ? "Update the placement drive details."
                    : "Create a new placement drive."}
                </p>

              </div>


              <button
                type="button"
                className="drive-modal-close"
                onClick={handleCloseModal}
                disabled={submitting}
              >
                ×
              </button>

            </div>


            <form
              className="drive-form"
              onSubmit={handleSubmit}
            >

              {/* =================================================
                  COMPANY
                  ================================================= */}

              <div className="drive-form-group">

                <label htmlFor="companyId">

                  Company

                  <span>
                    *
                  </span>

                </label>


                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  disabled={submitting}
                >

                  <option value="">
                    Select company
                  </option>


                  {companies.map(
                    (company) => (

                      <option
                        key={
                          company.companyId
                        }
                        value={
                          company.companyId
                        }
                      >
                        {
                          company.companyName
                        }
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* =================================================
                  JOB TITLE
                  ================================================= */}

              <div className="drive-form-group">

                <label htmlFor="jobTitle">

                  Job Title

                  <span>
                    *
                  </span>

                </label>


                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  placeholder="e.g. Java Developer"
                  maxLength={150}
                  value={formData.jobTitle}
                  onChange={handleChange}
                  disabled={submitting}
                />


                <small>
                  {formData.jobTitle.length}/150
                </small>

              </div>


              {/* =================================================
                  DESCRIPTION
                  ================================================= */}

              <div className="drive-form-group">

                <label htmlFor="description">
                  Description
                </label>


                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the role and responsibilities..."
                  maxLength={5000}
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={submitting}
                />


                <small>
                  {formData.description.length}/5000
                </small>

              </div>


              {/* =================================================
                  ELIGIBILITY
                  ================================================= */}

              <div className="drive-form-section-title">
                Eligibility Criteria
              </div>


              <div className="drive-form-grid">

                <div className="drive-form-group">

                  <label htmlFor="minimumCgpa">
                    Minimum CGPA
                  </label>


                  <input
                    id="minimumCgpa"
                    name="minimumCgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    placeholder="e.g. 7.50"
                    value={
                      formData.minimumCgpa
                    }
                    onChange={handleChange}
                    disabled={submitting}
                  />

                </div>


                <div className="drive-form-group">

                  <label htmlFor="minimumTenthPercentage">
                    Minimum 10th %
                  </label>


                  <input
                    id="minimumTenthPercentage"
                    name="minimumTenthPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g. 70"
                    value={
                      formData.minimumTenthPercentage
                    }
                    onChange={handleChange}
                    disabled={submitting}
                  />

                </div>


                <div className="drive-form-group">

                  <label htmlFor="minimumTwelfthPercentage">
                    Minimum 12th %
                  </label>


                  <input
                    id="minimumTwelfthPercentage"
                    name="minimumTwelfthPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g. 70"
                    value={
                      formData.minimumTwelfthPercentage
                    }
                    onChange={handleChange}
                    disabled={submitting}
                  />

                </div>

              </div>


              {/* =================================================
                  DATES
                  ================================================= */}

              <div className="drive-form-section-title">
                Drive Schedule
              </div>


              <div className="drive-form-grid">

                <div className="drive-form-group">

                  <label htmlFor="applicationDeadline">

                    Application Deadline

                    <span>
                      *
                    </span>

                  </label>


                  <input
                    id="applicationDeadline"
                    name="applicationDeadline"
                    type="date"
                    min={getToday()}
                    value={
                      formData.applicationDeadline
                    }
                    onChange={handleChange}
                    disabled={submitting}
                  />

                </div>


                <div className="drive-form-group">

                  <label htmlFor="driveDate">
                    Drive Date
                  </label>


                  <input
                    id="driveDate"
                    name="driveDate"
                    type="date"
                    min={
                      formData.applicationDeadline ||
                      getToday()
                    }
                    value={
                      formData.driveDate
                    }
                    onChange={handleChange}
                    disabled={submitting}
                  />

                </div>

              </div>


              {/* =================================================
                  FORM ERROR
                  ================================================= */}

              {formError && (

                <div className="drive-form-error">
                  {formError}
                </div>

              )}


              {/* =================================================
                  ACTIONS
                  ================================================= */}

              <div className="drive-modal-actions">

                <button
                  type="button"
                  className="drive-cancel-button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="drive-submit-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : editingDrive
                    ? "Update Drive"
                    : "Create Drive"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */


/*
 * Returns today's date in the browser's local timezone.
 *
 * Format:
 * YYYY-MM-DD
 */
function getToday() {

  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/*
 * Formats:
 * YYYY-MM-DD
 *
 * As:
 * 02 Oct 2026
 */
function formatDate(dateString) {

  if (!dateString) {
    return "—";
  }

  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


/*
 * Converts:
 * DRAFT
 *
 * To:
 * Draft
 */
function formatStatus(status) {

  if (!status) {
    return "Unknown";
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1).toLowerCase()
  );
}


/*
 * Truncates long descriptions
 * for the table.
 */
function truncateText(
  text,
  maxLength
) {

  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return (
    text.substring(0, maxLength) +
    "..."
  );
}


export default PlacementDrives;