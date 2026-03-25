// components/CartIcon.jsx
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export function CartIcon() {
  const { items, toggleCart, isOpen } = useCartStore();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
    >
      <ShoppingCart size={28} /> {/* también puedes agrandar el ícono */}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-sm rounded-full h-7 w-7 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
}
