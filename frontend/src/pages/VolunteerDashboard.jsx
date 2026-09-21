import { useEffect, useState } from "react";

function VolunteerDashboard() {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(true);

  useEffect(() => {
    fetch("https://volunteer-network-production-ec87.up.railway.app/events/")
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

    fetch("https://volunteer-network-production-ec87.up.railway.app/applications/")
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
    console.log("Selected Event ID:", eventId);

    const volunteerId = localStorage.getItem("volunteer_id");

    const applicationData = {
      Volunteer_ID: Number(volunteerId),
      Event_ID: eventId,
      Applied_Date: new Date().toISOString().split("T")[0],
      Status: "Pending",
    };

    console.log("Application Data:", applicationData);

    try {
      const response = await fetch(
        "https://volunteer-network-production-ec87.up.railway.app/applications/",
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

        console.log("Application response:", data);

        setApplications((previousApplications) => [
          ...previousApplications,
          data,
        ]);
      } else {
        alert("Application failed: " + data.detail);
      }
    } catch (error) {
      console.error("Application error:", error);
      alert("Backend connection failed!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("volunteer_id");
    localStorage.removeItem("volunteer_name");
    window.location.reload();
  };

  return (
    <div>
      <h1>Volunteer Dashboard</h1>

      <p>
        Welcome, {localStorage.getItem("volunteer_name")}
      </p>

      <hr />

      <h2>Volunteer Profile</h2>

      <p>View and manage your profile</p>

      <hr />

      <h2>Available Events</h2>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        events.map((event) => (
          <div key={event.id}>
            <h3>{event.Event_Name}</h3>

            <p>
              <strong>Date:</strong> {event.Date}
            </p>

            <p>
              <strong>Location:</strong> {event.Location}
            </p>

            <p>
              <strong>Description:</strong> {event.Description}
            </p>

            <p>
              <strong>Organization ID:</strong>{" "}
              {event.Organization_ID}
            </p>

            <button onClick={() => handleApply(event.id)}>
              Apply for Event
            </button>

            <hr />
          </div>
        ))
      )}

      <h2>My Applications</h2>

      {applicationLoading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((application) => (
          <div key={application.Application_ID}>
            <p>
              <strong>Application ID:</strong>{" "}
              {application.Application_ID}
            </p>

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
              {application.Status}
            </p>

            <hr />
          </div>
        ))
      )}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default VolunteerDashboard;