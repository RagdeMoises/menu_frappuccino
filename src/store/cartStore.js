// cartStore.js - Versión corregida
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  
  toggleCart: () => set((state) => ({ 
    isOpen: !state.isOpen 
  })),
  
  // Método para calcular el total
  total: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  addItem: (product) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    
    // Asegurarse de que product.quantity existe y es un número válido
    const quantityToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;
    
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        ),
      };
    }
    return { 
      items: [...state.items, { 
        ...product, 
        quantity: quantityToAdd 
      }] 
    };
  }),

  removeItem: (productId) => set((state) => ({
    items: state.items.filter((item) => item.id !== productId),
  })),

  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity === 0) {
      return {
        items: state.items.filter((item) => item.id !== productId),
      };
    }
    return {
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    };
  }),

  clearCart: () => set({ items: [] }),
  
  updateNote: (itemId, note) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, note } : item
      ),
    }));
  },
}));