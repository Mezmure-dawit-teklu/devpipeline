import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();

  const handleDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/access-denied");
      return;
    }

    if (!user.role) {
      navigate("/access-denied");
      return;
    }

    navigate(`/dashboard/${user.role}`);
  };

  return (
    <header className="header">
      <div className="header-inner">

        <div className="logo">
          <img src="/image.png" alt="logo" className="logo-img" />
          <h2>DevPipeline</h2>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>
        </nav>

        <div className="actions">
          <button className="dashboard-btn" onClick={handleDashboard}>
            Dashboard
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;