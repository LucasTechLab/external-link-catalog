
import React, { useState } from 'react';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { products, getCategories } from '@/data/products';

const Index: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <ProductGrid 
          products={products} 
          filteredCategory={selectedCategory} 
        />
      </main>
      
      <footer className="py-8 mt-16 bg-muted">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Gilson Feira. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Produtos são vendidos em plataformas externas. Este site é apenas para fins de exibição.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
