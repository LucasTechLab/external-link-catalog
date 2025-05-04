
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 md:py-8">
      <div className="container">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Product Showcase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl animate-slide-in">
            Browse our collection of handcrafted products available on various platforms
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
