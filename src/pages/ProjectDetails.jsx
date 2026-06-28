import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getUser } from "../auth";
import "../styles/ProjectDetails.css";

function TaskForm({ team, fetchTasks, projectId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [notifications, setNotifications] = useState([]);
  const createTask = () => {
    if (!title || !assignedTo) {
      return alert("Fill all fields");
    }

    axios
      .post("http://127.0.0.1:5000/api/tasks/create", {
        project_id: projectId,
        title,
        description,
        assigned_to: assignedTo,
      })
      .then((res) => {
        if (res.data.success) {
          alert("Task created ✔");

          setTitle("");
          setDescription("");
          setAssignedTo("");

          fetchTasks();
        } else {
          alert(res.data.message);
        }
      })
      .catch(() => alert("Error creating task"));
  };

  return (
    <div style={{ border: "1px solid black", padding: "15px" }}>
      <input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      <select
  value={assignedTo}
  onChange={(e) => setAssignedTo(e.target.value)}
>
  <option value="">Select Team Member</option>

  {team
    .filter((t) => t.status === "accepted")
    .map((t) => (
      <option key={t.id} value={t.user_id}>
        {t.user_name} ({t.role})
      </option>
    ))}
</select>

      <br />

      <button onClick={createTask}>Create Task</button>
    </div>
  );
}

function ProjectDetails() {
  const { id } = useParams();
  const user = getUser();
  const [qas, setQas] = useState([]);
  const [selectedQA, setSelectedQA] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [submissions, setSubmissions] = useState([]);
  const [qaResults, setQaResults] = useState([]);
  

  const [team, setTeam] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [roleTab, setRoleTab] = useState("overview");

  // ================= LOAD PROJECT =================
  useEffect(() => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:5000/api/projects")
      .then((res) => {
        const projects = res.data.projects || [];
        const found = projects.find((p) => String(p.id) === String(id));

        setProject(found || null);
        setLoading(false);
      })
      .catch(() => {
        setProject(null);
        setLoading(false);
      });

    fetchTeam();
    fetchTasks();
    fetchSubmissions();
    fetchQAResults();
    fetchNotifications();
    fetchPortfolios();
    fetchQAs();
 }, [id, user?.id]);

  // ================= FETCH PORTFOLIOS =================
  const fetchPortfolios = () => {
    axios
      .get("http://127.0.0.1:5000/api/portfolios")
      .then((res) => {
        setPortfolios(res.data.portfolios || []);
      })
      .catch(() => setPortfolios([]));
  };

  // ================= FIXED TEAM FETCH =================
  const fetchTeam = () => {
    axios
      .get(`http://127.0.0.1:5000/api/projects/team/${id}`)
      .then((res) => {
        if (res.data.success) {
          setTeam(res.data.team);
        } else {
          setTeam([]);
        }
      })
      .catch(() => setTeam([]));
  };

  // ================= FETCH TASKS =================
  const fetchTasks = () => {
    axios
      .get(`http://127.0.0.1:5000/api/tasks/project/${id}`)
      .then((res) => {
        setTasks(res.data.tasks || []);
      })
      .catch(() => setTasks([]));
  };

  // ================= FETCH SUBMISSIONS =================
  const fetchSubmissions = () => {
  axios
    .get(`http://127.0.0.1:5000/api/tasks/submissions/${id}`)
    .then((res) => {
      setSubmissions(res.data.submissions || []);
    })
    .catch(() => setSubmissions([]));
};

  // ================= FETCH QA =================
  const fetchQAResults = () => {
    axios
      .get(`http://127.0.0.1:5000/api/qa/${id}`)
      .then((res) => setQaResults(res.data || []))
      .catch(() => setQaResults([]));
  };
  
const fetchQAs = () => {
  axios
    .get("http://127.0.0.1:5000/api/qa/users")
    .then((res) => {
      setQas(res.data.qas || []);
    })
    .catch(() => setQas([]));
};
 // ================= FETCH NOTIFICATIONS =================
const fetchNotifications = () => {
  if (!user || !user.id) {
    setNotifications([]);
    return;
  }

  axios
    .get(`http://127.0.0.1:5000/api/notifications/${user.id}`)
    .then((res) => {
      setNotifications(
        res.data.notifications ||
        res.data.data ||
        res.data ||
        []
      );
    })
    .catch((err) => {
      console.error("Notification fetch error:", err);
      setNotifications([]);
    });
};

  // ================= ADD TO TEAM =================
  const addToProject = (p) => {
    axios
      .post("http://127.0.0.1:5000/api/projects/team/add", {
        project_id: id,
        portfolio_id: p.id,
      })
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message || "Added to team!");
          fetchTeam(); // 🔥 IMPORTANT REFRESH
        } else {
          alert(res.data.message);
        }
      })
      .catch(() => alert("Server error"));
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Project...</h2>;
  }

  if (!project) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Project Not Found</h2>
        <p>Project ID: {id}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Workspace</h1>

      <div style={{ border: "2px solid black", padding: "15px" }}>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
      </div>

      {/* NAV */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => setRoleTab("overview")}>Overview</button>
        <button onClick={() => setRoleTab("team")}>Team</button>
        <button onClick={() => setRoleTab("tasks")}>Tasks</button>
        <button onClick={() => setRoleTab("submissions")}>Submissions</button>
        <button onClick={() => setRoleTab("qa")}>QA</button>

        <button onClick={() => setRoleTab("portfolios")}>Portfolios</button>
      </div>

      {/* TASKS */}
      {roleTab === "tasks" && (
        <div>
          <h2>Tasks</h2>
          <TaskForm team={team} fetchTasks={fetchTasks} projectId={id} />

          {tasks.map((t) => (
            <div key={t.id}>
              <h3>{t.title}</h3>
              <p>{t.description}</p>
            </div>
          ))}
        </div>
      )}

     {/* TEAM */}
{roleTab === "team" && (
  <div>
    <h2>Team</h2>

    {team.length === 0 ? (
      <p>No team members yet</p>
    ) : (
      team.map((t) => (
        <div
          key={t.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{t.user_name}</h3>
          <p>{t.role}</p>
          <p><b>Status:</b> {t.status}</p>

          {/* DELETE ONLY IF PENDING */}
          {t.status === "pending" && (
            <button
              style={{ background: "red", color: "white" }}
              onClick={() => {
                axios
                  .post("http://127.0.0.1:5000/api/projects/team/delete", {
                    id: t.id,
                  })
                  .then((res) => {
                    alert(res.data.message || "Removed");
                    fetchTeam();
                  })
                  .catch(() => alert("Delete failed"));
              }}
            >
              Remove
            </button>
          )}
        </div>
      ))
    )}
  </div>
)}

      {roleTab === "submissions" && (
  <div>
    <h2>Submissions</h2>

    {submissions.length === 0 ? (
      <p>No submissions yet</p>
    ) : (
      submissions.map((s) => (
        <div
          key={s.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>
  {s.task_title} 
</h3>

<p>
  Submitted by: <b>User {s.user_id}</b> ({s.user_role})
</p>
          <a
            href={`http://127.0.0.1:5000/${s.file_path}`}
            target="_blank"
            rel="noreferrer"
          >
            View File
          </a>

          <p>
            {new Date(s.created_at).toLocaleString()}
          </p>
        </div>
      ))
    )}
  </div>
)}
    {roleTab === "qa" && (
  <div>
    <h2>QA Management</h2>

    {/* =========================================================
        1. ASSIGN QA TO PROJECT (YOUR ORIGINAL CODE - KEPT)
    ========================================================= */}
    <h3>Available QA Users</h3>

    {qas.length === 0 ? (
      <p>No QA users found</p>
    ) : (
      qas.map((qa) => (
        <div
          key={qa.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>{qa.name}</h4>
          <p>{qa.email}</p>

          <button onClick={() => setSelectedQA(qa)}>
            Select QA
          </button>
        </div>
      ))
    )}

    {selectedQA && (
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "2px solid green",
        }}
      >
        <h3>Selected QA</h3>

        <p>
          <b>Name:</b> {selectedQA.name}
        </p>
        <p>
          <b>Email:</b> {selectedQA.email}
        </p>

        <button
          style={{ background: "blue", color: "white", padding: "10px" }}
          onClick={() => {
            axios
              .post("http://127.0.0.1:5000/api/projects/team/add", {
                project_id: Number(id),
                qa_id: selectedQA.id,
              })
              .then((res) => {
                if (res.data.success) {
                  alert(res.data.message || "QA added to team");
                  setSelectedQA(null);
                  fetchTeam();
                } else {
                  alert(res.data.message || "Already exists or failed");
                }
              })
              .catch((err) => {
                console.error("QA add error:", err);
                alert("Server error while adding QA");
              });
          }}
        >
          Add QA to Team
        </button>
      </div>
    )}

    <hr />

    {/* =========================================================
        2. SUBMISSION → QA QUEUE (NEW FEATURE)
    ========================================================= */}
    <h3>Send Submissions to QA Queue</h3>

    {submissions.length === 0 ? (
      <p>No submissions available</p>
    ) : (
      submissions.map((s) => (
        <div
          key={s.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>{s.task_title}</h4>

          <p>
            Submitted by: <b>User {s.user_id}</b> ({s.user_role})
          </p>

          <a
            href={`http://127.0.0.1:5000/${s.file_path}`}
            target="_blank"
            rel="noreferrer"
          >
            View File
          </a>

          <p>{new Date(s.created_at).toLocaleString()}</p>

          {/* ================= SELECT QA FOR THIS SUBMISSION ================= */}
          <button onClick={() => setSelectedSubmission(s)}>
            Select Submission
          </button>
        </div>
      ))
    )}

    {/* =========================================================
        3. SEND TO QA QUEUE ACTION BOX
    ========================================================= */}
    {selectedSubmission && (
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "2px solid blue",
        }}
      >
        <h3>Selected Submission</h3>

        <p>
          <b>Task:</b> {selectedSubmission.task_title}
        </p>

        <a
          href={`http://127.0.0.1:5000/${selectedSubmission.file_path}`}
          target="_blank"
          rel="noreferrer"
        >
          View File
        </a>

        <hr />

        <h3>Select QA to Send</h3>

        {team
          .filter((t) => t.status === "accepted")
          .map((t) => (
            <button
              key={t.id}
              style={{
                margin: "5px",
                background:
                  selectedQA?.id === t.user_id,
                color: "white",
                padding: "8px",
              }}
              onClick={() => setSelectedQA(t)}
            >
              {t.user_name} ({t.role})
            </button>
          ))}

        {/* ================= FINAL SEND BUTTON ================= */}
        {selectedQA && (
          <div style={{ marginTop: "10px" }}>
            <p>
              Send to: <b>{selectedQA.user_name}</b>
            </p>

            <button
              style={{
                background: "purple",
                color: "white",
                padding: "10px",
              }}
              onClick={() => {
                axios
                  .post("http://127.0.0.1:5000/api/qa/send", {
                    submission_id: selectedSubmission.id,
                    project_id: id,
                    pm_id: user.id,
                    qa_id: selectedQA.id,
                  })
                  .then((res) => {
                    alert(res.data.message);

                    setSelectedQA(null);
                    setSelectedSubmission(null);
                  })
                  .catch(() => alert("Failed to send to QA"));
              }}
            >
              Send to QA Queue
            </button>
          </div>
        )}
      </div>
    )}
  </div>
)}

      {/* PORTFOLIOS */}
      {roleTab === "portfolios" && (
        <div>
          <h2>All Uploaded Portfolios</h2>

          {portfolios.length === 0 ? (
            <p>No portfolios uploaded</p>
          ) : (
            portfolios.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid gray",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <h3>{p.title}</h3>
                <p><b>Role:</b> {p.role}</p>
                <p><b>User:</b> {p.user_name}</p>

                <a
                  href={`http://127.0.0.1:5000${p.link}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Portfolio
                </a>

                <br />

                <button onClick={() => addToProject(p)}>
                  Add to Team
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;