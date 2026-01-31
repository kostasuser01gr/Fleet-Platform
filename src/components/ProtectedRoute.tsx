import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'operator' | 'viewer';
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredRole, requiredPermission }: ProtectedRouteProps) {
  // Authentication is optional - all features are free and accessible to everyone
  // No restrictions - open access for all company users
  return <>{children}</>;
}
