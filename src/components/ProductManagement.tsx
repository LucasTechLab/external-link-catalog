
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { products, deleteProduct, updateProduct } from '@/data/products';
import AdminForm from '@/components/AdminForm';
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

interface ProductManagementProps {
  onBack: () => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ onBack }) => {
  const [productList, setProductList] = useState(products);
  const [editingProduct, setEditingProduct] = useState<null | {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    externalUrl: string;
    category: string;
    price?: number;
  }>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (productId: string) => {
    const productToEdit = productList.find((p) => p.id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setShowForm(true);
    }
  };

  const handleDelete = (productId: string) => {
    deleteProduct(productId);
    setProductList([...products]); // Update the local state with the updated products array
    
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
      const updatedProduct = { 
        ...editingProduct,
        title: newProduct.title,
        description: newProduct.description,
        imageUrl: newProduct.imageUrl,
        category: newProduct.category,
        price: parseFloat(newProduct.price)
      };
      
      updateProduct(updatedProduct);
      
      toast.success('Product updated', {
        description: `${newProduct.title} has been updated successfully`,
      });
    }
    
    setProductList([...products]); // Update the local state with the updated products array
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="container py-8">
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
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price?.toFixed(2) || '0.00'}</TableCell>
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
  );
};

export default ProductManagement;
