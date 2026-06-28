import { useEffect, useState } from "react";
import axios from "axios";
import { getUser, logout } from "../auth";
import { useNavigate } from "react-router-dom";
import "../styles/PMDashboard.css";
import pmImage from "../assets/best-project-management-software-ca.webp";

function PMDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [openProjects, setOpenProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // ================= ACCESS =================
  if (!user || user.role !== "pm") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Access Denied ❌</h2>
        <button onClick={() => navigate("/login")}>Go To Login</button>
      </div>
    );
  }

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  // ================= FETCH ALL PROJECTS (FLASK) =================
  const fetchOpenProjects = () => {
    axios
      .get("http://127.0.0.1:5000/api/projects")
      .then((res) => {
        setOpenProjects(res.data.projects || []);
      })
      .catch(() => setOpenProjects([]));
  };

  // ================= FETCH APPLICATIONS =================
  const fetchApplications = () => {
    axios
      .get(`http://127.0.0.1:5000/api/applications/pm/${user.id}`)
      .then((res) => {
        setApplications(res.data.applications || []);
      })
      .catch(() => setApplications([]));
  };

  // ================= FETCH APPROVED PROJECTS =================
  const fetchMyProjects = () => {
    axios
      .get(`http://127.0.0.1:5000/api/projects/approved/${user.id}`)
      .then((res) => {
        setMyProjects(res.data.projects || []);
      })
      .catch(() => setMyProjects([]));
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!user?.id) return;

    fetchOpenProjects();
    fetchApplications();
    fetchMyProjects();

    const interval = setInterval(() => {
      fetchApplications();
      fetchMyProjects();
    }, 4000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // ================= APPLY PROJECT =================
  const applyProject = (projectId) => {
    axios
      .post("http://127.0.0.1:5000/api/applications/apply", {
        pm_id: user.id,
        project_id: projectId,
      })
      .then((res) => {
        if (res.data.success) {
          alert("Application submitted ✅");
          fetchApplications();
        } else {
          alert(res.data.message || "Failed");
        }
      })
      .catch(() => alert("Apply failed"));
  };

  // ================= GET STATUS =================
  const getStatus = (projectId) => {
    const app = applications.find((a) => a.project_id == projectId);
    return app?.status || null;
  };

  // ================= UI =================
  return (
    <div className="pm-dashboard">

      {/* HEADER */}
      <div className="pm-header">
        <h1>Project Manager Dashboard</h1>
        <h3>Welcome {user.name}</h3>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* NAV */}
      <div className="pm-subnav">
        <button onClick={() => setActiveTab("overview")}>Overview</button>
        <button onClick={() => setActiveTab("open")}>Available Projects</button>
        <button onClick={() => setActiveTab("applications")}>My Applications</button>
        <button onClick={() => setActiveTab("my")}>My Projects</button>
      </div>

      <hr />

      {/* ================= OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="pm-overview">
          <img src={pmImage} alt="PM" style={{ width: "300px" }} />

          <p>Apply for projects and wait for approval from Project Sponsor.</p>

          <div>
            <p>Available Projects: {openProjects.length}</p>
            <p>Applications: {applications.length}</p>
            <p>Approved Projects: {myProjects.length}</p>
          </div>
        </div>
      )}

      {/* ================= OPEN PROJECTS ================= */}
      {activeTab === "open" && (
        <div>
          <h2>Available Projects</h2>

          {openProjects.length === 0 ? (
            <p>No projects available</p>
          ) : (
            openProjects.map((p) => {
              const status = getStatus(p.id);

              return (
                <div key={p.id} className="pm-card">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>

                  {!status && (
                    <button onClick={() => applyProject(p.id)}>
                      Apply
                    </button>
                  )}

                  {status === "pending" && (
                    <button disabled>Pending ⏳</button>
                  )}

                  {status === "approved" && (
                    <button disabled>Approved ✅</button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ================= MY APPLICATIONS ================= */}
      {activeTab === "applications" && (
        <div>
          <h2>My Applications</h2>

          {applications.length === 0 ? (
            <p>No applications yet</p>
          ) : (
            applications.map((a) => (
              <div key={a.id} className="pm-card">
                <h3>{a.title}</h3>
                <p>{a.description}</p>

                <p>
                  Status:{" "}
                  <b
                    style={{
                      color: a.status === "approved" ? "green" : "orange",
                    }}
                  >
                    {a.status}
                  </b>
                </p>

                <p>Applied: {a.created_at}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= MY APPROVED PROJECTS ================= */}
      {activeTab === "my" && (
        <div>
          <h2>My Approved Projects</h2>

          {myProjects.length === 0 ? (
            <p>No approved projects yet</p>
          ) : (
            myProjects.map((p) => (
              <div
                key={p.id}
                className="pm-card"
                onClick={() => navigate(`/project/${p.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <small>Click to open project</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PMDashboard;