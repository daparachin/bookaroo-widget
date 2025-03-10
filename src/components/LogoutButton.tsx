// src/components/LogoutButton.tsx
import React from 'react';
import { useAuth } from '@/context/AuthContext';

const LogoutButton = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
    >
      Logout
    </button>
  );
};

export default LogoutButton;