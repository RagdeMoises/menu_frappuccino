import React, { useState } from 'react';
import { X, MapPin, ShoppingBag } from 'lucide-react'; // Añadimos iconos
import { useBackToClose } from '../hooks/useBackToClose';
import { useOrderStore } from '../store/orderStore';
import { PaymentModal } from './PaymentModal';

export const OrderDetailsModal = ({ isOpen, onClose }) => {
  const { formData, setFormData } = useOrderStore();
  const [showPayment, setShowPayment] = useState(false);

  // Al presionar atrás cuando se muestra el pago, volver al formulario de detalles
  useBackToClose(showPayment, () => setShowPayment(false));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handleTypeChange = (type) => {
    setFormData({
      orderType: type,
      // Opcional: Limpiar la dirección si cambia a pickup
      address: type === 'pickup' ? '' : formData.address
    });
  };

  // Estilo de inputs unificado
  const inputClass = "mt-2 block w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm py-3 px-4 text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 placeholder-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      {/* Overlay Oscuro */}
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black" onClick={onClose}></div>
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Contenedor del Modal con Bordes Redondeados Modernos */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-100 dark:border-gray-800">

          {showPayment ? (
            <PaymentModal
              isOpen={true}
              onClose={() => {
                setShowPayment(false);
                onClose();
              }}
              orderDetails={formData}
              onBack={() => setShowPayment(false)}
            />
          ) : (
            <>
              {/* Header y Título */}
              <div className="px-6 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Detalles de la Orden
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Cuerpo del Formulario */}
              <div className="px-6 py-6">
                <form id="order-form" onSubmit={handleSubmit} className="space-y-6">

                  {/* Nombre */}
                  <div>
                    <label htmlFor="name" className={labelClass}>Nombre *</label>
                    <input
                      type="text"
                      id="name"
                      required
                      className={inputClass}
                      placeholder="Tu nombre"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ customerName: e.target.value })}
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className={inputClass}
                      placeholder="Ej: 04123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ phone: e.target.value })}
                    />
                  </div>

                  {/* Selector de Tipo de Pedido (Segmented Control - Diseño Móvil) */}
                  <div>
                    <label className={labelClass}>Tipo de Pedido</label>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex space-x-1 shadow-inner">
                      {/* Botón Delivery */}
                      <button
                        type="button"
                        onClick={() => handleTypeChange('delivery')}
                        className={`flex-1 py-3 rounded-xl text-center font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${formData.orderType === 'delivery'
                          ? 'bg-white dark:bg-gray-900 shadow-md text-gray-900 dark:text-white ring-2 ring-yellow-500/50'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                      >
                        <MapPin size={20} /> Delivery
                      </button>

                      {/* Botón Pickup */}
                      <button
                        type="button"
                        onClick={() => handleTypeChange('pickup')}
                        className={`flex-1 py-3 rounded-xl text-center font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${formData.orderType === 'pickup'
                          ? 'bg-white dark:bg-gray-900 shadow-md text-gray-900 dark:text-white ring-2 ring-yellow-500/50'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                      >
                        <ShoppingBag size={20} /> Pickup
                      </button>
                    </div>
                  </div>

                  {/* Dirección (Solo si es Delivery) */}
                  {formData.orderType === 'delivery' && (
                    <div>
                      <label htmlFor="address" className={labelClass}>Dirección Corta *</label>
                      <textarea
                        id="address"
                        required
                        rows={3}
                        className={inputClass}
                        placeholder="Sector, Calle y detalles de entrega."
                        value={formData.address}
                        onChange={(e) => setFormData({ address: e.target.value })}
                      />
                    </div>
                  )}
                </form>
              </div>

              {/* Footer y Botones de Acción */}
              <div className="bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4 sm:flex sm:flex-row-reverse border-t border-gray-100 dark:border-gray-700">
                {/* Botón Principal (Continuar al Pago) con Degradado */}
                <button
                  type="submit"
                  form="order-form"
                  className="w-full inline-flex justify-center items-center rounded-xl shadow-lg px-6 py-3 
                             bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600
                             text-lg font-extrabold text-white 
                             shadow-yellow-500/30 transition-all duration-300 active:scale-[0.98] sm:ml-3 sm:w-auto"
                >
                  Continuar al Pago
                </button>

                {/* Botón Secundario (Cancelar) */}
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-3 
                             bg-white dark:bg-gray-700 text-base font-semibold text-gray-700 dark:text-gray-300 
                             hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};