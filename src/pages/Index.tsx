
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import EnvTester from '@/components/EnvTester';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Bookio</h1>
          <p className="text-xl text-gray-700">Your all-in-one booking solution</p>
        </div>
        
        {/* Environment Variables Tester */}
        <div className="mb-10">
          <EnvTester />
        </div>
        
        <div className="text-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
