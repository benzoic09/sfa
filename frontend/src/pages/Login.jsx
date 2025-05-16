import React, { useState } from "react";
import { FaUser, FaKey } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email, password }), // Send 'email' as 'username' to backend
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("roleId", data.roleId);

        // Make an additional call to fetch the role name
        const roleResponse = await fetch(
          `${import.meta.env.VITE_API_URL_USERS}/role/${data.roleId}`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`, // Include the token for authentication
            },
          }
        );

        //const roleData = await roleResponse.json();
        const roleClone = roleResponse.clone();
        roleClone.text().then((text) => console.log("  Body:", text));
        const roleData = await roleResponse.json();

        if (roleResponse.ok && roleData.roleName) {
          localStorage.setItem("role", roleData.roleName); // Store the role name
          window.location.href = "/home";
        } else {
          setError(roleData.message || "Failed to fetch role name.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("username");
          localStorage.removeItem("roleId");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-100">
      <div className="w-full max-w-sm bg-blue-700 bg-opacity-90 p-10 rounded shadow-lg text-white text-center">
        <h2 className="text-3xl font-bold mb-2">Login</h2>
        <p className="mb-6 text-sm">Please enter your Login and Password</p>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3.5 text-blue-300 drop-shadow" />
            <input
              type="text"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 rounded border border-blue-400 bg-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:ring-2 hover:ring-green-300 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6 relative">
            <FaKey className="absolute left-3 top-3.5 text-blue-300 drop-shadow" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 rounded border border-blue-400 bg-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:ring-2 hover:ring-green-300 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold py-2 rounded hover:from-green-500 hover:to-green-600 transition transform hover:scale-105 duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
