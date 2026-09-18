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
      const response = await fetch(${API_URL}/auth/register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");

        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setSkills("");
        setPassword("");
        setConfirmPassword("");
      } else {
        alert("Registration failed: " + data.detail);
      }
    } catch (error) {
      alert("Backend connection failed!");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Volunteer Network</h2>
      <h3>Volunteer Registration</h3>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;