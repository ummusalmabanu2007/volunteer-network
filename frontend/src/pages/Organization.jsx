import { useEffect, useState } from "react";
import Event from "./Event";

   const API_URL = "https://volunteer-network-production-5388.up.railway.app";

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

function Organization() {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);

  const loadData = async () => {
    try {
      const eventResponse = await fetch(`${API_URL}/events/`);
      const eventData = await eventResponse.json();

      setEvents(eventData);

      const applicationResponse = await fetch(
        `${API_URL}/applications/`
      );

      const applicationData = await applicationResponse.json();

      setApplications(applicationData);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAppliedCount = (eventId) => {
    return applications.filter(
      (application) => application.Event_ID === eventId
    ).length;
  };

  const handleUpdateMaximum = async (event) => {
    const newMaximum = prompt(
      "Enter Maximum Volunteers:",
      event.Maximum_Volunteers || ""
    );

    if (!newMaximum) {
      return;
    }

    const maximum = Number(newMaximum);

    if (maximum < 1) {
      alert("Maximum Volunteers must be at least 1");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/events/${event.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Event_Name: event.Event_Name,
            Date: event.Date,
            Location: event.Location,
            Description: event.Description,
            Organization_ID: event.Organization_ID,
            Maximum_Volunteers: maximum,
            Status: event.Status,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Maximum Volunteers updated successfully!");
        loadData();
      } else {
        alert(data.detail || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Backend connection failed!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("organization_id");
    localStorage.removeItem("organization_name");
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
        <div style={{ fontSize: "45px" }}>🏢</div>

        <h1 style={{ margin: "5px 0", fontSize: "32px" }}>
          Organization Dashboard
        </h1>

        <p style={{ margin: "8px 0 0", fontSize: "17px" }}>
          Welcome, {localStorage.getItem("organization_name")}
        </p>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          padding: "30px 20px",
        }}
      >
        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "22px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "32px" }}>📅</div>

            <h2
              style={{
                color: "#1769e0",
                margin: "8px 0 3px",
              }}
            >
              {events.length}
            </h2>

            <p style={{ margin: 0, color: "#666" }}>
              Total Events
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "22px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "32px" }}>👥</div>

            <h2
              style={{
                color: "#198754",
                margin: "8px 0 3px",
              }}
            >
              {applications.length}
            </h2>

            <p style={{ margin: 0, color: "#666" }}>
              Total Applications
            </p>
          </div>
        </div>

        {/* Create Event */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "25px",
            marginBottom: "35px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ color: "#222", marginTop: 0 }}>
            ➕ Create New Event
          </h2>

          <Event />
        </div>

        {/* Events */}
        <h2 style={{ marginBottom: "20px" }}>
          📅 My Created Events
        </h2>

        {events.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            No events created yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "22px",
            }}
          >
            {events.map((event) => {
              const appliedCount = getAppliedCount(event.id);
              const maximum = event.Maximum_Volunteers || 0;

              const availableSeats =
                maximum > appliedCount
                  ? maximum - appliedCount
                  : 0;

              const isCompleted =
                event.Status === "Completed";

              const isFull =
                !isCompleted && availableSeats === 0;

              return (
                <div
                  key={event.id}
                  style={{
                    background: "white",
                    borderRadius: "18px",
                    padding: "25px",
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.08)",
                    border: "1px solid #edf1f7",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "48px",
                      marginBottom: "8px",
                    }}
                  >
                    {getEventIcon(event.Event_Name)}
                  </div>

                  <h3
                    style={{
                      textAlign: "center",
                      color: "#1769e0",
                      marginBottom: "20px",
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
                    <strong>📝 Description:</strong>{" "}
                    {event.Description}
                  </p>

                  <hr />

                  <p>
                    <strong>👥 Applied Volunteers:</strong>{" "}
                    {appliedCount}
                  </p>

                  <p>
                    <strong>👥 Maximum Volunteers:</strong>{" "}
                    {maximum}
                  </p>

                  <p>
                    <strong>🪑 Available Seats:</strong>{" "}
                    {availableSeats}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: isCompleted
                          ? "#6c757d"
                          : isFull
                          ? "#dc3545"
                          : "#198754",
                        fontWeight: "700",
                      }}
                    >
                      {isCompleted
                        ? "Completed"
                        : isFull
                        ? "Full"
                        : "Available"}
                    </span>
                  </p>

                  {!isCompleted && (
                    <button
                      onClick={() =>
                        handleUpdateMaximum(event)
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                        background: "#1769e0",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Change Maximum Volunteers
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Logout */}
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >
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

export default Organization;