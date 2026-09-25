import { useEffect, useState } from "react";

const API_URL =
  "https://volunteer-network-production-5388.up.railway.app";

function getEventIcon(eventName) {
  const name = eventName.toLowerCase();

  if (name.includes("tree") || name.includes("plant")) return "🌳";
  if (name.includes("clean")) return "🧹";
  if (name.includes("blood")) return "🩸";
  if (name.includes("food")) return "🍱";
  if (name.includes("beach")) return "🏖️";
  if (name.includes("medical") || name.includes("health")) return "🏥";
  if (name.includes("sports")) return "⚽";
  if (name.includes("disaster") || name.includes("relief")) return "🚑";

  return "🤝";
}

function AdminDashboard() {
  const [volunteers, setVolunteers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [cancelledApplications, setCancelledApplications] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/volunteers/`)
      .then((response) => response.json())
      .then((data) => setVolunteers(data))
      .catch((error) =>
        console.error("Volunteer error:", error)
      );

    fetch(`${API_URL}/organizations/`)
      .then((response) => response.json())
      .then((data) => setOrganizations(data))
      .catch((error) =>
        console.error("Organization error:", error)
      );

    fetch(`${API_URL}/events/`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) =>
        console.error("Event error:", error)
      );

    fetch(`${API_URL}/applications/`)
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) =>
        console.error("Application error:", error)
      );

    // Get cancelled applications
    fetch(`${API_URL}/applications/cancelled`)
      .then((response) => response.json())
      .then((data) => setCancelledApplications(data))
      .catch((error) =>
        console.error("Cancelled application error:", error)
      );
  }, []);

  // Event status counts
  const availableEvents = events.filter(
    (event) => event.Status === "Available"
  ).length;

  const fullEvents = events.filter(
    (event) => event.Status === "Full"
  ).length;

  const completedEvents = events.filter(
    (event) => event.Status === "Completed"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_name");
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8ff",
        paddingBottom: "40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1769e0, #4f8df7)",
          color: "white",
          padding: "35px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "45px" }}>🛡️</div>

        <h1
          style={{
            margin: "5px 0",
            fontSize: "32px",
          }}
        >
          Admin Dashboard
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            fontSize: "17px",
          }}
        >
          Welcome, {localStorage.getItem("admin_name")}
        </p>
      </div>

      <div
        style={{
          maxWidth: "1150px",
          margin: "auto",
          padding: "30px 20px",
        }}
      >
        {/* Dashboard Overview */}
        <h2
          style={{
            color: "#222",
            marginBottom: "20px",
          }}
        >
          📊 Dashboard Overview
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
            marginBottom: "40px",
          }}
        >
          {/* Volunteers */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "35px" }}>👤</div>

            <h2
              style={{
                color: "#1769e0",
                margin: "8px 0",
              }}
            >
              {volunteers.length}
            </h2>

            <p style={{ margin: 0, color: "#666" }}>
              Total Volunteers
            </p>
          </div>

          {/* Organizations */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "35px" }}>🏢</div>

            <h2
              style={{
                color: "#198754",
                margin: "8px 0",
              }}
            >
              {organizations.length}
            </h2>

            <p style={{ margin: 0, color: "#666" }}>
              Total Organizations
            </p>
          </div>

          {/* Total Events */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "35px" }}>📅</div>

            <h2
              style={{
                color: "#f39c12",
                margin: "8px 0",
              }}
            >
              {events.length}
            </h2>

            <p style={{ margin: 0, color: "#666" }}>
              Total Events
            </p>
          </div>

          {/* Applications */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "35px" }}>📝</div>

            <h2
              style={{
                color: "#9b59b6",
                margin: "8px 0",
              }}
            >
              {applications.length}
            </h2>

            <p style={{ margin: 0, color: "#666" }}>
              Total Applications
            </p>
          </div>

          {/* Available Events */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "35px" }}>🟢</div>

            <h2
              style={{
                color: "#198754",
                margin: "8px 0",
              }}
            >
              {availableEvents}
            </h2>

            <p style={{ margin: 0, color: "#666" }}>
              Available Events
            </p>
          </div>

          {/* Full Events */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "35px" }}>🔴</div>

            <h2
              style={{
                color: "#dc3545",
                margin: "8px 0",
              }}
            >
              {fullEvents}
            </h2>

            <p style={{ margin: 0, color: "#666" }}>
              Full Events
            </p>
          </div>

          {/* Completed Events */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "35px" }}>⚪</div>

            <h2
              style={{
                color: "#6c757d",
                margin: "8px 0",
              }}
            >
              {completedEvents}
            </h2>

            <p style={{ margin: 0, color: "#666" }}>
              Completed Events
            </p>
          </div>
        </div>

        {/* Volunteers */}
        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            marginBottom: "25px",
            boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h2>👤 Volunteers</h2>

          {volunteers.length === 0 ? (
            <p>No volunteers found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
              }}
            >
              {volunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  style={{
                    border: "1px solid #e5eaf0",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    👤 {volunteer.name}
                  </h3>

                  <p>
                    <strong>ID:</strong> {volunteer.id}
                  </p>

                  <p>
                    <strong>📧 Email:</strong>{" "}
                    {volunteer.email}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Organizations */}
        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            marginBottom: "25px",
            boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h2>🏢 Organizations</h2>

          {organizations.length === 0 ? (
            <p>No organizations found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
              }}
            >
              {organizations.map((organization) => (
                <div
                  key={organization.Organization_ID}
                  style={{
                    border: "1px solid #e5eaf0",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    🏢 {organization.Name}
                  </h3>

                  <p>
                    <strong>ID:</strong>{" "}
                    {organization.Organization_ID}
                  </p>

                  <p>
                    <strong>📧 Email:</strong>{" "}
                    {organization.Email}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Events */}
        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            marginBottom: "25px",
            boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h2>📅 Events</h2>

          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "18px",
              }}
            >
              {events.map((event) => (
                <div
                  key={event.id}
                  style={{
                    border: "1px solid #e5eaf0",
                    borderRadius: "15px",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "42px",
                    }}
                  >
                    {getEventIcon(event.Event_Name)}
                  </div>

                  <h3
                    style={{
                      textAlign: "center",
                      color: "#1769e0",
                    }}
                  >
                    {event.Event_Name}
                  </h3>

                  <p>
                    <strong>📅 Date:</strong>{" "}
                    {event.Date}
                  </p>

                  <p>
                    <strong>📍 Location:</strong>{" "}
                    {event.Location}
                  </p>

                  <p>
                    <strong>🆔 Event ID:</strong>{" "}
                    {event.id}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          event.Status === "Full"
                            ? "#dc3545"
                            : event.Status === "Completed"
                            ? "#6c757d"
                            : "#198754",
                        fontWeight: "700",
                      }}
                    >
                      {event.Status || "Available"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Applications */}
        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            marginBottom: "30px",
            boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h2>📝 Applications</h2>

          {applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
              }}
            >
              {applications.map((application) => (
                <div
                  key={application.Application_ID}
                  style={{
                    border: "1px solid #e5eaf0",
                    borderRadius: "12px",
                    padding: "18px",
                    borderLeft: "5px solid #f39c12",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    📝 Application #
                    {application.Application_ID}
                  </h3>

                  <p>
                    <strong>Volunteer ID:</strong>{" "}
                    {application.Volunteer_ID}
                  </p>

                  <p>
                    <strong>Event ID:</strong>{" "}
                    {application.Event_ID}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          application.Status === "Approved"
                            ? "#198754"
                            : application.Status === "Rejected"
                            ? "#dc3545"
                            : application.Status === "Cancelled"
                            ? "#dc3545"
                            : "#f39c12",
                        fontWeight: "700",
                      }}
                    >
                      {application.Status}
                    </span>
                  </p>

                  <p>
                    <strong>Applied Date:</strong>{" "}
                    {application.Applied_Date || "-"}
                  </p>

                  {application.Status === "Cancelled" && (
                    <p>
                      <strong>Cancelled Date:</strong>{" "}
                      {application.Cancelled_Date || "-"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cancelled Applications */}
        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            marginBottom: "30px",
            boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h2>❌ Cancelled Applications</h2>

          {cancelledApplications.length === 0 ? (
            <p>No cancelled applications found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "15px",
              }}
            >
              {cancelledApplications.map((application) => (
                <div
                  key={application.Application_ID}
                  style={{
                    border: "1px solid #e5eaf0",
                    borderRadius: "12px",
                    padding: "18px",
                    borderLeft: "5px solid #dc3545",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    ❌ Application #
                    {application.Application_ID}
                  </h3>

                  <p>
                    <strong>Volunteer ID:</strong>{" "}
                    {application.Volunteer_ID}
                  </p>

                  <p>
                    <strong>Event ID:</strong>{" "}
                    {application.Event_ID}
                  </p>

                  <p>
                    <strong>Applied Date:</strong>{" "}
                    {application.Applied_Date || "-"}
                  </p>

                  <p>
                    <strong>Cancelled Date:</strong>{" "}
                    {application.Cancelled_Date || "-"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: "#dc3545",
                        fontWeight: "700",
                      }}
                    >
                      {application.Status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Logout */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleLogout}
            style={{
              padding: "12px 35px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;