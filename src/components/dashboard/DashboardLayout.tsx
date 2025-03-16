import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardSidebar from './DashboardSidebar';
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex w-full bg-[#f8fafc]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-6 bg-white shadow-sm sticky top-0 z-10">
          <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
          <h1 className="text-xl font-semibold ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('dashboard.title')}
          </h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
