import { NavLink } from "react-router-dom";

const STUDENT_MENU = [
  {
    label: "Dashboard",
    path: "/student/dashboard",
  },
  {
    label: "Profile",
    path: "/student/profile",
  },
  {
    label: "Placement Drives",
    path: "/student/placement-drives",
  },
  {
    label: "My Applications",
    path: "/student/applications",
  },
  {
    label: "Interviews",
    path: "/student/interviews",
  },
  {
    label: "Resume",
    path: "/student/resume",
  },
  {
    label: "Skills",
    path: "/student/skills",
  },
  {
    label: "Preparation",
    path: "/student/preparation",
  },
  {
    label: "Notifications",
    path: "/student/notifications",
  },
];

const ADMIN_MENU = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    label: "Companies",
    path: "/admin/companies",
  },
  {
    label: "Placement Drives",
    path: "/admin/placement-drives",
  },
  {
    label: "Applications",
    path: "/admin/applications",
  },
  {
    label: "Students",
    path: "/admin/students",
  },
  {
    label: "Interviews",
    path: "/admin/interviews",
  },
  {
    label: "Notifications",
    path: "/admin/notifications",
  },
  {
    label: "Reports",
    path: "/admin/reports",
  },
];

function Sidebar({ role }) {
  const menu =
    role === "ADMIN"
      ? ADMIN_MENU
      : STUDENT_MENU;

  const isAdmin = role === "ADMIN";

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">
          C
        </span>

        <span>CareerFlow</span>
      </div>

      <div className="sidebar-role">
        {isAdmin
          ? "ADMINISTRATION"
          : "STUDENT PORTAL"}
      </div>

      <nav
        className="sidebar-nav"
        aria-label="Main navigation"
      >
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            <span
              className="sidebar-link-icon"
              aria-hidden="true"
            >
              •
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/logout"
          className="sidebar-logout"
        >
          <span aria-hidden="true">
            ↪
          </span>

          <span>Logout</span>
        </NavLink>
      </div>

    </aside>
  );
}

export default Sidebar;