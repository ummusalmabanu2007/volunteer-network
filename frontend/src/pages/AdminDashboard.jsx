import { useEffect, useState } from "react";

function AdminDashboard() {
  const [volunteers, setVolunteers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/volunteers/")
      .then((response) => response.json())
      .then((data) => setVolunteers(data))
      .catch((error) => console.error("Volunteer error:", error));

    fetch("http://127.0.0.1:8001/organizations/")
      .then((response) => response.json())
      .then((data) => setOrganizations(data))
      .catch((error) => console.error("Organization error:", error));

    fetch("http://127.0.0.1:8001/events/")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Event error:", error));

    fetch("http://127.0.0.1:8001/applications/")
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) => console.error("Application error:", error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_name");
    window.location.reload();
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>
        Welcome, {localStorage.getItem("admin_name")}
      </p>

      <hr />

      <h2>Dashboard Overview</h2>

      <p>Total Volunteers: {volunteers.length}</p>
      <p>Total Organizations: {organizations.length}</p>
      <p>Total Events: {events.length}</p>
      <p>Total Applications: {applications.length}</p>

      <hr />

      <h2>Volunteers</h2>

      {volunteers.length === 0 ? (
        <p>No volunteers found.</p>
      ) : (
        volunteers.map((volunteer) => (
          <div key={volunteer.id}>
            <p>
              <strong>ID:</strong> {volunteer.id}
            </p>
            <p>
              <strong>Name:</strong> {volunteer.name}
            </p>
            <p>
              <strong>Email:</strong> {volunteer.email}
            </p>
            <hr />
          </div>
        ))
      )}

      <h2>Organizations</h2>

      {organizations.length === 0 ? (
        <p>No organizations found.</p>
      ) : (
        organizations.map((organization) => (
          <div key={organization.Organization_ID}>
            <p>
              <strong>ID:</strong>{" "}
              {organization.Organization_ID}
            </p>
            <p>
              <strong>Name:</strong> {organization.Name}
            </p>
            <p>
              <strong>Email:</strong> {organization.Email}
            </p>
            <hr />
          </div>
        ))
      )}

      <h2>Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map((event) => (
          <div key={event.id}>
            <p>
              <strong>Event:</strong> {event.Event_Name}
            </p>
            <p>
              <strong>Date:</strong> {event.Date}
            </p>
            <p>
              <strong>Location:</strong> {event.Location}
            </p>
            <hr />
          </div>
        ))
      )}

      <h2>Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((application) => (
          <div key={application.Application_ID}>
            <p>
              <strong>Application ID:</strong>{" "}
              {application.Application_ID}
            </p>
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
              {application.Status}
            </p>
            <hr />
          </div>
        ))
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;