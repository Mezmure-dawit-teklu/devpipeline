export default function TeamTab({ team }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Team Members</h2>

      {team.length === 0 ? (
        <p>No team members yet</p>
      ) : (
        team.map((t) => (
          <div key={t.id} style={{ border: "1px solid gray", padding: "10px" }}>
            <h3>{t.name}</h3>
            <p>{t.role}</p>
          </div>
        ))
      )}
    </div>
  );
}