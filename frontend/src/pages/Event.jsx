import { useState } from "react";

function Event() {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [maximumVolunteers, setMaximumVolunteers] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const organizationId =
      localStorage.getItem("organization_id");

    const eventData = {
      Event_Name: eventName,
      Date: date,
      Location: location,
      Maximum_Volunteers: Number(maximumVolunteers),
      Description: description,
      Organization_ID: Number(organizationId),
    };

    try {
      const response = await fetch(
         "https://volunteer-network-production-5388.up.railway.app/events/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Event created successfully!");

        setEventName("");
        setDate("");
        setLocation("");
        setMaximumVolunteers("");
        setDescription("");
      } else {
        alert(
          "Event creation failed: " +
            (data.detail || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Event error:", error);
      alert("Backend connection failed!");
    }
  };

  return (
    <div>
      <h1>Create Event</h1>

      <form onSubmit={handleCreateEvent}>
        <input
          type="text"
          placeholder="Enter Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Maximum Volunteers"
          value={maximumVolunteers}
          onChange={(e) => setMaximumVolunteers(e.target.value)}
          min="1"
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
}
export default Event;