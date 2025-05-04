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
import { toast } from '@/components/ui/sonner';

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  imageUrl: z.string().url({ message: "Must be a valid URL" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be a positive number",
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
  const { toast: hookToast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ? {
      title: initialValues.title,
      description: initialValues.description,
      imageUrl: initialValues.imageUrl,
      category: initialValues.category,
      price: initialValues.price?.toString() || "0",
    } : {
      title: "",
      description: "",
      imageUrl: "",
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
          externalUrl: "", // We'll keep this empty since we removed the field
          category: data.category,
          price: parseFloat(data.price),
        };
        
        // Use the new addProduct function
        await addProduct(newProduct);
        
        // Fix: Change toast with object literal to toast function call with correct parameters
        toast("Product created", {
          description: `${data.title} has been added to the catalog`,
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
        toast("Failed to add product", { 
          description: "There was an error adding the product",
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
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input placeholder="Handcrafted Ceramic Mug" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A beautiful handcrafted ceramic mug, perfect for your morning coffee..." 
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
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
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
              <FormLabel>Price ($)</FormLabel>
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
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Home, Kitchen, Art, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">
            {initialValues ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminForm;
