import { create } from 'zustand';

export const useOrderStore = create(
  (set) => ({
    formData: {
      customerName: '',
      phone: '',
      orderType: 'delivery',
      address: '',
    },
    setFormData: (data) => set((state) => ({ 
      formData: { ...state.formData, ...data } 
    })),
    resetOrder: () => set({
      formData: {
        customerName: '',
        phone: '',
        orderType: 'delivery',
        address: '',
      }
    }),
  })
);
