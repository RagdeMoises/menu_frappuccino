import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Plus, Trash2, MessageSquare, MessageSquarePlus } from 'lucide-react';
import { useBackToClose } from '../hooks/useBackToClose';
import { useCartStore } from '../store/cartStore';
import { OrderDetailsModal } from './OrderDetailsModal';

export const CartDrawer = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.150:50009';
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeItem,
    updateNote,
    total
  } = useCartStore();

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const noteInputRef = useRef(null);

  // Cerrar con el botón atrás del móvil
  useBackToClose(isOpen, toggleCart);

  // Cerrar modal de detalles de orden con el botón atrás
  useBackToClose(isOrderModalOpen, () => setIsOrderModalOpen(false));

  useEffect(() => {
    if (editingNoteId && noteInputRef.current) {
      noteInputRef.current.focus();
      // Mover el cursor al final del texto
      noteInputRef.current.selectionStart = noteInputRef.current.value.length;
      noteInputRef.current.selectionEnd = noteInputRef.current.value.length;
    }
  }, [editingNoteId]);

  if (!isOpen) return null;

  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  const handleNoteChange = (itemId, note) => {
    updateNote(itemId, note);
  };

  const handleStartEditNote = (itemId, e) => {
    e.stopPropagation();
    setEditingNoteId(itemId);
  };

  const handleSaveNote = (itemId) => {
    setEditingNoteId(null);
    // Si la nota está vacía, la eliminamos
    const item = items.find(item => item.id === itemId);
    if (item && item.note?.trim() === '') {
      updateNote(itemId, '');
    }
  };

  const handleNoteKeyDown = (e, itemId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveNote(itemId);
    }
    if (e.key === 'Escape') {
      setEditingNoteId(null);
      // Restaurar la nota anterior si se presiona Escape
      const item = items.find(item => item.id === itemId);
      if (noteInputRef.current) {
        noteInputRef.current.value = item.note || '';
      }
    }
  };

  const formatTotal = (amount) => {
    return `${Number(amount).toFixed(amount % 1 === 0 ? 0 : 2)}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Overlay Oscuro */}
        <div
          className="absolute inset-0 bg-black/60 dark:bg-black/80 transition-opacity"
          onClick={toggleCart}
        />

        {/* Contenedor Principal del Drawer */}
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          {/* Panel del Carrito */}
          <div className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col h-full rounded-l-2xl animate-in slide-in-from-right duration-300">

            {/* Header del Carrito */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                🛒 Tu Pedido
              </h2>
              <button
                onClick={toggleCart}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Cerrar carrito"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del Carrito (Lista de Ítems) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    Tu carrito está vacío. ¡Añade algo delicioso!
                  </p>
                  <button
                    onClick={toggleCart}
                    className="px-6 py-3 text-blue-600 dark:text-blue-500 font-bold border border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Volver al Menú
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {items.map((item) => (
                    <li key={item.id} className="py-5 flex items-start gap-4">
                      {/* Imagen con bordes redondeados */}
                      <div className="flex-shrink-0 w-20 h-20 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                        <img
                          src={item.image ? item.image : `${API_URL}/uploads/logo.png`}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight pr-4">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors ml-auto"
                            aria-label="Eliminar ítem"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Categoría y Precio Total del Ítem */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.category}
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                          {formatTotal(item.price * item.quantity)} $
                        </p>

                        {/* Control de Cantidad */}
                        <div className="flex items-center mt-3 justify-between">
                          <div className="inline-flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className={`p-2 rounded-l-xl transition-colors ${item.quantity === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                              disabled={item.quantity === 1}
                              aria-label="Disminuir cantidad"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 font-extrabold text-sm text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 rounded-r-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Botón para añadir/ver nota */}
                          <button
                            onClick={(e) => handleStartEditNote(item.id, e)}
                            className={`ml-3 p-2 rounded-lg transition-all flex items-center gap-1 ${item.note
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            aria-label={item.note ? "Editar nota" : "Añadir nota"}
                          >
                            {item.note ? (
                              <>
                                <MessageSquare size={16} />
                                <span className="text-xs font-medium">Nota</span>
                              </>
                            ) : (
                              <>
                                <MessageSquarePlus size={16} />
                                <span className="text-xs font-medium">Añadir nota</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Campo de nota */}
                        {(editingNoteId === item.id || item.note) && (
                          <div className="mt-3">
                            <div className="relative">
                              {editingNoteId === item.id ? (
                                <>
                                  <textarea
                                    ref={editingNoteId === item.id ? noteInputRef : null}
                                    defaultValue={item.note || ''}
                                    onChange={(e) => handleNoteChange(item.id, e.target.value)}
                                    onBlur={() => handleSaveNote(item.id)}
                                    onKeyDown={(e) => handleNoteKeyDown(e, item.id)}
                                    className="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Escribe una nota...Ej: Sin cebolla, full salsa, etc."
                                    rows="2"
                                    maxLength="100"
                                  />
                                  {/* <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Presiona Enter para guardar, Esc para cancelar
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.note?.length || 0}/200
                                    </span>
                                  </div> */}
                                </>
                              ) : (
                                <div
                                  onClick={(e) => handleStartEditNote(item.id, e)}
                                  className="cursor-pointer"
                                >
                                  <div className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        {/* <div className="flex items-center gap-1 mb-1">
                                          <MessageSquare size={14} className="text-blue-500 dark:text-blue-400" />
                                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                            Nota:
                                          </span>
                                        </div> */}
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                                          {item.note}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                                    Haz clic para editar
                                  </p> */}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer y Botón de Checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-6 sm:px-8 bg-gray-50/70 dark:bg-gray-800/70 sticky bottom-0">
                {/* Total */}
                <div className="flex justify-between text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  <p>Sub Total</p>
                  <p className="text-blue-600 dark:text-blue-400">{formatTotal(total())} $</p>
                </div>

                {/* Nota de Delivery */}
                <p className="mt-0.5 text-lg text-gray-500 dark:text-gray-400 mb-6">
                  El costo del delivery se calculará al confirmar el pedido.
                </p>

                {/* Botón de Ordenar - Estilo Moderno con Degradado */}
                <button
                  onClick={handleOrderClick}
                  className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-lg 
                             text-lg font-extrabold text-white 
                             bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600
                             shadow-blue-500/30 transition-all duration-300 active:scale-[0.98]"
                >
                  Aceptar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOrderModalOpen && (
        <OrderDetailsModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}
    </>
  );
};