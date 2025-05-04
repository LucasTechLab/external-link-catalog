
import React, { useState } from 'react';
import AdminForm from '@/components/AdminForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
import { Lock, Edit, Trash2 } from 'lucide-react';
import { products } from '@/data/products';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// In a real app, this would be stored securely, not hardcoded
const ADMIN_PASSWORD = 'admin123';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [productList, setProductList] = useState(products);
  const [editingProduct, setEditingProduct] = useState<null | {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    externalUrl: string;
    category: string;
  }>(null);
  const [showForm, setShowForm] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      toast.success('Login successful', {
        description: 'Welcome to the admin dashboard',
      });
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleEdit = (productId: string) => {
    const productToEdit = productList.find((p) => p.id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setShowForm(true);
    }
  };

  const handleDelete = (productId: string) => {
    const updatedProducts = productList.filter((p) => p.id !== productId);
    setProductList(updatedProducts);
    
    // Also update the main products array (in a real app this would be an API call)
    products.length = 0;
    products.push(...updatedProducts);
    
    toast.success('Product deleted', {
      description: 'The product has been removed successfully',
    });
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormSubmit = (newProduct: any) => {
    // If we're editing an existing product
    if (editingProduct) {
      const updatedProducts = productList.map((p) => 
        p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p
      );
      setProductList(updatedProducts);
      
      // Also update the main products array
      products.length = 0;
      products.push(...updatedProducts);
      
      toast.success('Product updated', {
        description: `${newProduct.title} has been updated successfully`,
      });
    } else {
      // For new products - AdminForm handles the adding logic already
      setProductList([...products]);
    }
    
    setShowForm(false);
    setEditingProduct(null);
  };

  if (!isAuthenticated) {
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
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {showForm ? (
          <div className="bg-card rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
            <AdminForm 
              initialValues={editingProduct || undefined} 
              onSubmit={handleFormSubmit}
            />
          </div>
        ) : (
          <div className="flex justify-end mb-6">
            <Button onClick={handleAddNewProduct}>
              Add New Product
            </Button>
          </div>
        )}
        
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Product Management</h2>
          
          {productList.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No products available. Add your first product above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productList.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="max-w-md truncate">{product.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(product.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
