import { useState } from "react";
import axios from "axios";

export default function TaskForm({ team, fetchTasks, projectId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const createTask = () => {
    if (!title || !assignedTo) return alert("Fill all fields");

    axios
      .post("http://localhost/react_backend/create_task.php", {
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
      });
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">Select Team Member</option>
        {team.map((t) => (
          <option key={t.id} value={t.user_id}>
            {t.name}
          </option>
        ))}
      </select>

      <button onClick={createTask}>Create Task</button>
    </div>
  );
}