import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; // Import useAuth from AuthContext
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Use setUser from AuthContext
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // For selecting user role

  async function handleLogin() {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', data.role);

        // Update user context
        setUser({ username, role: data.role });

        // Redirect to the dashboard
        navigate('/Dashboard');
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, password, role });
      alert('Registration successful! You can now log in.');
      setIsRegistering(false); // Switch back to login form
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-500 mt-1">
          {isRegistering ? 'Register below to get started!' : 'Sign in to your account'}
        </p>
        <form className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="sales_rep">Sales Rep</option>
              </select>
            </div>
          )}
          <button
            type="button"
            onClick={isRegistering ? handleRegister : handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline text-sm"
          >
            {isRegistering
              ? 'Already have an account? Sign In'
              : 'Don’t have an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
