import { useEffect, useState } from "react";
import axios from "axios";
import { getUser, logout } from "../auth";
import { useNavigate } from "react-router-dom";
import AccessDenied from "../pages/AccessDenied";
import "../styles/QADashboard.css";

import qaImage from "../assets/download.webp";
import qaImage2 from "../assets/OIP.webp";

function QADashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const API = "http://127.0.0.1:5000/api";

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [comments, setComments] = useState({});
  const [loadingTask, setLoadingTask] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(null);

  const [tab, setTab] = useState("overview");

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/access-denied", { replace: true });
  };

  // ================= ACCESS CONTROL =================
  if (!user || user.role !== "qa") {
    return <AccessDenied />;
  }

  // ================= FETCH PROJECTS =================
  const fetchQAProjects = async () => {
    try {
      const res = await axios.get(
        `${API}/projects/team/accepted/qa/${user.id}`
      );
      setProjects(res.data.projects || []);
    } catch {
      setProjects([]);
    }
  };

  // ================= FETCH TASKS =================
  const fetchQAData = async () => {
    try {
      const res = await axios.get(`${API}/qa/dashboard/${user.id}`);
      setTasks(res.data.tasks || []);
    } catch {
      setTasks([]);
    }
  };

  // ================= FETCH INVITATIONS =================
  const fetchInvitations = async () => {
    try {
      const res = await axios.get(`${API}/team/invitations/${user.id}`);
      setInvitations(res.data.invitations || []);
    } catch {
      setInvitations([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchQAProjects();
      fetchQAData();
      fetchInvitations();
    }
  }, [user?.id]);

  const getProjectTasks = (projectId) => {
    return tasks.filter((t) => t.project_id === projectId);
  };

  // ================= QA ACTION =================
  const handleQAAction = async (taskId, status) => {
    setLoadingTask(taskId);

    try {
      await axios.post(`${API}/qa/review`, {
        task_id: taskId,
        qa_id: user.id,
        status,
        comment: comments[taskId] || "",
      });

      setComments((prev) => ({ ...prev, [taskId]: "" }));
      await fetchQAData();
    } catch {
      alert("QA action failed");
    } finally {
      setLoadingTask(null);
    }
  };

  // ================= ACCEPT INVITE =================
  const handleAcceptInvite = async (id) => {
    setLoadingInvite(id);

    try {
      const res = await axios.post(`${API}/team/accept`, { id });

      if (res.data.success) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
        await fetchQAProjects();
      }
    } catch {
      alert("Failed to accept invite");
    } finally {
      setLoadingInvite(null);
    }
  };

  // ================= REJECT INVITE =================
  const handleRejectInvite = async (id) => {
    setLoadingInvite(id);

    try {
      const res = await axios.post(`${API}/team/reject`, { id });

      if (res.data.success) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      }
    } catch {
      alert("Failed to reject invite");
    } finally {
      setLoadingInvite(null);
    }
  };

  return (
    <div className="qa-dashboard">

      {/* HERO */}
      <section className="qa-hero">
        <h1>QA Quality Control Center</h1>
        <p className="nat">
          This dashboard ensures system stability, correctness, and reliability before production release.
        </p>

        <div className="qa-hero-images">
          <img src={qaImage} alt="QA 1" className="qa-hero-image" />
          <img src={qaImage2} alt="QA 2" className="qa-hero-image" />
        </div>
      </section>

      {/* HEADER */}
      <div className="qa-header">
        <h1>Quality Assurance</h1>
        <h3>Welcome {user.name}</h3>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* NAV */}
      <div className="qa-subnav">
        <button onClick={() => setTab("overview")}>Overview</button>
        <button onClick={() => setTab("invitations")}>
          Invitations ({invitations.length})
        </button>
        <button onClick={() => setTab("projects")}>Projects</button>
      </div>

      <hr />

      {/* ================= OVERVIEW ================= */}
      {tab === "overview" && (
        <section className="qa-overview">
          <h2>Overview</h2>
          <p>✔ Review developer tasks</p>
          <p>✔ Approve, reject, or request fixes</p>
          <p>✔ Send validated results to PM</p>
        </section>
      )}

      {/* ================= INVITATIONS ================= */}
      {tab === "invitations" && (
        <section className="qa-invitations">
          <h2>Team Invitations</h2>

          {invitations.length === 0 ? (
            <p>No invitations</p>
          ) : (
            invitations.map((inv) => (
              <div key={inv.id} className="qa-task">
                <h3>{inv.project_title}</h3>
                <p>Role: {inv.role}</p>
                <p>Type: {inv.invite_type}</p>

                <button
                  disabled={loadingInvite === inv.id}
                  onClick={() => handleAcceptInvite(inv.id)}
                >
                  Accept ✔
                </button>

                <button
                  disabled={loadingInvite === inv.id}
                  onClick={() => handleRejectInvite(inv.id)}
                >
                  Reject ❌
                </button>
              </div>
            ))
          )}
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      {tab === "projects" && (
        <div className="qa-workspace-container">

          {/* LEFT */}
          <div className="qa-workspace-column column-left">
            <h2>Projects</h2>

            {projects.length === 0 ? (
              <p>No projects assigned</p>
            ) : (
              projects.map((p) => (
                <div
                  key={p.project_id}
                  className={`qa-project ${
                    selectedProject === p.project_id ? "active" : ""
                  }`}
                  onClick={() => setSelectedProject(p.project_id)}
                >
                  <h3>{p.title}</h3>
                </div>
              ))
            )}
          </div>

          {/* RIGHT */}
          <div className="qa-workspace-column column-right">
            <h2>Task Submissions</h2>

            {!selectedProject ? (
              <p>Select a project</p>
            ) : getProjectTasks(selectedProject).length === 0 ? (
              <p>No tasks</p>
            ) : (
              getProjectTasks(selectedProject).map((t) => (
                <div key={t.id} className="qa-task">
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>

                  {t.file_link ? (
                    <a
                      href={`http://127.0.0.1:5000${t.file_link}`}
                      target="_blank"
                    >
                      View Submission
                    </a>
                  ) : (
                    <p>No submission</p>
                  )}

                  <textarea
                    placeholder="QA comment..."
                    value={comments[t.id] || ""}
                    onChange={(e) =>
                      setComments({
                        ...comments,
                        [t.id]: e.target.value,
                      })
                    }
                  />

                  <button onClick={() => handleQAAction(t.id, "approved")}>
                    Approve
                  </button>

                  <button onClick={() => handleQAAction(t.id, "rejected")}>
                    Reject
                  </button>

                  <button onClick={() => handleQAAction(t.id, "needs_fix")}>
                    Needs Fix
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default QADashboard;