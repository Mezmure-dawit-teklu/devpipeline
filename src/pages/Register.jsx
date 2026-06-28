import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "bd" // changed default from fd → bd
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    if (loading) return;

    setLoading(true);
    setMessage("");

    if (!form.name || !form.email || !form.password) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/register",
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: form.role
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        setMessage(res.data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setMessage(res.data.message || "Registration failed");
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }

    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-container">

        <h2>Register</h2>

        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="bd">BD</option>
          <option value="pm">PM</option>
          <option value="qa">QA</option>
          <option value="ps">PS</option>
        </select>

        <button onClick={registerUser} disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>

        {message && <p>{message}</p>}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;