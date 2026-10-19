
import { useEffect, useState, useCallback } from "react";

const API_URL = "https://volunteer-network-r7mr.onrender.com";

function getEventIcon(eventName = "") {
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
  const [busyEvent, setBusyEvent] = useState(null);
  const [busyApplication, setBusyApplication] = useState(null);

  const volunteerId = localStorage.getItem("volunteer_id");

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/events/`);
      if (!response.ok) throw new Error("Unable to load events");

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Events load aagala. Backend URL check pannunga.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      if (!volunteerId) {
        setApplications([]);
        return;
      }

      const response = await fetch(`${API_URL}/applications/`);
      if (!response.ok) throw new Error("Unable to load applications");

      const data = await response.json();

      const myApplications = (Array.isArray(data) ? data : []).filter(
        (application) =>
          Number(application.Volunteer_ID) === Number(volunteerId) &&
          application.Status !== "Cancelled"
      );

      setApplications(myApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Applications load aagala. Backend connection check pannunga.");
    } finally {
      setApplicationLoading(false);
    }
  }, [volunteerId]);

  const refreshDashboard = useCallback(async () => {
    await Promise.all([fetchEvents(), fetchApplications()]);
  }, [fetchEvents, fetchApplications]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const handleApply = async (eventId) => {
    if (!volunteerId) {
      alert("Please login again.");
      return;
    }

    setBusyEvent(eventId);

    const applicationData = {
      Volunteer_ID: Number(volunteerId),
      Event_ID: eventId,
      Applied_Date: new Date().toISOString().split("T")[0],
      Status: "Pending",
    };

    try {
      const response = await fetch(`${API_URL}/applications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Application failed");
        await refreshDashboard();
        return;
      }

      alert("Application submitted successfully!");
      await refreshDashboard();
    } catch (error) {
      console.error("Application error:", error);
      alert("Backend connection failed. Please try again.");
    } finally {
      setBusyEvent(null);
    }
  };

  const handleCancel = async (applicationId) => {
    if (!volunteerId) {
      alert("Please login again.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (!confirmed) return;

    setBusyApplication(applicationId);

    try {
      const response = await fetch(
        `${API_URL}/applications/${applicationId}/${volunteerId}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Cancellation failed");
        await refreshDashboard();
        return;
      }

      alert("Application cancelled successfully!");
      await refreshDashboard();
    } catch (error) {
      console.error("Cancel application error:", error);
      alert("Backend connection failed. Please try again.");
    } finally {
      setBusyApplication(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("volunteer_id");
    localStorage.removeItem("volunteer_name");
    window.location.reload();
  };

  const activeApplicationCount = applications.length;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", paddingBottom: 40 }}>
      <header
        style={{
          background: "linear-gradient(135deg, #1769e0, #4f8df7)",
          color: "white",
          padding: "35px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 45 }}>🤝</div>
        <h1 style={{ margin: "5px 0", fontSize: 32 }}>Volunteer Dashboard</h1>
        <p>Welcome, {localStorage.getItem("volunteer_name") || "Volunteer"}</p>
      </header>

      <main style={{ maxWidth: 1100, margin: "auto", padding: "30px 20px" }}>
        <section
          style={{
            background: "white",
            borderRadius: 18,
            padding: 22,
            marginBottom: 25,
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2>👤 Volunteer Profile</h2>
          <p>View and manage your volunteer activities.</p>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 18,
            marginBottom: 35,
          }}
        >
          <SummaryCard title="Available Events" count={events.length} icon="📅" />
          <SummaryCard title="My Active Applications" count={activeApplicationCount} icon="📝" />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <button onClick={refreshDashboard} style={buttonStyle("#1769e0")}>
            🔄 Refresh Dashboard
          </button>
        </div>

        <h2>📅 Available Events</h2>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <div style={gridStyle}>
            {events.map((event) => {
              const alreadyApplied = applications.some(
                (application) =>
                  Number(application.Event_ID) === Number(event.id)
              );
              const isFull = event.Status === "Full";
              const isCompleted = event.Status === "Completed";

              return (
                <article key={event.id} style={cardStyle}>
                  <div style={{ fontSize: 42, textAlign: "center" }}>
                    {getEventIcon(event.Event_Name)}
                  </div>

                  <h3 style={{ color: "#1769e0", textAlign: "center" }}>
                    {event.Event_Name}
                  </h3>

                  <p><strong>📅 Date:</strong> {String(event.Date).slice(0, 10)}</p>
                  <p><strong>📍 Location:</strong> {event.Location}</p>
                  <p><strong>📝 Description:</strong> {event.Description}</p>
                  <p><strong>🏢 Organization ID:</strong> {event.Organization_ID}</p>
                  <p><strong>👥 Maximum Volunteers:</strong> {event.Maximum_Volunteers ?? "Not specified"}</p>
                  <p><strong>Status:</strong> {event.Status || "Available"}</p>

                  <button
                    onClick={() => handleApply(event.id)}
                    disabled={isFull || isCompleted || alreadyApplied || busyEvent === event.id}
                    style={buttonStyle(
                      isFull || isCompleted || alreadyApplied ? "#999" : "#1769e0"
                    )}
                  >
                    {busyEvent === event.id
                      ? "Please wait..."
                      : alreadyApplied
                      ? "Already Applied"
                      : isFull
                      ? "Event Full"
                      : isCompleted
                      ? "Event Completed"
                      : "Apply Now"}
                  </button>
                </article>
              );
            })}
          </div>
        )}

        <h2 style={{ marginTop: 45 }}>📝 My Applications</h2>

        {applicationLoading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p style={cardStyle}>No active applications found.</p>
        ) : (
          <div style={gridStyle}>
            {applications.map((application) => (
              <article key={application.Application_ID} style={cardStyle}>
                <h3>Application #{application.Application_ID}</h3>
                <p><strong>Event ID:</strong> {application.Event_ID}</p>
                <p><strong>Applied Date:</strong> {String(application.Applied_Date).slice(0, 10)}</p>
                <p><strong>Status:</strong> {application.Status}</p>

                <button
                  onClick={() => handleCancel(application.Application_ID)}
                  disabled={busyApplication === application.Application_ID}
                  style={buttonStyle("#dc3545")}
                >
                  {busyApplication === application.Application_ID
                    ? "Cancelling..."
                    : "❌ Cancel Application"}
                </button>
              </article>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button onClick={handleLogout} style={buttonStyle("#dc3545")}>
            🚪 Logout
          </button>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ title, count, icon }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: 22,
        textAlign: "center",
        boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
      }}
    >
      <div style={{ fontSize: 32 }}>{icon}</div>
      <h3 style={{ margin: "8px 0 3px", color: "#1769e0", fontSize: 28 }}>
        {count}
      </h3>
      <p style={{ margin: 0, color: "#666" }}>{title}</p>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 22,
};

const cardStyle = {
  background: "white",
  borderRadius: 16,
  padding: 22,
  boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
  border: "1px solid #edf1f7",
};

function buttonStyle(background) {
  return {
    width: "100%",
    padding: 12,
    marginTop: 12,
    background,
    color: "white",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    cursor: "pointer",
  };
}

export default VolunteerDashboard;
