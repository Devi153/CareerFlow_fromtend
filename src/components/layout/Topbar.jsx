function Topbar({ role }) {
  const isAdmin = role === "ADMIN";

  const title = isAdmin
    ? "Admin Dashboard"
    : "Student Dashboard";

  const description = isAdmin
    ? "Manage your placement operations"
    : "Track your placement journey";

  const userName = isAdmin
    ? "Administrator"
    : "Student";

  const userRole = isAdmin
    ? "Admin"
    : "Student";

  const avatar = isAdmin
    ? "A"
    : "S";

  return (
    <header className="topbar">

      <div className="topbar-content">
        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      <div className="topbar-right">

        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          ♧
          <span aria-hidden="true"></span>
        </button>

        <div className="user-profile">

          <div
            className="user-avatar"
            aria-hidden="true"
          >
            {avatar}
          </div>

          <div className="user-info">

            <strong>
              {userName}
            </strong>

            <small>
              {userRole}
            </small>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;