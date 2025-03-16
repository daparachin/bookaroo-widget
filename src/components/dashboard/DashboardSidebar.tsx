import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { 
  LayoutDashboard, 
  Home, 
  Tag, 
  Calendar, 
  List, 
  Settings, 
  Code,
  LogOut
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const DashboardSidebar: React.FC = () => {
  const { t } = useTranslation();
  
  const navItems = [
    { icon: LayoutDashboard, label: t('common.dashboard'), path: '/dashboard' },
    { icon: Home, label: t('common.properties'), path: '/dashboard/properties' },
    { icon: Tag, label: t('common.pricing'), path: '/dashboard/pricing' },
    { icon: Calendar, label: t('common.calendar'), path: '/dashboard/calendar' },
    { icon: List, label: t('common.bookings'), path: '/dashboard/bookings' },
    { icon: Settings, label: t('common.settings'), path: '/dashboard/settings' },
    { icon: Code, label: t('common.widget'), path: '/dashboard/widget' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-16 px-6 border-b bg-white">
        <span className="text-xl font-bold">{t('dashboard.appName')}</span>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 pt-4">{t('dashboard.mainMenu')}</SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        isActive ? "!bg-primary/10 !text-primary font-medium" : "hover:bg-gray-100"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t py-4 bg-white">
        <NavLink to="/" className="flex items-center px-6 py-2 gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-100">
          <LogOut className="h-4 w-4" />
          <span>{t('common.returnToHome')}</span>
        </NavLink>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
