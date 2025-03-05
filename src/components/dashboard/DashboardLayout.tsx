
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger 
} from "@/components/ui/sidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-6 bg-background">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold ml-4">Vacation Rental Dashboard</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
