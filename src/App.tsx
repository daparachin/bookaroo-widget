
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/dashboard/Dashboard";
import PropertiesPage from "./pages/dashboard/PropertiesPage";
import PricingPage from "./pages/dashboard/PricingPage";
import CalendarPage from "./pages/dashboard/CalendarPage";
import BookingsPage from "./pages/dashboard/BookingsPage"; 
import SettingsPage from "./pages/dashboard/SettingsPage";
import WidgetPage from "./pages/dashboard/WidgetPage";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "./components/ui/sidebar";
import DashboardLayout from "./components/dashboard/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="widget" element={<WidgetPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
