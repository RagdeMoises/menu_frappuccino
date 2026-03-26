import React, { useState } from 'react';
import { X, ArrowLeft, Smartphone, Banknote, DollarSign, CreditCard, Loader2, CheckCircle, Check, AlertCircle, Copy, Clock } from 'lucide-react';
import { useBackToClose } from '../hooks/useBackToClose';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
//import { WhatsAppButton } from "../components/WhatsAppButton";
import { useWhatsApp } from "../hooks/useWhatsApp";
import { useUIStore } from '../store/uiStore';

// Componente Modal de Confirmación
const OrderConfirmationModal = ({
  isOpen,
  orderId,
  orderNumber,
  customerName,
  totalAmount,
  paymentMethod,
  orderType,
  address,
  items,
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  // Mapeo de métodos de pago para mostrar en el modal
  const paymentMethodMap = {
    PagoMovil: { label: "PAGO MÓVIL", color: "text-blue-600 dark:text-blue-400" },
    BsEfectivo: { label: "EFECTIVO BS", color: "text-green-600 dark:text-green-400" },
    Mixto: { label: "MIXTO", color: "text-purple-600 dark:text-purple-400" },
    $Efectivo: { label: "DIVISAS", color: "text-blue-600 dark:text-blue-400" },
    PuntoVenta: { label: "PUNTO DE VENTA", color: "text-indigo-600 dark:text-indigo-400" }
  };

  const paymentInfo = paymentMethodMap[paymentMethod] || { label: "DESCONOCIDO", color: "text-gray-600 dark:text-gray-400" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Registro exitoso
            </h3>
            {/* <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button> */}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Información Principal */}
            <div className="grid grid-cols-1 gap-4">
              {/* Número de Pedido */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  ID Pedido
                </p>
                <p className="text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  #{orderNumber}
                </p>
              </div>

              {/* Total */}
              {/* <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Sub Total (sin delivery)
                </p>
                <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">
                  ${Number(totalAmount).toFixed(2)}
                </p>
              </div> */}
            </div>
            <div className="flex items-start">
              <Smartphone className="text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" size={24} />
              <div>

                <p className="text-base text-gray-700 dark:text-gray-300 mb-3">
                  Para procesar tu orden, por favor contacta directamente por Whatsaap e indica el número de tu pedido.
                </p>

                {/* <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Menciona tu número de pedido:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-lg font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                        #{recentOrder.orderNumber}
                      </code>
                      <button
                        onClick={() => copyToClipboard(`#${recentOrder.orderNumber}`)}
                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Copy size={14} />
                        Copiar
                      </button>
                    </div>
                  </div> */}

                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Teléfono:
                  </span>
                  <p className="text-2xl text-gray-500 dark:text-gray-400 mb-1">0424-999999</p>

                  {/* <a 
                      href="tel:+584241496884"
                      className="text-lg font-bold text-green-600 dark:text-green-400 hover:underline"
                    >
                      +58 424 1496884
                    </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con Botones de Acción */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              className="w-full inline-flex justify-center items-center rounded-xl shadow-lg px-6 py-4 
                       text-lg font-extrabold text-white 
                       bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                       transition-all duration-300 active:scale-[0.98]"
              aria-label="Confirmar y enviar a WhatsApp"
            >
              <Check className="mr-2" size={20} />
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Modal para Pedido Reciente
const RecentOrderModal = ({
  isOpen,
  onClose,
  recentOrder,
  //onContactWhatsApp 
}) => {
  if (!isOpen) return null;

  // const copyToClipboard = (text) => {
  //   navigator.clipboard.writeText(text).then(() => {
  //     alert('¡Número de pedido copiado al portapapeles!');
  //   }).catch(err => {
  //     console.error('Error al copiar: ', err);
  //   });
  // };

  // const formatTimeAgo = (minutes) => {
  //   if (minutes === 0) return 'hace unos segundos';
  //   if (minutes === 1) return 'hace 1 minuto';
  //   return `hace ${minutes} minutos`;
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        {/* <div className="p-6 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              ⚠️ Pedido Ya Realizado
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>
        </div> */}

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Alerta Principal */}
            <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-start">
                <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" size={24} />
                <div>
                  <p className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                    ¡Ya tienes un pedido en proceso!
                  </p>
                  {/* <p className="text-base text-red-700 dark:text-red-400">
                    Has realizado un pedido recientemente. Por políticas de seguridad, debes esperar al menos 3 minutos entre pedidos.
                  </p> */}
                </div>
              </div>
            </div>

            {/* Información del Pedido Reciente */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
              {/* <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300">
                  📋 Información de tu Pedido Actual
                </h4>
                <button
                  onClick={() => copyToClipboard(`#${recentOrder.orderNumber}`)}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <Copy size={14} />
                  Copiar
                </button>
              </div> */}

              <div className="space-y-4">
                {/* Número de Pedido */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 dark:text-blue-300 font-bold">#</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Pedido Online</p>
                      <p className="text-6xl font-extrabold text-gray-900 dark:text-white">
                        {recentOrder.orderNumber}
                      </p>
                      <div>
                        <p className="text-md text-gray-500 dark:text-white">
                          {new Date(recentOrder.datecreate).toLocaleDateString()} {/* Fecha */}
                        </p>
                        <p className="text-md text-gray-500 dark:text-white">
                          {new Date(recentOrder.datecreate).toLocaleTimeString()} {/* Hora */}
                        </p>
                      </div>
                      <div>
                        <p className="text-md  text-gray-500 dark:text-white">
                          {recentOrder.customername}
                        </p>

                      </div>
                      <div>
                        <p className="text-md  text-gray-500 dark:text-white">
                          {recentOrder.phone}
                        </p>

                      </div>
                    </div>
                  </div>
                  {/* <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Creado</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <Clock size={14} />
                      {formatTimeAgo(recentOrder.createdMinutesAgo)}
                    </div>
                  </div> */}
                </div>

                {/* Estado del Pedido */}
                {/* <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado Actual</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {recentOrder.orderStatus || 'Pendiente'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    recentOrder.orderStatus === 'Pendiente' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : recentOrder.orderStatus === 'Procesando'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {recentOrder.orderStatus || 'PENDIENTE'}
                  </div>
                </div> */}

                {/* Información de Tiempo de Espera */}
                {/* <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="text-blue-600 dark:text-blue-400 mr-2" size={18} />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        ⏱️ Tiempo de espera restante
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Puedes realizar otro pedido en {3 - recentOrder.createdMinutesAgo} minutos
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Instrucciones de Contacto */}
            <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-start">
                <Smartphone className="text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    ¿Necesitas ayuda con tu pedido?
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-300 mb-3">
                    contacta directamente por Whatsaap a Tomy Burguer.
                  </p>

                  {/* <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Menciona tu número de pedido:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-lg font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                        #{recentOrder.orderNumber}
                      </code>
                      <button
                        onClick={() => copyToClipboard(`#${recentOrder.orderNumber}`)}
                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Copy size={14} />
                        Copiar
                      </button>
                    </div>
                  </div> */}

                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Teléfono:
                    </span>
                    <p className="text-2xl text-gray-500 dark:text-gray-400 mb-1">0424-999999</p>
                    {/* <a 
                      href="tel:+584241496884"
                      className="text-lg font-bold text-green-600 dark:text-green-400 hover:underline"
                    >
                      +58 424 1496884
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-3">
            {/* <button
              onClick={() => onContactWhatsApp(recentOrder.orderNumber)}
              className="w-full inline-flex justify-center items-center rounded-xl shadow-lg px-6 py-4 
                       text-lg font-extrabold text-white 
                       bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                       transition-all duration-300 active:scale-[0.98]"
            >
              <Smartphone className="mr-2" size={20} />
              Contactar por WhatsApp
            </button> */}

            <button
              onClick={onClose}
              className="w-full inline-flex justify-center items-center rounded-xl border border-gray-300 dark:border-gray-600 
                       px-6 py-4 bg-white dark:bg-gray-700 
                       text-lg font-semibold text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Entendido, cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PaymentModal = ({ isOpen, onClose, orderDetails, onBack }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.197:50009';
  const [paymentMethod, setPaymentMethod] = useState('PagoMovil');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRecentOrderModal, setShowRecentOrderModal] = useState(false);
  const [recentOrderInfo, setRecentOrderInfo] = useState(null);
  const [pendingOrderData, setPendingOrderData] = useState(null);
  const { items, total, clearCart, toggleCart } = useCartStore();
  const { openWhatsApp } = useWhatsApp();
  const { resetOrder } = useOrderStore();
  const { setShowSplash } = useUIStore();

  // Cerrar confirmación con el botón atrás (no recomendado si ya se registró, pero para UX de atrás)
  useBackToClose(showConfirmation, () => setShowConfirmation(false));

  // Cerrar aviso de pedido reciente con botón atrás
  useBackToClose(showRecentOrderModal, () => {
    setShowRecentOrderModal(false);
    setRecentOrderInfo(null);
  });

  if (!isOpen) return null;

  // Función para formatear el total
  const formatTotal = (amount) => {
    return Number(amount).toFixed(amount % 1 === 0 ? 0 : 2);
  };

  const handleOpenConfirmation = async () => {

    setIsSubmitting(true);
    //alert('aaaaa');
    try {
      // 1. Guardar en la base de datos PRIMERO
      //console.log('Enviando datos de la orden al backend...'+orderDetails.not);
      const orderData = {
        customername: orderDetails.customerName,
        phone: orderDetails.phone,
        servicetype: orderDetails.orderType,
        address: orderDetails.address || '',
        observations: orderDetails.address || '',
        totalfaltante: total().toFixed(2),
        paymentmethod: paymentMethod,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          note: item.note || '',
          quantity: item.quantity,
          identificador: item.identificador || '',
          category: item.category || 'general'
        }))
      };
      //console.log('Datos de la orden--------------:', orderData);

      // Enviar orden al backend
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const responseData = await response.json();
      //console.log(responseData);
      if (!response.ok) {
        // Si es error 429 (demasiadas solicitudes), mostrar modal especial
        if (response.status === 429) {
          // Guardar información del pedido reciente
          setRecentOrderInfo({
            orderNumber: responseData.details?.orderNumber || 'N/A',
            orderId: responseData.details?.orderId,
            datecreate: responseData.details?.datecreate,
            customername: responseData.details?.customername,
            phone: responseData.details?.phone,
            createdMinutesAgo: responseData.details?.createdMinutesAgo || 0,
            maxWaitMinutes: responseData.details?.maxWaitMinutes || 3,
            orderStatus: 'Pendiente', // Podrías obtener esto del backend si está disponible
            message: responseData.details?.message || 'Ya has creado un pedido recientemente.'
          });
          setShowRecentOrderModal(true);
          return;
        }
        throw new Error(responseData.message || 'Error al guardar la orden');
      }

      // 2. Guardar datos para mostrar en el modal de confirmación
      setPendingOrderData({
        orderId: responseData.idorder,
        orderNumber: responseData.ordernumber,
        customerName: orderDetails.customerName,
        phone: orderDetails.phone,
        totalAmount: total().toFixed(2),
        paymentMethod: paymentMethod,
        orderType: orderDetails.orderType,
        address: orderDetails.address || '',
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          identificador: item.identificador || ''
        })),
        rawOrderData: responseData
      });

      // 3. Mostrar modal de confirmación
      setShowConfirmation(true);

    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar tu orden. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleFinalConfirm = () => {
  //   if (!pendingOrderData) return;

  // Preparar mensaje de WhatsApp
  //const phoneNumber = '+584241496884';
  // const phoneNumber = '+584127191141';

  // // Construir mensaje con saltos de línea normales
  // let messageParts = [];

  // messageParts.push(`👋 *¡Hola amigos de Tommy Burguer!*`);
  // messageParts.push(``);
  // messageParts.push(`*NUEVO PEDIDO*`);
  // messageParts.push(``);
  // messageParts.push(`*Pedido Online:* ${pendingOrderData.orderNumber}`);
  // messageParts.push(`*Cliente:* ${pendingOrderData.customerName}`);

  // if (pendingOrderData.phone && pendingOrderData.phone.trim() !== '') {
  //   messageParts.push(`*Teléfono:* ${pendingOrderData.phone}`);
  // } else {
  //   messageParts.push(`*Teléfono:* [SIN ESPECIFICAR]`);
  // }

  // messageParts.push(`*Tipo:* ${pendingOrderData.orderType.toUpperCase()}`);

  // if (pendingOrderData.orderType === 'delivery') {
  //   messageParts.push(`*Dirección:* ${pendingOrderData.address}`);
  // }

  // messageParts.push(``);
  // messageParts.push(`*Pedido:*`);

  // const itemsList = pendingOrderData.items.map(item => 
  //   `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`
  // ).join('\n');
  // messageParts.push(itemsList);

  // messageParts.push(``);

  // if (pendingOrderData.orderType === 'delivery') {
  //   messageParts.push(`*🚨 ATENCIÓN - COSTO DE DELIVERY PENDIENTE:*`);
  //   messageParts.push(`El costo de envío será calculado y notificado por esta vía. El total mostrado NO incluye el delivery.`);
  //   messageParts.push(``);
  // }

  // messageParts.push(`*Sub Total:* $${pendingOrderData.totalAmount}`);

  // const paymentMethodMap = {
  //   PagoMovil: "PAGO MÓVIL",
  //   BsEfectivo: "EFECTIVO BS",
  //   Mixto: "MIXTO",
  //   $Efectivo: "DIVISAS",
  //   PuntoVenta: "PUNTO DE VENTA",
  // };

  // const paymentMethodText = paymentMethodMap[pendingOrderData.paymentMethod] || "DESCONOCIDO";
  // messageParts.push(`*Método de Pago:* ${paymentMethodText}`);

  // if (pendingOrderData.paymentMethod === 'PagoMovil') {
  //   messageParts.push(``);
  //   messageParts.push(`Por favor envíenme el monto total y los datos para realizar el Pago Móvil.`);
  // }

  // messageParts.push(``);
  // messageParts.push(`✅ *Gracias. Quedo atento a su confirmación.*`);

  // // Unir todas las partes con saltos de línea normales
  // const message = messageParts.join('\n');

  // const handleClick = () => {
  //   openWhatsApp({
  //     phone: phoneNumber,
  //     message,
  //     onFail: () => alert("No se pudo abrir WhatsApp")
  //   });
  // };

  //handleClick();

  // Limpiar carrito y cerrar modales
  //   clearCart();
  //   toggleCart();
  //   setShowConfirmation(false);
  //   onClose();
  // };

  const handleFinalConfirm = () => {
    if (!pendingOrderData) return;
    clearCart();
    resetOrder();
    toggleCart();
    setShowConfirmation(false);
    onClose();
    setShowSplash(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setPendingOrderData(null);
    // window.location.href = '/';
  };

  // const handleContactWhatsApp = (orderNumber) => {
  //   const phoneNumber = '+584241496884';
  //   const message = `Hola Tomy Burguer, tengo una consulta sobre mi pedido #${orderNumber}.`;

  //   // openWhatsApp({
  //   //   phone: phoneNumber,
  //   //   message,
  //   //   onFail: () => alert("No se pudo abrir WhatsApp")
  //   // });

  //   setShowRecentOrderModal(false);
  //   onClose();
  // };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'PagoMovil': return { label: 'Pago Móvil', icon: Smartphone, description: '' };
      case 'PuntoVenta': return { label: 'Punto de Venta', icon: CreditCard, description: '' };
      case 'BsEfectivo': return { label: 'Efectivo (Bolívares)', icon: Banknote, description: '' };
      case '$Efectivo': return { label: 'Divisas (Dólares/Euros)', icon: DollarSign, description: '' };
      case 'Mixto': return { label: 'Mixto', icon: Banknote, description: 'Combina varios métodos (ej: divisas + pago móvil).' };
      default: return { label: method, icon: Banknote, description: '' };
    }
  };

  return (
    <>
      {/* Modal de Pago (se muestra primero) */}
      <div className="bg-white dark:bg-gray-900 px-6 pt-6 pb-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2"
              disabled={isSubmitting}
              aria-label="Volver a los detalles"
            >
              <ArrowLeft size={20} />
            </button>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Selecciona tu Pago
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            disabled={isSubmitting}
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Total a Pagar (Destacado) */}
          <div className="flex justify-between items-center bg-blue-50 dark:bg-gray-800 p-4 rounded-xl border border-blue-200 dark:border-gray-700">
            <p className="text-lg font-bold text-gray-900 dark:text-white">Sub Total a Pagar:</p>
            <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {formatTotal(total())} $
            </p>
          </div>

          {/* Lista de Métodos de Pago */}
          <div className="grid grid-cols-1 gap-3">
            {['PagoMovil', '$Efectivo', 'Mixto', 'BsEfectivo',
              ...(orderDetails.orderType !== 'delivery' ? ['PuntoVenta'] : [])
            ].map((method) => {
              const { label, icon: Icon, description } = getPaymentMethodLabel(method);
              const isSelected = paymentMethod === method;
              return (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  disabled={isSubmitting}
                  className={`flex items-center p-4 border rounded-xl transition-all duration-200 text-left ${isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-gray-800 ring-2 ring-blue-500/50 shadow-md shadow-blue-100 dark:shadow-none'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-200 dark:hover:border-blue-500/50'
                    } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className={`flex-shrink-0 p-3 rounded-xl ${isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                    <Icon size={24} />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className={`font-extrabold text-base ${isSelected
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-900 dark:text-white'
                      }`}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle size={20} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer y Botón de Confirmación */}
        <div className="mt-8 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4 -mx-6 rounded-b-3xl border-t border-gray-100 dark:border-gray-700 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            onClick={handleOpenConfirmation}
            disabled={isSubmitting}
            className={`w-full inline-flex justify-center items-center rounded-xl shadow-lg px-6 py-3 
                       text-lg font-extrabold text-white 
                       transition-all duration-300 active:scale-[0.98] sm:ml-3 sm:w-auto
                       ${isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/30'
              }`}
            aria-label="Verificar y proceder"
          >
            {isSubmitting ? (
              <><Loader2 size={20} className="animate-spin mr-2" /> Procesando...</>
            ) : (
              <>Confirmar Pedido</>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-3 
                       bg-white dark:bg-gray-700 text-base font-semibold text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors sm:mt-0 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Cancelar pedido"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal de Confirmación (se muestra ANTES de WhatsApp) */}
      {pendingOrderData && (
        <OrderConfirmationModal
          isOpen={showConfirmation}
          orderId={pendingOrderData.orderId}
          orderNumber={pendingOrderData.orderNumber}
          customerName={pendingOrderData.customerName}
          totalAmount={pendingOrderData.totalAmount}
          paymentMethod={pendingOrderData.paymentMethod}
          orderType={pendingOrderData.orderType}
          address={pendingOrderData.address}
          items={pendingOrderData.items}
          onConfirm={handleFinalConfirm}
          onClose={handleConfirmationClose}
        />
      )}

      {/* Modal para pedido reciente */}
      {recentOrderInfo && (
        <RecentOrderModal
          isOpen={showRecentOrderModal}
          onClose={() => {
            setShowRecentOrderModal(false);
            setRecentOrderInfo(null);
            setShowSplash(true);
          }}
          recentOrder={recentOrderInfo}
        //onContactWhatsApp={handleContactWhatsApp}
        />
      )}
    </>
  );
};
