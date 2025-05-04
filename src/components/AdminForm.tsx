
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
import { products } from '@/data/products';

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  imageUrl: z.string().url({ message: "Must be a valid URL" }),
  category: z.string().min(1, { message: "Category is required" }),
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
  };
  onSubmit?: (data: FormValues) => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ initialValues, onSubmit }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      description: "",
      imageUrl: "",
      category: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    if (initialValues) {
      // Editing an existing product
      if (onSubmit) {
        onSubmit(data);
      }
    } else {
      // Adding a new product
      const newProduct = {
        id: (products.length + 1).toString(),
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        externalUrl: "", // We'll keep this empty since we removed the field
        category: data.category,
      };
      
      // In a real app with a backend, we'd make an API call here
      // Since we're just using an in-memory array, we'll push to it
      // Note: this won't persist after page refresh
      products.push(newProduct);
      
      toast({
        title: "Product created",
        description: `${data.title} has been added to the catalog`,
      });
      
      if (onSubmit) {
        onSubmit(data);
      } else {
        form.reset();
        // Navigate back to the product list
        navigate("/");
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
