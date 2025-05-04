
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  externalUrl: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="h-full overflow-hidden group transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="relative overflow-hidden w-full pt-[100%]">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold line-clamp-1">{product.title}</h3>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-catalog-primary hover:bg-catalog-primary/90 transition-all duration-300 gap-2"
          onClick={() => window.open(product.externalUrl, '_blank')}
        >
          View Product <ExternalLink size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
