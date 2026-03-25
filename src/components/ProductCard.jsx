import React, { useState, useEffect } from 'react';
import { useBackToClose } from '../hooks/useBackToClose';
import { useCartStore } from '../store/cartStore';
import { Plus, Star, X, Minus, ChevronDown, ChevronUp } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullAdditionalInfo, setShowFullAdditionalInfo] = useState(false);
  const [showActions, setShowActions] = useState(true); // Controla si mostrar cantidad y botón

  const addToCart = useCartStore((state) => state.addItem);
  const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.197:50009';

  // Cerrar con el botón atrás del móvil
  useBackToClose(isModalOpen, () => setIsModalOpen(false));

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Formato de precio
  const formattedPrice = Number.isInteger(parseFloat(product.price))
    ? `${parseFloat(product.price).toFixed(0)}`
    : `${parseFloat(product.price).toFixed(2)}`;

  // Obtener descripción con valor por defecto
  const productDescription = product.description || "Delicioso y fresco. Este producto es preparado con los mejores ingredientes para garantizar una experiencia culinaria excepcional.";

  // const handleAddToCart = () => {
  //   //alert(`Has agregado ${quantity} unidad(es) de "${product.name}" al carrito.`);
  //   addToCart({...product, quantity});
  //   setIsModalOpen(false);
  //   setQuantity(quantity);
  //   setShowActions(true); // Restaurar acciones al cerrar
  // };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: quantity // Asegúrate de pasar la cantidad actual
    });
    // alert(`Has agregado ${quantity} unidad(es) de "${product.name}" al carrito.`);
    setIsModalOpen(false);
    // No llames a setQuantity aquí, déjalo como está
    setShowActions(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setShowActions(true); // Asegurar que acciones estén visibles al abrir
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuantity(1);
    setShowFullDescription(false);
    setShowFullAdditionalInfo(false);
    setShowActions(true);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleToggleDescription = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (isMobile) {
      // En móvil: alternar entre mostrar descripción completa y mostrar acciones
      if (!showFullDescription) {
        // Al expandir: ocultar acciones
        setShowActions(false);
      } else {
        // Al contraer: mostrar acciones
        setShowActions(true);
      }
    }

    setShowFullDescription(!showFullDescription);
  };

  const handleToggleAdditionalInfo = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (isMobile) {
      // En móvil: alternar entre mostrar info adicional completa y mostrar acciones
      if (!showFullAdditionalInfo) {
        // Al expandir: ocultar acciones
        setShowActions(false);
      } else {
        // Al contraer: mostrar acciones
        setShowActions(true);
      }
    }

    setShowFullAdditionalInfo(!showFullAdditionalInfo);
  };

  // Calcular si el texto es largo (más de 150 caracteres)
  const isDescriptionLong = productDescription.length > 150;
  const isAdditionalInfoLong = product.additional_info && product.additional_info.length > 150;

  // Función para hacer scroll al tope en móvil
  const scrollToTop = () => {
    if (isMobile) {
      const contentContainer = document.querySelector('.mobile-modal-content');
      if (contentContainer) {
        contentContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <div
        className="group relative bg-white dark:bg-gray-800 rounded-[2rem] p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer"
        onClick={openModal}
      >

        {/* Contenedor de Imagen */}
        <div className="relative h-48 w-full overflow-hidden rounded-[1.5rem]">
          {/* Badge de Especialidad (Si aplica) */}
          {product.es_especialidad && (
            <div className="absolute top-3 left-3 z-10 text-white">
              <Star size={21} className="fill-yellow-300 text-yellow-400 border-yellow-900" />
            </div>
          )}

          <img
            src={product.image ? product.image : `${API_URL}/uploads/logo.png`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Contenido de la tarjeta */}
        <div className="pt-4 pb-2 px-1">
          {/* Título */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1 truncate">
            {product.name.toUpperCase()}
          </h3>

          {/* Descripción corta */}
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-4 line-clamp-1">
            {productDescription}
          </p>

          {/* Fila inferior: Precio y Botón */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {/* Precio */}
              <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                € {formattedPrice}
              </span>
            </div>

            {/* Botón Circular Negro */}
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:bg-yellow-600 dark:hover:bg-yellow-500 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shadow-gray-200 dark:shadow-none"
              aria-label="Agregar al carrito"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button> */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-20 h-10 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:bg-yellow-600 dark:hover:bg-yellow-500 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shadow-gray-200 dark:shadow-none"
              aria-label="Agregar al carrito"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Modal para detalles del producto - Responsivo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay con blur */}
          <div
            className="absolute inset-0 bg-black"
            onClick={closeModal}
          />

          {/* Contenedor del modal - Responsivo */}
          {isMobile ? (
            // VERSIÓN MÓVIL - Bottom Sheet con nueva funcionalidad
            <div
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl animate-slideUp flex flex-col h-full"
                onClick={(e) => e.stopPropagation()}
              >

                {/* Header del modal con botón de cerrar */}
                <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-t-3xl border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {product.name.toUpperCase()}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeModal();
                    }}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 shadow-lg"
                    aria-label="Cerrar"
                  >
                    <X size={20} className="text-gray-700 dark:text-white" />
                  </button>
                </div>

                {/* Imagen del producto en modal */}
                <div className="relative h-48 w-full flex-shrink-0">
                  <img
                    src={product.image ? product.image : `${API_URL}/uploads/logo.png`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Badge de Especialidad en modal */}
                  {product.es_especialidad && (
                    <div className="absolute top-4 left-4 z-10">
                      <Star size={24} className="fill-yellow-300 text-yellow-400" />
                    </div>
                  )}
                </div>

                {/* Contenido desplazable */}
                <div className="mobile-modal-content flex-1 overflow-y-auto px-6 pt-4 pb-4">
                  {/* Precio fijo */}
                  <div className="mb-4">
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      € {formattedPrice}
                    </span>
                  </div>

                  {/* Descripción completa */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Descripción
                      </h3>
                      {/* Botón Ver más al lado del título */}
                      {isDescriptionLong && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleToggleDescription(e);
                            if (!showFullDescription) {
                              scrollToTop();
                            }
                          }}
                          className="text-yellow-600 dark:text-yellow-400 font-medium text-sm hover:underline focus:outline-none flex items-center gap-1"
                        >
                          {showFullDescription ? (
                            <>
                              <ChevronUp size={16} />
                              Ver menos
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              Ver más
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <div
                        className={`text-gray-600 dark:text-gray-300 leading-relaxed text-sm transition-all duration-300 ${!showFullDescription && isDescriptionLong
                          ? 'max-h-32 overflow-hidden'
                          : ''
                          }`}
                      >
                        <p>{productDescription}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  {product.additional_info && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Información adicional
                        </h3>
                        {/* Botón Ver más al lado del título */}
                        {isAdditionalInfoLong && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleToggleAdditionalInfo(e);
                              if (!showFullAdditionalInfo) {
                                scrollToTop();
                              }
                            }}
                            className="text-yellow-600 dark:text-yellow-400 font-medium text-sm hover:underline focus:outline-none flex items-center gap-1"
                          >
                            {showFullAdditionalInfo ? (
                              <>
                                <ChevronUp size={16} />
                                Ver menos
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                Ver más
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="relative">
                        <div
                          className={`text-gray-600 dark:text-gray-300 leading-relaxed text-sm transition-all duration-300 ${!showFullAdditionalInfo && isAdditionalInfoLong
                            ? 'max-h-32 overflow-hidden'
                            : ''
                            }`}
                        >
                          <p>{product.additional_info}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenedor FIJO para cantidad y botón - SOLO visible cuando showActions es true */}
                {showActions && (

                  <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 pt-4 pb-6">
                    {/* Contador de cantidad */}
                    <div className="flex items-center justify-between mb-4">
                      {/* <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        Cantidad
                      </span> */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            decreaseQuantity();
                          }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${quantity === 1
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          disabled={quantity === 1}
                        >
                          <Minus size={20} />
                        </button>

                        <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[2rem] text-center">
                          {quantity}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            increaseQuantity();
                          }}
                          className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          € {(parseFloat(product.price) * quantity).toFixed(2)}
                        </span>
                      </div>

                    </div>

                    {/* Botón fijo para agregar al carrito */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                      className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors duration-300 shadow-lg"
                    >
                      {/* <Plus size={24} /> */}
                      {/* Agregar {quantity > 1 ? `${quantity} al carrito` : 'al carrito'} - € {(parseFloat(product.price) * quantity).toFixed(2)} */}
                      Agregar al carrito
                    </button>
                  </div>

                )}

                {/* Botón para volver a acciones cuando estamos en modo "ver más" */}
                {!showActions && (
                  <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        // Restaurar acciones y contraer descripción
                        setShowActions(true);
                        if (showFullDescription) setShowFullDescription(false);
                        if (showFullAdditionalInfo) setShowFullAdditionalInfo(false);
                      }}
                      className="w-full py-4 bg-yellow-600 dark:bg-yellow-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors duration-300"
                    >
                      <ChevronUp size={24} />
                      Volver para pedir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // VERSIÓN PC - Modal centrado (sin cambios)
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col md:flex-row h-full">
                  {/* Imagen del producto - Lado izquierdo */}
                  <div className="md:w-1/2 relative">
                    <img
                      src={product.image ? product.image : `${API_URL}/uploads/logo.png`}
                      alt={product.name}
                      className="w-full h-64 md:h-full object-cover"
                    />

                    {/* Badge de Especialidad */}
                    {product.es_especialidad && (
                      <div className="absolute top-4 left-4 z-10">
                        <Star size={28} className="fill-yellow-300 text-yellow-400" />
                      </div>
                    )}

                    {/* Botón de cerrar en PC */}
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg border border-gray-200 dark:border-gray-600"
                      aria-label="Cerrar"
                    >
                      <X size={24} className="text-gray-700 dark:text-white" />
                    </button>
                  </div>

                  {/* Contenido - Lado derecho */}
                  <div className="md:w-1/2 flex flex-col p-6 md:p-2 overflow-y-auto">
                    {/* Nombre del producto */}
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {product.name.toUpperCase()}
                    </h2>

                    {/* Precio */}
                    <div className="mb-6">
                      <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        € {formattedPrice}
                      </span>
                    </div>

                    {/* Descripción completa */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Descripción
                        </h3>
                        {/* Botón Ver más para PC también */}
                        {isDescriptionLong && (
                          <button
                            onClick={handleToggleDescription}
                            className="text-yellow-600 dark:text-yellow-400 font-medium hover:underline focus:outline-none flex items-center gap-1"
                          >
                            {showFullDescription ? (
                              <>
                                <Minus size={18} />
                                Ver menos
                              </>
                            ) : (
                              <>
                                <Plus size={18} />
                                Ver más
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div
                        className={`text-gray-600 dark:text-gray-300 leading-relaxed text-lg transition-all duration-300 ${!showFullDescription && isDescriptionLong
                          ? 'max-h-48 overflow-hidden'
                          : ''
                          }`}
                      >
                        <p>{productDescription}</p>
                      </div>
                    </div>

                    {/* Información adicional */}
                    {product.additional_info && (
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Información adicional
                          </h3>
                          {/* Botón Ver más para PC también */}
                          {isAdditionalInfoLong && (
                            <button
                              onClick={handleToggleAdditionalInfo}
                              className="text-yellow-600 dark:text-yellow-400 font-medium hover:underline focus:outline-none flex items-center gap-1"
                            >
                              {showFullAdditionalInfo ? (
                                <>
                                  <Minus size={18} />
                                  Ver menos
                                </>
                              ) : (
                                <>
                                  <Plus size={18} />
                                  Ver más
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <div
                          className={`text-gray-600 dark:text-gray-300 leading-relaxed text-lg transition-all duration-300 ${!showFullAdditionalInfo && isAdditionalInfoLong
                            ? 'max-h-48 overflow-hidden'
                            : ''
                            }`}
                        >
                          <p>{product.additional_info}</p>
                        </div>
                      </div>
                    )}

                    {/* Contador de cantidad */}
                    <div className="flex items-center justify-between mb-8">
                      {/* <span className="text-xl font-semibold text-gray-900 dark:text-white">
                        Cantidad
                      </span> */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            decreaseQuantity();
                          }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${quantity === 1
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          disabled={quantity === 1}
                        >
                          <Minus size={24} />
                        </button>

                        <span className="text-3xl font-bold text-gray-900 dark:text-white min-w-[3rem] text-center">
                          {quantity}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            increaseQuantity();
                          }}
                          className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          € {(parseFloat(product.price) * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Botón para agregar al carrito - En PC está en el contenido */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                      className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors duration-300 shadow-lg mt-auto"
                    >
                      {/* <Plus size={28} />
                      Agregar {quantity > 1 ? `${quantity} al carrito` : 'al carrito'} - € {(parseFloat(product.price) * quantity).toFixed(2)} */}
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estilos para las animaciones */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-scaleUp {
          animation: scaleUp 0.2s ease-out;
        }
      `}</style>
    </>
  );
};