
import { Product } from '../components/ProductCard';

// Default products to use when the database is empty
const defaultProducts: Product[] = [
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

// Initialize products array
export let products: Product[] = [];

// Database setup
const DB_NAME = 'e-commerce-db';
const STORE_NAME = 'products';
const DB_VERSION = 1;

// Open database connection
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Load products from IndexedDB
export const loadProducts = async (): Promise<Product[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        if (request.result.length === 0) {
          // If no products in DB, initialize with default products
          saveInitialProducts().then(() => {
            resolve(defaultProducts);
          }).catch(error => {
            console.error("Error saving initial products:", error);
            resolve(defaultProducts);
          });
        } else {
          resolve(request.result);
        }
      };
      
      request.onerror = () => {
        console.error("Error loading products:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Error opening database:", error);
    return defaultProducts;
  }
};

// Save initial default products to IndexedDB
const saveInitialProducts = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return Promise.all(defaultProducts.map(product => {
      return new Promise<void>((resolve, reject) => {
        const request = store.add(product);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }));
  } catch (error) {
    console.error("Error saving initial products:", error);
    throw error;
  }
};

// Initialize products
(async () => {
  products = await loadProducts();
})();

// Save products to IndexedDB
export const saveProducts = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Clear existing data
    store.clear();
    
    // Add all current products
    products.forEach(product => {
      store.add(product);
    });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error saving products:", error);
    throw error;
  }
};

// Get unique categories
export const getCategories = (): string[] => {
  const categoriesSet = new Set<string>();
  products.forEach(product => {
    categoriesSet.add(product.category);
  });
  return Array.from(categoriesSet);
};

// Add a new product
export const addProduct = async (product: Product): Promise<void> => {
  products.push(product);
  await saveProducts();
};

// Update an existing product
export const updateProduct = async (updatedProduct: Product): Promise<void> => {
  products = products.map(product => 
    product.id === updatedProduct.id ? updatedProduct : product
  );
  await saveProducts();
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  products = products.filter(product => product.id !== productId);
  await saveProducts();
};
