import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login({ email, password });
      // Redirect handled by auth context
    } catch (error: unknown) {
      // Error already handled in auth context
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-8 max-w-md w-full">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to Internal Fleet Management Tool</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => window.location.href = '/register'}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
}
