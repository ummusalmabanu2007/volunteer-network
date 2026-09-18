import { useState } from "react";

function Event() {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const eventData = {
      Event_Name: eventName,
      Date: date,
      Location: location,
      Description: description,
      Organization_ID: 1,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/events/",
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
        setDescription("");

        console.log("Event response:", data);
      } else {
        alert("Event creation failed: " + data.detail);
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

        <br /><br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default Event;