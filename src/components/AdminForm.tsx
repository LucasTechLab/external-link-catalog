
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addProduct } from '@/data/products';

const formSchema = z.object({
  title: z.string().min(3, { message: "Título deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres" }),
  imageUrl: z.string().url({ message: "A URL da imagem deve ser válida" }),
  externalUrl: z.string().url({ message: "A URL externa deve ser válida" }),
  category: z.string().min(1, { message: "Categoria é obrigatória" }),
  price: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "O preço deve ser um número positivo",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface AdminFormProps {
  initialValues?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    externalUrl: string;
    category: string;
    price?: number;
  };
  onSubmit?: (data: FormValues) => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ initialValues, onSubmit }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ? {
      title: initialValues.title,
      description: initialValues.description,
      imageUrl: initialValues.imageUrl,
      externalUrl: initialValues.externalUrl,
      category: initialValues.category,
      price: initialValues.price?.toString() || "0",
    } : {
      title: "",
      description: "",
      imageUrl: "",
      externalUrl: "",
      category: "",
      price: "0",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    if (initialValues) {
      // Editing an existing product
      if (onSubmit) {
        onSubmit(data);
      }
    } else {
      try {
        // Adding a new product
        const newProduct = {
          id: Date.now().toString(), // Use timestamp for unique ID
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          externalUrl: data.externalUrl,
          category: data.category,
          price: parseFloat(data.price),
        };
        
        // Use the new addProduct function
        await addProduct(newProduct);
        
        toast({
          title: "Produto criado",
          description: `${data.title} foi adicionado ao catálogo`,
        });
        
        if (onSubmit) {
          onSubmit(data);
        } else {
          form.reset();
          // Navigate back to the product list
          navigate("/");
        }
      } catch (error) {
        console.error("Error adding product:", error);
        toast({
          title: "Falha ao adicionar produto",
          description: "Ocorreu um erro ao adicionar o produto",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Caneca Artesanal de Cerâmica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Uma linda caneca artesanal de cerâmica, perfeita para seu café da manhã..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="externalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Produto (link externo)</FormLabel>
              <FormControl>
                <Input placeholder="https://loja.com/produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="29.99" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Input placeholder="Casa, Cozinha, Arte, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">
            {initialValues ? 'Atualizar Produto' : 'Adicionar Produto'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminForm;
