
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import EnvTester from '@/components/EnvTester';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Bookio
          </h1>
          <p className="text-xl text-gray-600">
            Your all-in-one vacation rental management solution
          </p>
        </div>
        
        <div className="mb-10 glass-card p-6 rounded-xl">
          <EnvTester />
        </div>
        
        <div className="text-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-200">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
