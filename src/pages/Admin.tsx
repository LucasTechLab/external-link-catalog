
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AdminAuth from '@/components/AdminAuth';
import ProductManagement from '@/components/ProductManagement';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const goToLandingPage = () => {
    navigate('/');
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goToLandingPage} aria-label="Back to home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
        
        <ProductManagement onBack={goToLandingPage} />
      </div>
    </div>
  );
};

export default Admin;
