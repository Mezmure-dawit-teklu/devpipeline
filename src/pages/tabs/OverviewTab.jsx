export default function OverviewTab({ project }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Overview</h2>
      <p>Manage project members, portfolios, tasks, QA, and submissions.</p>

      <div style={{ border: "1px solid black", padding: "15px" }}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </div>
  );
}