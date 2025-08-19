// src/App.tsx
import React from "react";
import { useAuth } from "./context/AuthContext";

const App: React.FC = () => {
  const { isAuthenticated, currentUser, login, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">One Church Worship Team</h1>

        {isAuthenticated && currentUser ? (
          <>
            <p className="mb-2">Welcome, {currentUser.name || currentUser.email}!</p>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p className="mb-4">You are not logged in.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default App;