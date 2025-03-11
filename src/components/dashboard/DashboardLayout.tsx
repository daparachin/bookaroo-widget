
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex w-full bg-[#f8fafc]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-6 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
          <h1 className="text-xl font-semibold ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Vacation Rental Dashboard
          </h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
