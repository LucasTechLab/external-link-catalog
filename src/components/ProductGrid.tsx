
import React from 'react';
import ProductCard, { Product } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  filteredCategory: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, filteredCategory }) => {
  const filteredProducts = filteredCategory === 'all' 
    ? products 
    : products.filter(product => product.category === filteredCategory);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <div key={product.id} className="animate-slide-in" style={{
          animationDelay: `${filteredProducts.indexOf(product) * 0.05}s`
        }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
