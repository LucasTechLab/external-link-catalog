
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
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
        console.error("Erro ao carregar produtos:", error);
        toast.error("Erro ao carregar produtos");
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
      
      toast.success('Produto excluído', {
        description: 'O produto foi removido com sucesso',
      });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error("Falha ao excluir produto");
    }
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleViewExternalUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error("URL externa não definida para este produto");
    }
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
          externalUrl: newProduct.externalUrl,
          category: newProduct.category,
          price: parseFloat(newProduct.price)
        };
        
        await updateProduct(updatedProduct);
        setProductList(prevProducts => prevProducts.map(p => 
          p.id === updatedProduct.id ? updatedProduct : p
        ));
        
        toast.success('Produto atualizado', {
          description: `${newProduct.title} foi atualizado com sucesso`,
        });
      }
      
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Falha ao atualizar produto");
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
              {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h2>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
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
            Adicionar Novo Produto
          </Button>
        </div>
      )}
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Gerenciamento de Produtos</h2>
        
        {productList.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            Nenhum produto disponível. Adicione seu primeiro produto acima.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Link Externo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>R$ {product.price?.toFixed(2) || '0,00'}</TableCell>
                  <TableCell className="max-w-md truncate">{product.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewExternalUrl(product.externalUrl)}
                      disabled={!product.externalUrl}
                    >
                      <ExternalLink className="h-4 w-4" /> 
                      {product.externalUrl ? 'Ver Produto' : 'Sem link'}
                    </Button>
                  </TableCell>
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
                            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir "{product.title}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
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
