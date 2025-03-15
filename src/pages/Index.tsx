
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/LogoutButton';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-teal-600">Vacation Rental Admin</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-900">Home</Link>
                <Link to="/booking" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Book a Service</Link>
                <Link to="/booking/property" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Book a Property</Link>
                {user && (
                  <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <LogoutButton />
              ) : (
                <Link to="/dashboard">
                  <Button variant="default">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simplify Your Rental Management
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            An all-in-one solution for managing your vacation rental properties and booking services.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/booking">
              <Button className="py-6 px-8 text-lg">Book a Service</Button>
            </Link>
            <Link to="/booking/property">
              <Button className="py-6 px-8 text-lg" variant="outline">Book a Property</Button>
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button className="py-6 px-8 text-lg" variant="ghost">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <Button className="py-6 px-8 text-lg" variant="ghost">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} Vacation Rental Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
