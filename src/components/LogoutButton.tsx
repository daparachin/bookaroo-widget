// src/components/LogoutButton.tsx
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const LogoutButton = () => {
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
    >
      {t('common.logout')}
    </button>
  );
};

export default LogoutButton;