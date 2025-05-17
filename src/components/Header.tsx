
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 md:py-8">
      <div className="container">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Gilson Feira
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl animate-slide-in">
            Navegue pela nossa coleção de produtos artesanais disponíveis em várias plataformas
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
