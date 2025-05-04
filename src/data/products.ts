
import { Product } from '../components/ProductCard';

export const products: Product[] = [
  {
    id: '1',
    title: 'Handcrafted Ceramic Mug',
    description: 'A beautiful handcrafted ceramic mug, perfect for your morning coffee or evening tea. Each piece is unique with slight variations in the glaze.',
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    externalUrl: 'https://etsy.com',
    category: 'Home',
    price: 24.99
  },
  {
    id: '2',
    title: 'Minimalist Desk Lamp',
    description: 'This sleek desk lamp adds a modern touch to any workspace. Features adjustable brightness and color temperature settings.',
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    externalUrl: 'https://amazon.com',
    category: 'Home',
    price: 59.95
  },
  {
    id: '3',
    title: 'Hand-Knitted Wool Scarf',
    description: 'Stay warm and stylish with this premium wool scarf. Hand-knitted with care using sustainable materials.',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    externalUrl: 'https://etsy.com',
    category: 'Accessories',
    price: 34.50
  },
  {
    id: '4',
    title: 'Organic Cotton T-shirt',
    description: 'Comfortable everyday t-shirt made from 100% organic cotton. Available in multiple colors and sizes.',
    imageUrl: 'https://placehold.co/600x600?text=T-Shirt',
    externalUrl: 'https://amazon.com',
    category: 'Clothing',
    price: 19.99
  },
  {
    id: '5',
    title: 'Artisanal Wooden Cutting Board',
    description: 'This handcrafted cutting board is made from sustainably sourced hardwood. Perfect for food preparation or as a serving platter.',
    imageUrl: 'https://placehold.co/600x600?text=Cutting+Board',
    externalUrl: 'https://etsy.com',
    category: 'Kitchen',
    price: 45.00
  },
  {
    id: '6',
    title: 'Digital Art Print',
    description: 'Beautiful digital artwork printed on premium paper. Available in multiple sizes to fit your space perfectly.',
    imageUrl: 'https://placehold.co/600x600?text=Art+Print',
    externalUrl: 'https://gumroad.com',
    category: 'Art',
    price: 29.99
  }
];

export const getCategories = (): string[] => {
  const categoriesSet = new Set<string>();
  products.forEach(product => {
    categoriesSet.add(product.category);
  });
  return Array.from(categoriesSet);
};
