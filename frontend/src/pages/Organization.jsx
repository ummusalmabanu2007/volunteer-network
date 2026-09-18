import { useEffect, useState } from "react";
import Event from "./Event";

function Organization() {
  const [events, setEvents] = useState([]);

  const organizationId = localStorage.getItem("organization_id");

  useEffect(() => {
    fetch("http://127.0.0.1:8001/events/")
      .then((response) => response.json())
      .then((data) => {
        const myEvents = data.filter(
          (event) =>
            event.Organization_ID === Number(organizationId)
        );

        setEvents(myEvents);
      })
      .catch((error) => {
        console.error("Event error:", error);
      });
  }, [organizationId]);

  const handleLogout = () => {
    localStorage.removeItem("organization_id");
    localStorage.removeItem("organization_name");
    window.location.reload();
  };

  return (
    <div>
      <h1>Organization Dashboard</h1>

      <p>
        Welcome,{" "}
        {localStorage.getItem("organization_name")}
      </p>

      <hr />

      <h2>Organization Profile</h2>

      <p>Manage your organization details</p>

      <hr />

      <h2>Create Event</h2>

      <Event />

      <hr />

      <h2>My Created Events</h2>

      {events.length === 0 ? (
        <p>No events created yet.</p>
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
              <strong>Description:</strong>{" "}
              {event.Description}
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

export default Organization;