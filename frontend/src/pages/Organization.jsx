import { useEffect, useState } from "react";
import Event from "./Event";
   const API_URL = "https://volunteer-network-production-5388.up.railway.app";

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
    <div>
      <h1>Organization Dashboard</h1>

      <p>
        Welcome, {localStorage.getItem("organization_name")}
      </p>

      <hr />

      <h2>Create Event</h2>

      <Event />

      <hr />

      <h2>My Created Events</h2>

      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        events.map((event) => {
          const appliedCount = getAppliedCount(event.id);
          const maximum = event.Maximum_Volunteers || 0;

          const availableSeats =
            maximum > appliedCount
              ? maximum - appliedCount
              : 0;

          return (
            <div key={event.id}>
              <h3>{event.Event_Name}</h3>

              <p>
                <strong>Date:</strong> {event.Date}
              </p>

              <p>
                <strong>Location:</strong> {event.Location}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {event.Description}
              </p>

              <p>
                <strong>Applied Volunteers:</strong>{" "}
                {appliedCount}
              </p>

              <p>
                <strong>Maximum Volunteers:</strong>{" "}
                {maximum}
              </p>

              <p>
                <strong>Available Seats:</strong>{" "}
                {availableSeats}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {event.Status}
              </p>

              <button
                onClick={() => handleUpdateMaximum(event)}
              >
                Change Maximum Volunteers
              </button>

              <hr />
            </div>
          );
        })
      )}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Organization;