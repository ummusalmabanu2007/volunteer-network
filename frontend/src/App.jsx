import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Organization from "./pages/Organization";

function App() {
  const volunteerId = localStorage.getItem("volunteer_id");
  const organizationId = localStorage.getItem("organization_id");
  const adminId = localStorage.getItem("admin_id");

  // Register page
  if (window.location.pathname === "/register") {
    return <Register />;
  }

  // Admin Dashboard
  if (adminId) {
    return <AdminDashboard />;
  }

  // Organization Dashboard
  if (organizationId) {
    return <Organization />;
  }

  // Volunteer Dashboard
  if (volunteerId) {
    return <VolunteerDashboard />;
  }

  // Login page
  return <Login />;
}

export default App;