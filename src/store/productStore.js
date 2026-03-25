import { create } from 'zustand';

//const API_URL = 'http://192.168.1.197:5000';
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.197:50009';

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_URL}/api/products`);
     
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      //console.log(data);
      // Transform image paths to full URLs if needed, or handle in component
      const productsWithFullUrls = data.map(p => ({
        ...p,
        image: p.image ? `${API_URL}${p.image}` : p.image
      }));
      set({ products: productsWithFullUrls, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
