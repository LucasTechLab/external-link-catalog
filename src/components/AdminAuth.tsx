
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
import { Lock } from 'lucide-react';

// In a real app, this would be stored securely, not hardcoded
const ADMIN_PASSWORD = 'admin123';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setError('');
      toast.success('Login successful', {
        description: 'Welcome to the admin dashboard',
      });
      onAuthSuccess();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <div className="mx-auto bg-primary/10 p-3 rounded-full inline-flex mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Enter password to access the admin panel</p>
        </div>
        
        <form onSubmit={handleLogin}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Enter admin password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Access Admin Panel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
