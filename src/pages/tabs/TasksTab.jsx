import TaskForm from "./TaskForm";

export default function TasksTab({ team, fetchTasks, projectId }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Tasks</h2>

      <TaskForm
        team={team}
        fetchTasks={fetchTasks}
        projectId={projectId}
      />
    </div>
  );
}