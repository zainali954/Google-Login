import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth()

  const logout = async () => {
    // Clear tokens
    localStorage.removeItem('user');

    // Optionally, notify the server to clear cookies
    await fetch('http://localhost:5000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900">
      <div className="w-full max-w-sm p-6 bg-zinc-800 text-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          {/* User Image */}
          <img
            className="w-24 h-24 rounded-full border-4 border-gray-600 shadow-md"
            src={user?.picture}
            alt={user?.name}
          />

          {/* User Name */}
          <h1 className="mt-4 text-2xl font-semibold">{user?.name}</h1>

          {/* User Email */}
          <p className="mt-1 text-gray-400 text-sm">{user?.email}</p>
        </div>

        <div className="mt-6">
          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
