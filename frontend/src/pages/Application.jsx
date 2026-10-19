
import React, { useEffect, useState } from "react";
import API_URL from "../services/api";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/applications/`);

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return <p>Loading applications...</p>;
  }

  return (
    <div>
      <h2>My Applications</h2>

      <button onClick={fetchApplications}>
        Refresh Applications
      </button>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((application) => (
          <div key={application.Application_ID}>
            <p>Application ID: {application.Application_ID}</p>
            <p>Event ID: {application.Event_ID}</p>
            <p>Status: {application.Status}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Applications;
