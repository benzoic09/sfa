import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaKey } from 'react-icons/fa';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', { // Adjust URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // Clear the form
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        if (data.errors) {
          //If there are validation errors from express-validator
          const errorMessages = data.errors.map(e => e.msg).join(', ');
          setError(errorMessages);
        }
        else{
          setError(data.message || 'Registration failed');
        }

      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-100">
      <div className="w-full max-w-md bg-blue-700 bg-opacity-90 p-10 rounded shadow-lg text-white text-center">
        <h2 className="text-3xl font-bold mb-2">Register</h2>
        <p className="mb-6 text-sm">Create a new account</p>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3.5 text-blue-300 drop-shadow" />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 rounded border border-blue-400 bg-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:ring-2 hover:ring-green-300 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-blue-300 drop-shadow" />
            <input
              type="email"
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;