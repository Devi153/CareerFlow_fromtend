import { useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import "./Profile.css";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    department: "",
    graduationYear: "",
    cgpa: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    skills: "",
    resume: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resumePreviewUrl, setResumePreviewUrl] = useState(null);

  const resumeInputRef = useRef(null);

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    loadProfile();

    return () => {
      if (resumePreviewUrl) {
        URL.revokeObjectURL(resumePreviewUrl);
      }
    };
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/api/student/profile"
      );

      const data = response.data;

      setProfile(data);

      setFormData({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        department: data.department || "",
        graduationYear: data.graduationYear ?? "",
        cgpa: data.cgpa ?? "",
        tenthPercentage: data.tenthPercentage ?? "",
        twelfthPercentage: data.twelfthPercentage ?? "",
        skills: data.skills || "",
        resume: null,
      });
    } catch (err) {
      console.error("Failed to load profile:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ============================================================
  // HANDLE RESUME SELECTION
  // ============================================================

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setError("Resume size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    if (resumePreviewUrl) {
      URL.revokeObjectURL(resumePreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);

    setResumePreviewUrl(previewUrl);

    setFormData((previous) => ({
      ...previous,
      resume: file,
    }));
  };

  // ============================================================
  // REMOVE SELECTED RESUME
  // ============================================================

  const removeSelectedResume = () => {
    if (resumePreviewUrl) {
      URL.revokeObjectURL(resumePreviewUrl);
    }

    setResumePreviewUrl(null);

    setFormData((previous) => ({
      ...previous,
      resume: null,
    }));

    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  // ============================================================
  // EDIT PROFILE
  // ============================================================

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  // ============================================================
  // CANCEL EDIT
  // ============================================================

  const handleCancel = () => {
    if (resumePreviewUrl) {
      URL.revokeObjectURL(resumePreviewUrl);
    }

    setResumePreviewUrl(null);

    setFormData({
      fullName: profile?.fullName || "",
      phoneNumber: profile?.phoneNumber || "",
      department: profile?.department || "",
      graduationYear: profile?.graduationYear ?? "",
      cgpa: profile?.cgpa ?? "",
      tenthPercentage: profile?.tenthPercentage ?? "",
      twelfthPercentage: profile?.twelfthPercentage ?? "",
      skills: profile?.skills || "",
      resume: null,
    });

    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }

    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  // ============================================================
  // SAVE PROFILE
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setSaving(true);

      // --------------------------------------------------------
      // Prepare profile JSON
      // --------------------------------------------------------

      const profileData = {
        fullName: formData.fullName.trim(),

        phoneNumber:
          formData.phoneNumber.trim() === ""
            ? null
            : formData.phoneNumber.trim(),

        department:
          formData.department.trim() === ""
            ? null
            : formData.department.trim(),

        graduationYear:
          formData.graduationYear === ""
            ? null
            : Number(formData.graduationYear),

        cgpa:
          formData.cgpa === ""
            ? null
            : Number(formData.cgpa),

        tenthPercentage:
          formData.tenthPercentage === ""
            ? null
            : Number(formData.tenthPercentage),

        twelfthPercentage:
          formData.twelfthPercentage === ""
            ? null
            : Number(formData.twelfthPercentage),

        skills:
          formData.skills.trim() === ""
            ? null
            : formData.skills.trim(),
      };

      // --------------------------------------------------------
      // Create multipart request
      // --------------------------------------------------------

      const requestData = new FormData();

      /*
       * IMPORTANT:
       *
       * Backend expects:
       *
       * @RequestPart("profile")
       * StudentProfileRequest request
       */

      requestData.append(
        "profile",
        new Blob(
          [JSON.stringify(profileData)],
          {
            type: "application/json",
          }
        )
      );

      // --------------------------------------------------------
      // Add resume only if user selected a new PDF
      // --------------------------------------------------------

      if (formData.resume) {
        requestData.append(
          "resume",
          formData.resume
        );
      }

      // --------------------------------------------------------
      // Send request
      // --------------------------------------------------------

      const response = await axiosInstance.put(
        "/api/student/profile",
        requestData
      );

      // --------------------------------------------------------
      // Update profile with backend response
      // --------------------------------------------------------

      const updatedProfile = response.data;

      setProfile(updatedProfile);

      setFormData({
        fullName: updatedProfile.fullName || "",
        phoneNumber: updatedProfile.phoneNumber || "",
        department: updatedProfile.department || "",
        graduationYear:
          updatedProfile.graduationYear ?? "",
        cgpa: updatedProfile.cgpa ?? "",
        tenthPercentage:
          updatedProfile.tenthPercentage ?? "",
        twelfthPercentage:
          updatedProfile.twelfthPercentage ?? "",
        skills: updatedProfile.skills || "",
        resume: null,
      });

      // --------------------------------------------------------
      // Clear local resume preview
      // --------------------------------------------------------

      if (resumePreviewUrl) {
        URL.revokeObjectURL(resumePreviewUrl);
      }

      setResumePreviewUrl(null);

      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }

      // --------------------------------------------------------
      // Exit edit mode
      // --------------------------------------------------------

      setIsEditing(false);

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError(
          "Invalid profile data. Please check your details."
        );
      } else if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You are not authorized to update this profile."
        );
      } else {
        setError(
          "Failed to update profile. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // VIEW SAVED RESUME
  // ============================================================

  const handleViewResume = async () => {
    try {
      setError("");

      const response = await axiosInstance.get(
        "/api/student/profile/resume",
        {
          responseType: "blob",
        }
      );

      const blobUrl = URL.createObjectURL(
        response.data
      );

      window.open(
        blobUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 60000);
    } catch (err) {
      console.error(
        "Failed to open resume:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (err.response?.status === 404) {
        setError("Resume not found.");
      } else {
        setError(
          "Unable to open the resume."
        );
      }
    }
  };

  // ============================================================
  // PROFILE COMPLETION
  // ============================================================

  const profileCompletion = useMemo(() => {
    if (!profile) {
      return 0;
    }

    const fields = [
      profile.fullName,
      profile.phoneNumber,
      profile.department,
      profile.graduationYear,
      profile.cgpa,
      profile.tenthPercentage,
      profile.twelfthPercentage,
      profile.skills,
      profile.resumeUrl,
    ];

    const completedFields = fields.filter(
      (field) =>
        field !== null &&
        field !== undefined &&
        String(field).trim() !== ""
    ).length;

    return Math.round(
      (completedFields / fields.length) * 100
    );
  }, [profile]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="profile-header">

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your personal and academic
              information.
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="edit-button"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}

        </div>

        {/* =====================================================
            SUCCESS MESSAGE
        ====================================================== */}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* =====================================================
            ERROR MESSAGE
        ====================================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* =====================================================
            PROFILE COMPLETION
        ====================================================== */}

        <div className="profile-completion">

          <div className="completion-header">

            <span>
              Profile Completion
            </span>

            <strong>
              {profileCompletion}%
            </strong>

          </div>

          <div className="completion-bar">

            <div
              className="completion-progress"
              style={{
                width: `${profileCompletion}%`,
              }}
            />

          </div>

        </div>

        {/* =====================================================
            PROFILE FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="profile-form"
        >

          {/* ===================================================
              PERSONAL INFORMATION
          ==================================================== */}

          <section className="profile-section">

            <h2>Personal Information</h2>

            <div className="form-grid">

              {/* Full Name */}

              <div className="form-group">

                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />

              </div>

              {/* Email */}

              <div className="form-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                />

              </div>

              {/* Phone Number */}

              <div className="form-group">

                <label htmlFor="phoneNumber">
                  Phone Number
                </label>

                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />

              </div>

            </div>

          </section>

          {/* ===================================================
              ACADEMIC INFORMATION
          ==================================================== */}

          <section className="profile-section">

            <h2>Academic Information</h2>

            <div className="form-grid">

              {/* Department */}

              <div className="form-group">

                <label htmlFor="department">
                  Department
                </label>

                <input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter department"
                />

              </div>

              {/* Graduation Year */}

              <div className="form-group">

                <label htmlFor="graduationYear">
                  Graduation Year
                </label>

                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="2000"
                  max="2100"
                  placeholder="2026"
                />

              </div>

              {/* CGPA */}

              <div className="form-group">

                <label htmlFor="cgpa">
                  CGPA
                </label>

                <input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  value={formData.cgpa}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="8.50"
                />

              </div>

              {/* 10th Percentage */}

              <div className="form-group">

                <label htmlFor="tenthPercentage">
                  10th Percentage
                </label>

                <input
                  id="tenthPercentage"
                  name="tenthPercentage"
                  type="number"
                  value={formData.tenthPercentage}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="85"
                />

              </div>

              {/* 12th Percentage */}

              <div className="form-group">

                <label htmlFor="twelfthPercentage">
                  12th Percentage
                </label>

                <input
                  id="twelfthPercentage"
                  name="twelfthPercentage"
                  type="number"
                  value={formData.twelfthPercentage}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="88"
                />

              </div>

            </div>

          </section>

          {/* ===================================================
              SKILLS
          ==================================================== */}

          <section className="profile-section">

            <h2>Skills</h2>

            <div className="form-group">

              <label htmlFor="skills">
                Technical Skills
              </label>

              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                disabled={!isEditing}
                rows="5"
                placeholder="Example: Java, Spring Boot, React, MySQL"
              />

            </div>

          </section>

          {/* ===================================================
              SAVED RESUME
          ==================================================== */}

          {!isEditing && profile?.resumeUrl && (

            <section className="profile-section">

              <h2>Resume</h2>

              <div className="resume-box">

                <div className="resume-info">

                  <span className="resume-icon">
                    📄
                  </span>

                  <div>

                    <strong>
                      Resume uploaded
                    </strong>

                    <p>
                      Your saved PDF resume
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  className="view-resume-button"
                  onClick={handleViewResume}
                >
                  View Resume
                </button>

              </div>

            </section>

          )}

          {/* ===================================================
              RESUME UPLOAD
          ==================================================== */}

          {isEditing && (

            <section className="profile-section">

              <h2>Resume</h2>

              <div className="resume-upload">

                <label htmlFor="resume">
                  Upload Resume
                </label>

                <input
                  ref={resumeInputRef}
                  id="resume"
                  name="resume"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleResumeChange}
                />

                <p className="resume-help">
                  PDF only. Maximum size: 5 MB.
                </p>

              </div>

              {/* New Resume */}

              {formData.resume && (

                <div className="selected-resume">

                  <div>

                    <strong>
                      Selected Resume
                    </strong>

                    <p>
                      {formData.resume.name}
                    </p>

                    <small>
                      {(
                        formData.resume.size /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </small>

                  </div>

                  <div className="resume-actions">

                    {resumePreviewUrl && (
                      <a
                        href={resumePreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="preview-resume-button"
                      >
                        Preview
                      </a>
                    )}

                    <button
                      type="button"
                      className="remove-resume-button"
                      onClick={
                        removeSelectedResume
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              )}

              {/* Existing Resume */}

              {!formData.resume &&
                profile?.resumeUrl && (

                  <div className="existing-resume">

                    <div>

                      <strong>
                        Existing Resume
                      </strong>

                      <p>
                        Your current resume will
                        remain unchanged unless you
                        select a new PDF.
                      </p>

                    </div>

                    <button
                      type="button"
                      className="view-resume-button"
                      onClick={handleViewResume}
                    >
                      View Current Resume
                    </button>

                  </div>

                )}

            </section>

          )}

          {/* ===================================================
              ACTION BUTTONS
          ==================================================== */}

          {isEditing && (

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          )}

        </form>

      </div>

    </div>
  );
}

export default Profile;