import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./authService";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login", { replace: true });
  }, [navigate]);

  return <div>Logging out...</div>;
}

export default Logout;