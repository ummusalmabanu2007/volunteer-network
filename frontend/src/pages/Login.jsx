import { useState } from "react";

function Login() {
  const [role, setRole] = useState("volunteer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    let loginUrl = "";

    if (role === "volunteer") {
      loginUrl = "http://127.0.0.1:8001/auth/login";
    } else if (role === "organization") {
      loginUrl = "http://127.0.0.1:8001/auth/organization-login";
    } else if (role === "admin") {
      loginUrl = "http://127.0.0.1:8001/auth/admin-login";
    }

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");

        if (role === "volunteer") {
          localStorage.setItem("volunteer_id", data.volunteer_id);
          localStorage.setItem("volunteer_name", data.name);
        }

        if (role === "organization") {
          localStorage.setItem(
            "organization_id",
            data.organization_id
          );
          localStorage.setItem(
            "organization_name",
            data.name
          );
        }

        if (role === "admin") {
          localStorage.setItem("admin_id", data.admin_id);
          localStorage.setItem("admin_name", data.name);
        }

        window.location.reload();
      } else {
        alert("Login failed: " + data.detail);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Backend connection failed!");
    }
  };

  return (
    <div className="login-container">
      <h2>Volunteer Community Network</h2>

      <h3>Login</h3>

      <form onSubmit={handleLogin}>

        <label>Select Role</label>

        <br />
        <br />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="volunteer">Volunteer</option>
          <option value="organization">Organization</option>
          <option value="admin">Admin</option>
        </select>

        <br />
        <br />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">Login</button>

      </form>
    </div>.
  );
}

export default Login;