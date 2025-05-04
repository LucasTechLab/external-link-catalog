
import React from 'react';
import AdminForm from '@/components/AdminForm';
import Layout from '@/components/Layout';

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <AdminForm />
        </div>
      </div>
    </div>
  );
};

export default Admin;
