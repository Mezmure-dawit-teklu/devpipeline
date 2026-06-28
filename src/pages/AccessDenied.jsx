import { useNavigate } from "react-router-dom";

export default function AccessDenied() {

  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>

      <h1>Access Denied</h1>
      <p>You are not allowed to access this page.</p>

      <button onClick={() => navigate("/login")}>
        Go to Login
      </button>

    </div>
  );
}