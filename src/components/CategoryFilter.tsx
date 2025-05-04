
import React from 'react';
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-center mb-8">
      <Button
        variant={selectedCategory === 'all' ? "default" : "outline"}
        className={`rounded-full ${selectedCategory === 'all' ? 'bg-catalog-primary' : ''}`}
        onClick={() => onSelectCategory('all')}
      >
        All Products
      </Button>
      
      {categories.map(category => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className={`rounded-full ${selectedCategory === category ? 'bg-catalog-primary' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
