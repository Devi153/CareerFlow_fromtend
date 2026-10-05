import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Logout from "../features/auth/Logout";
import ProtectedRoute from "../features/auth/ProtectedRoute";

/*
 * =========================================================
 * ADMIN FEATURES
 * =========================================================
 */

import AdminDashboard from "../features/admin/dashboard/AdminDashboard";
import AdminCompanies from "../features/admin/companies/Companies";
import AdminPlacementDrives from "../features/admin/placement-drives/PlacementDrives";
// import AdminApplications from "../features/admin/applications/Applications";
// import AdminStudents from "../features/admin/students/Students";
// import AdminInterviews from "../features/admin/interviews/Interviews";
// import AdminNotifications from "../features/admin/notifications/Notifications";
// import AdminReports from "../features/admin/reports/Reports";

/*
 * =========================================================
 * STUDENT FEATURES
 * =========================================================
 */

import StudentDashboard from "../features/student/dashboard/StudentDashboard";
import StudentProfile from "../features/student/profile/Profile";
import StudentPlacementDrives from "../features/student/placement-drives/PlacementDrives";
// import StudentApplications from "../features/student/applications/MyApplications";
// import StudentApplicationProgress from "../features/student/application-progress/ApplicationProgress";
// import StudentInterviews from "../features/student/interviews/Interviews";
// import StudentResume from "../features/student/resume/Resume";
// import StudentSkills from "../features/student/skills/Skills";
// import StudentPreparation from "../features/student/preparation/Preparation";
// import StudentNotifications from "../features/student/notifications/Notifications";


function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
          ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/logout"
        element={<Logout />}
      />


      {/* =====================================================
          ADMIN PROTECTED ROUTES
          ===================================================== */}

      <Route
        element={
          <ProtectedRoute allowedRole="ADMIN" />
        }
      >

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* Companies */}
        <Route
          path="/admin/companies"
          element={<AdminCompanies />}
        />

        {/* Placement Drives */}
        <Route
          path="/admin/placement-drives"
          element={<AdminPlacementDrives />}
        />


      </Route>


      {/* =====================================================
          STUDENT PROTECTED ROUTES
          ===================================================== */}

      <Route
        element={
          <ProtectedRoute allowedRole="STUDENT" />
        }
      >

        {/* Student Dashboard */}
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        {/* Student Profile */}
        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />

        {/* Placement Drives */}
        <Route
          path="/student/placement-drives"
          element={<StudentPlacementDrives />}
        />

      </Route>


      {/* =====================================================
          ROOT ROUTE
          ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* =====================================================
          UNKNOWN ROUTES
          ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;