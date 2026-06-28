export default function QATab({ qaResults }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>QA Results</h2>

      {qaResults.length === 0 ? (
        <p>No QA results yet</p>
      ) : (
        qaResults.map((q, i) => (
          <div key={i} style={{ border: "1px solid gray", padding: "10px" }}>
            <p>{JSON.stringify(q)}</p>
          </div>
        ))
      )}
    </div>
  );
}