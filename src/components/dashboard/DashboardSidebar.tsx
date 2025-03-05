
import React from 'react';
import { NavLink } from 'react-router-dom';
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
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Home, label: 'Properties', path: '/dashboard/properties' },
    { icon: Tag, label: 'Pricing', path: '/dashboard/pricing' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: List, label: 'Bookings', path: '/dashboard/bookings' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: Code, label: 'Widget', path: '/dashboard/widget' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-16 px-6 border-b">
        <span className="text-xl font-bold">VacationManager</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        isActive ? "!bg-primary/10 !text-primary" : ""
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
      <SidebarFooter className="border-t py-4">
        <NavLink to="/" className="flex items-center px-6 py-2 gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
          <span>Return to Home</span>
        </NavLink>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
