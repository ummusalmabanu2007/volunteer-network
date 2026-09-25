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

function VolunteerDashboard() {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/events/`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const volunteerId = localStorage.getItem("volunteer_id");

    fetch(`${API_URL}/applications/`)
      .then((response) => response.json())
      .then((data) => {
        const myApplications = data.filter(
          (application) =>
            application.Volunteer_ID === Number(volunteerId)
        );

        setApplications(myApplications);
        setApplicationLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        setApplicationLoading(false);
      });
  }, []);

  const handleApply = async (eventId) => {
    const volunteerId = localStorage.getItem("volunteer_id");

    const applicationData = {
      Volunteer_ID: Number(volunteerId),
      Event_ID: eventId,
      Applied_Date: new Date().toISOString().split("T")[0],
      Status: "Pending",
    };

    try {
      const response = await fetch(
        `${API_URL}/applications/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Application submitted successfully!");

        setApplications((previousApplications) => [
          ...previousApplications,
          data,
        ]);
      } else {
        alert(data.detail || "Application failed");
      }
    } catch (error) {
      console.error("Application error:", error);
      alert("Backend connection failed!");
    }
  };

  const handleCancel = async (applicationId) => {
    const volunteerId = localStorage.getItem("volunteer_id");

    const confirmed = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/applications/${applicationId}/${volunteerId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Application cancelled successfully!");

        setApplications((previousApplications) =>
          previousApplications.filter(
            (application) =>
              application.Application_ID !== applicationId
          )
        );
      } else {
        alert(data.detail || "Cancellation failed");
      }
    } catch (error) {
      console.error("Cancel application error:", error);
      alert("Backend connection failed!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("volunteer_id");
    localStorage.removeItem("volunteer_name");
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
        <div style={{ fontSize: "45px" }}>🤝</div>

        <h1
          style={{
            margin: "5px 0",
            fontSize: "32px",
          }}
        >
          Volunteer Dashboard
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            fontSize: "17px",
          }}
        >
          Welcome, {localStorage.getItem("volunteer_name")}
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          padding: "30px 20px",
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "22px",
            marginBottom: "25px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#e8f1ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
            }}
          >
            👤
          </div>

          <div>
            <h2
              style={{
                margin: "0 0 5px",
                color: "#222",
              }}
            >
              Volunteer Profile
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777",
              }}
            >
              View and manage your volunteer activities
            </p>
          </div>
        </div>

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

            <h3
              style={{
                margin: "8px 0 3px",
                color: "#1769e0",
                fontSize: "28px",
              }}
            >
              {events.length}
            </h3>

            <p style={{ margin: 0, color: "#666" }}>
              Available Events
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
            <div style={{ fontSize: "32px" }}>📝</div>

            <h3
              style={{
                margin: "8px 0 3px",
                color: "#f39c12",
                fontSize: "28px",
              }}
            >
              {applications.length}
            </h3>

            <p style={{ margin: 0, color: "#666" }}>
              My Applications
            </p>
          </div>
        </div>

        {/* Available Events */}
        <h2
          style={{
            color: "#222",
            marginBottom: "18px",
          }}
        >
          📅 Available Events
        </h2>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            No events available.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "22px",
            }}
          >
            {events.map((event) => (
              <div
                key={event.id}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "25px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  border: "1px solid #edf1f7",
                }}
              >
                <div
                  style={{
                    fontSize: "45px",
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  {getEventIcon(event.Event_Name)}
                </div>

                <h3
                  style={{
                    color: "#1769e0",
                    textAlign: "center",
                    marginBottom: "18px",
                  }}
                >
                  {event.Event_Name}
                </h3>

                <p>
                  <strong>📅 Date:</strong> {event.Date}
                </p>

                <p>
                  <strong>📍 Location:</strong>{" "}
                  {event.Location}
                </p>

                <p>
                  <strong>📝 Description:</strong>{" "}
                  {event.Description}
                </p>

                <p>
                  <strong>🏢 Organization:</strong>{" "}
                  {event.Organization_ID}
                </p>

                <p>
                  <strong>👥 Maximum Volunteers:</strong>{" "}
                  {event.Maximum_Volunteers || "Not specified"}
                </p>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={() => handleApply(event.id)}
                    disabled={event.Status === "Full"}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      borderRadius: "10px",
                      background:
                        event.Status === "Full"
                          ? "#999"
                          : "#1769e0",
                      color: "white",
                      fontWeight: "700",
                      cursor:
                        event.Status === "Full"
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {event.Status === "Full"
                      ? "Event Full"
                      : "Apply Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Applications */}
        <h2
          style={{
            marginTop: "45px",
            marginBottom: "18px",
            color: "#222",
          }}
        >
          📝 My Applications
        </h2>

        {applicationLoading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              textAlign: "center",
              color: "#777",
            }}
          >
            No applications found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {applications.map((application) => (
              <div
                key={application.Application_ID}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "16px",
                  boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
                  borderLeft: "5px solid #f39c12",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    color: "#333",
                  }}
                >
                  📝 Application #{application.Application_ID}
                </h3>

                <p>
                  <strong>Event ID:</strong>{" "}
                  {application.Event_ID}
                </p>

                <p>
                  <strong>Applied Date:</strong>{" "}
                  {application.Applied_Date}
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
                          : "#f39c12",
                      fontWeight: "700",
                    }}
                  >
                    {application.Status}
                  </span>
                </p>

                {/* Cancel Application */}
                <button
                  onClick={() =>
                    handleCancel(application.Application_ID)
                  }
                  style={{
                    width: "100%",
                    padding: "11px",
                    marginTop: "12px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  ❌ Cancel Application
                </button>
              </div>
            ))}
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

export default VolunteerDashboard;