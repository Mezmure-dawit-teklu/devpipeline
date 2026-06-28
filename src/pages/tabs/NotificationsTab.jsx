export default function NotificationsTab({ notifications }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n, i) => (
          <div key={i} style={{ border: "1px solid gray", padding: "10px" }}>
            <p>{JSON.stringify(n)}</p>
          </div>
        ))
      )}
    </div>
  );
}