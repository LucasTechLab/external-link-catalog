
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { products, deleteProduct, updateProduct, loadProducts } from '@/data/products';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const loadedProducts = await loadProducts();
        setProductList(loadedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Error loading products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId: string) => {
    const productToEdit = productList.find((p) => p.id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setShowForm(true);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProductList(productList.filter(p => p.id !== productId));
      
      toast.success('Product deleted', {
        description: 'The product has been removed successfully',
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (newProduct: any) => {
    try {
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
        
        await updateProduct(updatedProduct);
        setProductList(prevProducts => prevProducts.map(p => 
          p.id === updatedProduct.id ? updatedProduct : p
        ));
        
        toast.success('Product updated', {
          description: `${newProduct.title} has been updated successfully`,
        });
      }
      
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
