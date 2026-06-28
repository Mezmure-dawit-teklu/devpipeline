import { useEffect, useState } from "react";
import axios from "axios";
import { getUser, logout } from "../auth";
import { useNavigate } from "react-router-dom";
import "../styles/BDDashboard.css";

function BDDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const API = "http://127.0.0.1:5000/api";

  // ================= STATES =================
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");

  const [portfolios, setPortfolios] = useState([]);
  const [selections, setSelections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const [taskFiles, setTaskFiles] = useState({});
  const [tab, setTab] = useState("overview");
  const [actionLoading, setActionLoading] = useState(null);

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  // ================= ACCESS CONTROL =================
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Access Denied ❌</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  if (user.role !== "bd") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Access Denied ❌ (BD only)</h2>
        <button onClick={() => navigate("/dashboard")}>Go Dashboard</button>
      </div>
    );
  }

  // ================= FETCH ACCEPTED PROJECTS =================
  const fetchBDData = async () => {
    try {
      const res = await axios.get(
        `${API}/projects/team/accepted/${user.id}`
      );
      setSelections(res.data?.projects || []);
      return res.data?.projects || [];
    } catch {
      setSelections([]);
      return [];
    }
  };

  // ================= FETCH TASKS (FIXED) =================
  const fetchTasks = async (projects) => {
    try {
      let allTasks = [];

      for (const p of projects) {
        const res = await axios.get(
          `${API}/tasks/project/${p.project_id}`
        );

        if (res.data?.success) {
          allTasks = [...allTasks, ...res.data.tasks];
        }
      }

      setTasks(allTasks);
    } catch {
      setTasks([]);
    }
  };

  const fetchPortfolios = async () => {
    try {
      const res = await axios.get(`${API}/portfolios`);
      setPortfolios(res.data?.portfolios || []);
    } catch {
      setPortfolios([]);
    }
  };

  const fetchInvitations = async () => {
    try {
      const res = await axios.get(
        `${API}/team/invitations/${user.id}`
      );
      setInvitations(res.data?.invitations || []);
    } catch {
      setInvitations([]);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      const projects = await fetchBDData();
      await fetchPortfolios();
      await fetchInvitations();
      await fetchTasks(projects);
    };

    load();

    const interval = setInterval(load, 8000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // ================= TASK FILE =================
  const handleTaskFile = (taskId, file) => {
    setTaskFiles((prev) => ({
      ...prev,
      [taskId]: file,
    }));
  };

  const submitTask = async (taskId) => {
    const file = taskFiles[taskId];
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("task_id", taskId);
    formData.append("user_id", user.id);

    try {
      const res = await axios.post(
        `${API}/tasks/submit`,
        formData
      );

      if (res.data.success) {
        alert("Submitted ✔");
      }
    } catch {
      alert("Upload failed");
    }
  };

  // ================= PORTFOLIO =================
  const uploadPortfolio = async () => {
    if (!title || !file || !role) {
      return alert("Fill all fields");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);
    formData.append("title", title);
    formData.append("role", role);

    try {
      const res = await axios.post(
        `${API}/upload_portfolio`,
        formData
      );

      if (res.data.success) {
        alert("Success ✔");
        setTitle("");
        setFile(null);
        setRole("");
        fetchPortfolios();
      }
    } catch {
      alert("Upload failed");
    }
  };

  const deletePortfolio = async (id) => {
    if (!window.confirm("Delete portfolio?")) return;

    try {
      const res = await axios.delete(
        `${API}/delete_portfolio?id=${id}`
      );

      if (res.data.success) {
        fetchPortfolios();
      }
    } catch {
      alert("Delete failed");
    }
  };

  // ================= ACCEPT =================
  const handleAccept = async (id) => {
    try {
      setActionLoading(id);

      const res = await axios.post(`${API}/team/accept`, {
        id,
      });

      if (res.data.success) {
        alert("Accepted ✔");

        const projects = await fetchBDData();
        await fetchTasks(projects);
        await fetchInvitations();

        setTab("projects");
      }
    } catch {
      alert("Server error");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= REJECT =================
  const handleReject = async (id) => {
    try {
      setActionLoading(id);

      const res = await axios.post(
        `${API}/projects/team/reject`,
        { id }
      );

      if (res.data.success) {
        alert("Rejected ❌");
        fetchInvitations();
      }
    } catch {
      alert("Server error");
    } finally {
      setActionLoading(null);
    }
  };

  const myPortfolio = portfolios.find(
    (p) => String(p.user_id) === String(user.id)
  );

  // ================= UI =================
  return (
    <div className="bd-container">
      <h1>Backend Developer</h1>
      <h3>Welcome {user.name}</h3>

      <hr />

      {/* NAV */}
      <div className="fd-topbar">
        <div className="fd-subnav">
          <button onClick={() => setTab("overview")}>
            Overview
          </button>
          <button onClick={() => setTab("projects")}>
            Projects ({selections.length})
          </button>
          <button onClick={() => setTab("portfolio")}>
            Portfolio
          </button>
          <button onClick={() => setTab("invitations")}>
            Invitations 🔔 ({invitations.length})
          </button>
        </div>

        <button className="fd-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="fd-overview">
          <h2>Backend Developer Overview</h2>
          <p>Build APIs, databases, and backend systems.</p>
        </div>
      )}

      {/* INVITATIONS */}
      {tab === "invitations" && (
        <div>
          <h2>Team Invitations 🔔</h2>

          {invitations.length === 0 ? (
            <p>No invitations</p>
          ) : (
            invitations.map((inv) => (
              <div key={inv.id} className="fd-task-card">
                <h3>{inv.project_title}</h3>
                <p>{inv.role}</p>

                <button
                  disabled={actionLoading === inv.id}
                  onClick={() => handleAccept(inv.id)}
                >
                  Accept ✔
                </button>

                <button
                  disabled={actionLoading === inv.id}
                  onClick={() => handleReject(inv.id)}
                >
                  Reject ❌
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* PROJECTS */}
      {tab === "projects" && (
        <div>
          <h2>Your Projects</h2>

          {selections.length === 0 ? (
            <p>No project assigned yet</p>
          ) : (
            selections.map((p) => (
              <div
                key={p.project_id}
                className="fd-project-card"
              >
                <h3>{p.title}</h3>

                {tasks
                  .filter(
                    (t) => t.project_id === p.project_id
                  )
                  .map((t) => (
                    <div
                      key={t.id}
                      className="fd-task-card"
                    >
                      <b>{t.title}</b>
                      <p>{t.description}</p>

                      <input
                        type="file"
                        onChange={(e) =>
                          handleTaskFile(
                            t.id,
                            e.target.files[0]
                          )
                        }
                      />

                      <button
                        onClick={() => submitTask(t.id)}
                      >
                        Submit
                      </button>
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>
      )}

      {/* PORTFOLIO */}
      {tab === "portfolio" && (
        <div>
          <h2>My Portfolio</h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={uploadPortfolio}>
            {myPortfolio ? "Resubmit" : "Upload"}
          </button>

          {portfolios.map((p) => (
            <div key={p.id} className="fd-task-card">
              <h3>{p.title}</h3>
              <p>{p.role}</p>

              <button
                onClick={() => deletePortfolio(p.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BDDashboard;