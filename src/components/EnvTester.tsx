
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnvTester = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testEnvironmentVariables = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('get-env');
      
      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      console.error('Error testing environment variables:', err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Environment Variables Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testEnvironmentVariables} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Environment Variables'}
        </Button>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {result && (
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-medium">Result:</p>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnvTester;
