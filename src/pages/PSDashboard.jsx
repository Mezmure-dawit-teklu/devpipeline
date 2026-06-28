import { useEffect, useState } from "react";
import axios from "axios";
import { getUser, logout } from "../auth";
import { useNavigate } from "react-router-dom";
import "../styles/PSDashboard.css";

function PSDashboard() {
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const navigate = useNavigate();
  const user = getUser();

  const role = user?.role?.toLowerCase()?.trim();

  // ================= ACCESS =================
  if (!user || role !== "ps") {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        Access Denied ❌
      </h2>
    );
  }

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  // ================= FETCH PROJECTS =================
  const fetchProjects = () => {
    axios
      .get(`http://127.0.0.1:5000/api/projects/ps/${user.id}`)
      .then((res) => {
        setProjects(res.data.projects || []);
      })
      .catch(() => setProjects([]));
  };

  // ================= FETCH ALL APPLICATIONS FOR ONE PROJECT =================
  const fetchApplications = (projectId) => {
    setSelectedProject(projectId);
    setActiveTab("applications");

    axios
      .get(`http://127.0.0.1:5000/api/applications/project/${projectId}`)
      .then((res) => {
        setApplications(res.data.applications || []);
      })
      .catch(() => setApplications([]));
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchProjects();
  }, [user?.id]);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= CREATE PROJECT =================
  const createProject = () => {
    if (!form.title.trim()) return alert("Title required");

    axios
      .post("http://127.0.0.1:5000/api/projects/create", {
        title: form.title,
        description: form.description,
        ps_id: user.id
      })
      .then((res) => {
        if (res.data.success) {
          alert("Project created ✅");
          setForm({ title: "", description: "" });
          fetchProjects();
          setActiveTab("projects");
        } else {
          alert(res.data.message || "Failed");
        }
      })
      .catch(() => alert("Server error"));
  };

  // ================= CHECK IF PROJECT HAS APPROVED PM =================
  const hasApprovedPM = (projectId) => {
    return applications.some(
      (a) => a.project_id == projectId && a.status === "approved"
    );
  };

  // ================= DELETE PROJECT =================
  const deleteProject = (id) => {
    if (hasApprovedPM(id)) {
      alert("Cannot delete: PM already approved");
      return;
    }

    axios
      .post("http://127.0.0.1:5000/api/projects/delete", { id })
      .then((res) => {
        if (res.data.success) {
          alert("Project deleted");
          fetchProjects();
        } else {
          alert(res.data.message || "Delete failed");
        }
      })
      .catch(() => alert("Delete failed"));
  };

  // ================= APPROVE PM =================
  const approvePM = (app) => {
    axios
      .post("http://127.0.0.1:5000/api/applications/approve", {
        application_id: app.id,
        pm_id: app.pm_id,
        project_id: app.project_id
      })
      .then((res) => {
        if (res.data.success) {
          alert("PM Approved ✅");
          fetchApplications(selectedProject);
          fetchProjects();
        } else {
          alert(res.data.message || "Approval failed");
        }
      })
      .catch(() => alert("Approval failed"));
  };

  // ================= UI =================
  return (
    <div className="ps-dashboard">

      <div className="ps-header">
        <h1>Project Sponsor Dashboard</h1>
        <h3>Welcome {user.name}</h3>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="ps-subnav">
        <button onClick={() => setActiveTab("overview")}>Overview</button>
        <button onClick={() => setActiveTab("create")}>Create Project</button>
        <button onClick={() => setActiveTab("projects")}>Your Projects</button>
        <button onClick={() => setActiveTab("applications")}>Applications</button>
      </div>

      <hr />

      {/* ================= OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div>
          <h2>PS Dashboard</h2>
          <p>Create projects and approve PM applications</p>
        </div>
      )}

      {/* ================= CREATE ================= */}
      {activeTab === "create" && (
        <div>
          <h2>Create Project</h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <button onClick={createProject}>Create</button>
        </div>
      )}

      {/* ================= PROJECTS ================= */}
      {activeTab === "projects" && (
        <div>
          <h2>Your Projects</h2>

          {projects.map((p) => (
            <div key={p.id} className="ps-card">
              <h3>{p.title}</h3>
              <p>{p.description}</p>

              <button onClick={() => fetchApplications(p.id)}>
                View Applications
              </button>

              <button onClick={() => navigate(`/project/${p.id}`)}>
                Open Project
              </button>

              <button
                onClick={() => deleteProject(p.id)}
                disabled={hasApprovedPM(p.id)}
              >
                {hasApprovedPM(p.id)
                  ? "Cannot Delete (PM Approved)"
                  : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= APPLICATIONS ================= */}
      {activeTab === "applications" && (
        <div>
          <h2>PM Applications</h2>

          {!selectedProject ? (
            <p>Select a project first</p>
          ) : applications.length === 0 ? (
            <p>No applications</p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="ps-card">
                <h3>PM: {app.pm_name}</h3>
                <p>Status: {app.status}</p>
                <p>Applied: {app.created_at}</p>

                {app.status === "pending" && (
                  <button onClick={() => approvePM(app)}>
                    Approve PM
                  </button>
                )}

                {app.status === "approved" && (
                  <button disabled>Approved</button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PSDashboard;