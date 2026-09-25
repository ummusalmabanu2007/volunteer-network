import { useState } from "react";
import API_URL from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const registerData = {
      name: name,
      email: email,
      phone: phone,
      address: address,
      skills: skills,
      password: password,
      confirm_password: confirmPassword,
    };

    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");

        localStorage.setItem(
          "volunteer_id",
          data.volunteer_id
        );

        localStorage.setItem(
          "volunteer_name",
          name
        );

        window.location.reload();
      } else {
        alert(
          "Registration failed: " +
          (data.detail || "Something went wrong")
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Backend connection failed!");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d9dfe7",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  };

  const fieldStyle = {
    marginBottom: "15px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f7fb",
        padding: "30px 15px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2
            style={{
              margin: "0 0 8px",
              color: "#1769aa",
              fontSize: "25px",
            }}
          >
            Volunteer Community Network
          </h2>

          <h3
            style={{
              margin: "0 0 8px",
              color: "#222",
              fontSize: "22px",
            }}
          >
            Create Your Account
          </h3>

          <p
            style={{
              margin: 0,
              color: "#777",
              fontSize: "14px",
            }}
          >
            Join our volunteer community and make a difference.
          </p>
        </div>

        <form onSubmit={handleRegister}>

          <div style={fieldStyle}>
            <input
              type="text"
              placeholder="👤  Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <input
              type="email"
              placeholder="✉️  Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <input
              type="text"
              placeholder="📱  Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <input
              type="text"
              placeholder="🏠  Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <input
              type="text"
              placeholder="🛠️  Skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <input
              type="password"
              placeholder="🔒  Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              placeholder="🔒  Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: "#1769aa",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>

        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            marginBottom: 0,
            color: "#777",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "#1769aa",
              fontWeight: "600",
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;