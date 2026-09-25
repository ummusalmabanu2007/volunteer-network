import React, { useEffect, useState } from "react";
import API_URL from "../services/api";

function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/applications/`)
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  return (
    <div>
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((application) => (
          <div key={application.Application_ID}>
            <p>
              Application ID: {application.Application_ID}
            </p>

            <p>
              Event ID: {application.Event_ID}
            </p>

            <p>
              Status: {application.Status}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Applications;