import { useEffect, useState } from "react";

function Login() {
  const [role, setRole] = useState("volunteer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered_email");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    let loginUrl = "";

    if (role === "volunteer") {
      loginUrl =
        "https://volunteer-network-production-5388.up.railway.app/auth/login";
    } else if (role === "organization") {
      loginUrl =
        "https://volunteer-network-production-5388.up.railway.app/auth/organization-login";
    } else if (role === "admin") {
      loginUrl =
        "https://volunteer-network-production-5388.up.railway.app/auth/admin-login";
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

        if (rememberMe) {
          localStorage.setItem("remembered_email", email);
        } else {
          localStorage.removeItem("remembered_email");
        }

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

        window.location.href = "/";
      } else {
        alert("Login failed: " + data.detail);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Backend connection failed!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f4f8ff",
      }}
    >
      {/* LEFT SIDE IMAGE */}
      <div
        style={{
          flex: 1.15,
          minHeight: "100vh",
          backgroundImage: "url('/volunteer-service.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Image overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(23,105,224,0.25), rgba(0,0,0,0.15))",
          }}
        ></div>

        {/* Left side text */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            color: "white",
            textAlign: "center",
            padding: "30px",
            textShadow: "0 2px 8px rgba(0,0,0,0.35)",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "12px",
            }}
          >
            Volunteer Community
          </h1>

          <h2
            style={{
              fontSize: "28px",
              margin: 0,
            }}
          >
            Network 🤝
          </h2>

          <p
            style={{
              fontSize: "17px",
              marginTop: "18px",
            }}
          >
            Together for a Better Tomorrow 💙
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div
        style={{
          flex: 0.85,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            background: "#ffffff",
            padding: "42px",
            borderRadius: "24px",
            boxShadow:
              "0 15px 45px rgba(23, 105, 224, 0.15)",
            boxSizing: "border-box",
          }}
        >
          {/* LOGIN HEADER */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "8px",
              }}
            >
              🔐
            </div>

            <h1
              style={{
                margin: "0",
                color: "#1769e0",
                fontSize: "28px",
              }}
            >
              Welcome Back!
            </h1>

            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                color: "#718096",
              }}
            >
              Login to your account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* ROLE */}
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#333",
              }}
            >
              👤 Select Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #d5dce5",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "15px",
                background: "#fff",
                boxSizing: "border-box",
                outline: "none",
              }}
            >
              <option value="volunteer">
                👤 Volunteer
              </option>

              <option value="organization">
                🏢 Organization
              </option>

              <option value="admin">
                🛡️ Admin
              </option>
            </select>

            {/* EMAIL */}
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#333",
              }}
            >
              📧 Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #d5dce5",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />

            {/* PASSWORD */}
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#333",
              }}
            >
              🔒 Password
            </label>

            <div
              style={{
                position: "relative",
                marginBottom: "15px",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                style={{
                  width: "100%",
                  padding: "13px 65px 13px 13px",
                  border: "1px solid #d5dce5",
                  borderRadius: "10px",
                  fontSize: "15px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "7px",
                  border: "none",
                  background: "#eef5ff",
                  color: "#1769e0",
                  cursor: "pointer",
                  padding: "7px 10px",
                  borderRadius: "7px",
                  fontWeight: "600",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* REMEMBER ME */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "22px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                style={{
                  marginRight: "8px",
                  width: "16px",
                  height: "16px",
                }}
              />

              <span>Remember Me</span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background:
                  "linear-gradient(135deg, #1769e0, #287ff0)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow:
                  "0 6px 18px rgba(23, 105, 224, 0.25)",
              }}
            >
              LOGIN →
            </button>
          </form>

          {/* REGISTER */}
          <p
            style={{
              textAlign: "center",
              marginTop: "25px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/register";
              }}
              style={{
                border: "none",
                background: "none",
                color: "#1769e0",
                fontWeight: "700",
                cursor: "pointer",
                padding: "0",
              }}
            >
              Register
            </button>
          </p>

          <p
            style={{
              textAlign: "center",
              marginTop: "22px",
              marginBottom: 0,
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            Connecting People • Creating Impact 🌍
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;