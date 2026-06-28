import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: ""
  });

  const [rolesFromDB, setRolesFromDB] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/login",
        {
          email: form.email.trim().toLowerCase(),
          password: form.password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = res.data;

      if (!data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ❌ REMOVE FD HERE
      const roles = (data.roles || []).filter(role => role !== "fd");

      if (roles.length === 0) {
        setError("No valid roles assigned to this user");
        setLoading(false);
        return;
      }

      const baseUser = data.user;

      // store user + roles (cleaned)
      localStorage.setItem("user", JSON.stringify(baseUser));
      localStorage.setItem("roles", JSON.stringify(roles));

      // if multiple roles → choose
      if (roles.length > 1) {
        setRolesFromDB(roles);
        setStep(2);
        setLoading(false);
        return;
      }

      // single role auto select
      setRolesFromDB(roles);
      setForm((prev) => ({
        ...prev,
        role: roles[0]
      }));

      setStep(2);
      setLoading(false);

    } catch (err) {
      setError(err.response?.data?.message || "Server error");
      setLoading(false);
    }
  };

  // ================= ROLE SELECT =================
  const confirmRole = () => {
    const role = form.role;

    if (!role) {
      setError("Select a role");
      return;
    }

    // extra safety (FD blocked again)
    if (role === "fd") {
      setError("FD role is not allowed");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const finalUser = {
      ...user,
      role
    };

    localStorage.setItem("user", JSON.stringify(finalUser));

    navigate(`/dashboard/${role}`, { replace: true });
  };

  return (
    <div style={{ width: "320px", margin: "100px auto" }}>
      <h2>Login</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: "100%", padding: "10px" }}
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h3>Select Role</h3>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          >
            <option value="">Choose role</option>

            {rolesFromDB.map((r, i) => (
              <option key={i} value={r}>
                {r.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={confirmRole}
            style={{ width: "100%", padding: "10px" }}
          >
            Continue
          </button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;