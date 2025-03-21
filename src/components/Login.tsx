import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Create validation schemas
const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const Login = () => {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState<number | null>(null);

  // Clear lock after timeout
  useEffect(() => {
    if (isLocked && lockTimer !== null) {
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
      }, lockTimer);
      
      return () => clearTimeout(timer);
    }
  }, [isLocked, lockTimer]);

  const validateInput = () => {
    const validationErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        validationErrors.email = error.errors[0]?.message;
      }
    }
    
    try {
      // Only validate password complexity for sign up
      if (isSignUp) {
        passwordSchema.parse(password);
      } else if (password.length < 1) {
        validationErrors.password = 'Password is required';
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        validationErrors.password = error.errors[0]?.message;
      }
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isLocked) {
      toast.error('Too many failed attempts. Please try again later.');
      return;
    }
    
    // Validate inputs before proceeding
    if (!validateInput()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Handle sign up
        await signUp(email, password);
        toast.success('Account created! Please verify your email if required.');
        setLoginAttempts(0);
      } else {
        // Handle sign in
        await signIn(email, password);
        toast.success('Successfully signed in!');
        setLoginAttempts(0);
      }
    } catch (err: any) {
      // Increment login attempts on failure
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        setIsLocked(true);
        
        // Exponential backoff: 30 seconds after 5 attempts, 2 minutes after 6 attempts, etc.
        const lockTimeMs = 30000 * Math.pow(2, newAttempts - 5);
        const maxLockTimeMs = 30 * 60 * 1000; // 30 minutes max
        
        setLockTimer(Math.min(lockTimeMs, maxLockTimeMs));
        toast.error(`Too many failed attempts. Account locked for ${Math.ceil(Math.min(lockTimeMs, maxLockTimeMs) / 60000)} minutes.`);
      } else {
        // Show error message
        let errorMessage = 'Authentication failed. Please check your credentials.';
        if (err.message) {
          // Sanitize error message to prevent exposing sensitive info
          errorMessage = err.message.includes('credentials') 
            ? 'Invalid email or password.' 
            : 'An error occurred during authentication.';
        }
        
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel with illustration/brand */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Property Manager</h1>
          <p className="text-blue-100 mb-8">Your all-in-one solution for vacation rental management</p>
        </div>
        
        <div className="hidden md:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h3 className="text-xl font-medium text-white mb-3">Why choose our platform?</h3>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-start">
                <span className="bg-blue-400/30 rounded-full p-1 mr-2 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Centralized booking management
              </li>
              <li className="flex items-start">
                <span className="bg-blue-400/30 rounded-full p-1 mr-2 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Channel management across platforms
              </li>
              <li className="flex items-start">
                <span className="bg-blue-400/30 rounded-full p-1 mr-2 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Automated guest communication
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-blue-100 text-sm">
          © {new Date().getFullYear()} Property Manager. All rights reserved.
        </div>
      </div>
      
      {/* Right panel with login form */}
      <div className="bg-white md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isSignUp 
                ? 'Start managing your properties efficiently' 
                : 'Sign in to access your dashboard'}
            </p>
          </div>
          
          {isLocked && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                Your account is temporarily locked due to too many failed login attempts. 
                Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="you@example.com"
                  disabled={isLocked || loading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  disabled={isLocked || loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLocked || loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              {isSignUp && !errors.password && (
                <p className="text-gray-500 text-xs mt-1">
                  Password must be at least 8 characters and include uppercase, lowercase, 
                  number, and special character.
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={isLocked || loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              disabled={isLocked || loading}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Don\'t have an account? Sign up'}
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
