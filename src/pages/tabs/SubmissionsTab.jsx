export default function SubmissionsTab({
  submissions,
  isAlreadyInTeam,
  addToProject,
}) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Portfolio Submissions</h2>

      {submissions.length === 0 ? (
        <p>No portfolio uploaded yet</p>
      ) : (
        submissions.map((s) => (
          <div key={s.id} style={{ border: "1px solid gray", padding: "10px" }}>
            <h3>{s.title}</h3>
            <p>{s.name}</p>
            <p>{s.role}</p>

            <a
              href={`http://localhost/react_backend${s.link}`}
              target="_blank"
              rel="noreferrer"
            >
              View Portfolio
            </a>

            <br />

            {isAlreadyInTeam(s) ? (
              <button disabled>Already in Team</button>
            ) : (
              <button onClick={() => addToProject(s)}>
                Add to Project Team
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}