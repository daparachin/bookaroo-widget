import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/dashboard/Dashboard";
import PropertiesPage from "./pages/dashboard/PropertiesPage";
import PricingPage from "./pages/dashboard/PricingPage";
import CalendarPage from "./pages/dashboard/CalendarPage";
import BookingsPage from "./pages/dashboard/BookingsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import WidgetPage from "./pages/dashboard/WidgetPage";
import BookingPage from "./pages/BookingPage";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "./components/ui/sidebar";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Import AuthContext and Login components
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Login from "@/components/Login";
import { Loader2 } from "lucide-react";

// Import i18n
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// A more secure ProtectedRoute that handles loading state and redirects to login
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="text-gray-600">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // If no authenticated user, redirect to login and remember the attempted URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return children;
};

// Add a login route handler component
const LoginRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Redirect to original destination or dashboard if already logged in
  if (user) {
    const destination = location.state?.from || "/dashboard";
    return <Navigate to={destination} replace />;
  }
  
  return <Login />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/booking" element={<BookingPage />} />
    <Route path="/booking/property" element={<BookingPage mode="property" />} />
    <Route path="/login" element={<LoginRoute />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
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
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <SidebarProvider>
              <AppRoutes />
            </SidebarProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
