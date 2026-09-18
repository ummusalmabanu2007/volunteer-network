import "./App.css";
import Login from "./pages/Login";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Organization from "./pages/Organization";

function App() {
  const volunteerId = localStorage.getItem("volunteer_id");
  const organizationId = localStorage.getItem("organization_id");
  const adminId = localStorage.getItem("admin_id");

  if (adminId) {
    return <AdminDashboard />;
  }

  if (organizationId) {
    return <Organization />;
  }

  if (volunteerId) {
    return <VolunteerDashboard />;
  }

  return <Login />;
}

export default App;