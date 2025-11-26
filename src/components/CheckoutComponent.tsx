import React, { useState } from 'react';
import { useTikTokPixel } from '../hooks/useTikTokPixel';
import { ProductItem, CheckoutEventData } from '../types/tiktok-pixel';

// Datos de ejemplo de productos
const sampleProducts: ProductItem[] = [
  {
    item_id: 'PROD-001',
    item_name: 'Smartphone Pro Max',
    item_category: 'Electronics',
    item_category2: 'Mobile Phones',
    price: 999.99,
    quantity: 1
  },
  {
    item_id: 'PROD-002',
    item_name: 'Wireless Headphones',
    item_category: 'Electronics',
    item_category2: 'Audio Accessories',
    price: 199.99,
    quantity: 2
  }
];

export const CheckoutComponent: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [selectedProducts] = useState<ProductItem[]>(sampleProducts);

  // Configuración del Pixel de TikTok - Using the correct Pixel ID from your script
  const { trackPurchase, trackInitiateCheckout, trackAddToCart, isInitialized } = useTikTokPixel({
    pixelId: 'D4JHOSBC77UBCCH9DR1G', // Your actual TikTok Pixel ID
    testMode: false // Set to false for production use
  });

  // Calcular total de la compra
  const calculateTotal = (): number => {
    return selectedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  // Manejar evento de añadir al carrito
  const handleAddToCart = (product: ProductItem) => {
    const trackingData = {
      content_identifier: product.item_id,        // = item_id
      content_type: product.item_category,        // = item_category
      content_name: product.item_name,            // = item_name
      content_category: product.item_category2,   // = item_category2
      value: product.price * product.quantity,
      currency: 'USD',
      contents: [product]
    };

    trackAddToCart(trackingData);
    console.log('🛒 Producto añadido al carrito:', product.item_name);
  };

  // Manejar inicio del checkout
  const handleInitiateCheckout = () => {
    const totalAmount = calculateTotal();
    const mainProduct = selectedProducts[0]; // Producto principal para el tracking

    const checkoutData = {
      content_identifier: mainProduct.item_id,
      content_type: mainProduct.item_category,
      content_name: mainProduct.item_name,
      content_category: mainProduct.item_category2,
      value: totalAmount,
      currency: 'USD',
      contents: selectedProducts
    };

    trackInitiateCheckout(checkoutData);
    console.log('🛍️ Checkout iniciado, total:', totalAmount);
  };

  // ✨ FUNCIÓN PRINCIPAL: Manejar confirmación de compra
  const handlePurchaseConfirmation = async () => {

    setIsProcessing(true);

    try {
      // Simular proceso de compra
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderId = `ORDER-${Date.now()}`;
      const totalAmount = calculateTotal();
      const mainProduct = selectedProducts[0];

      // 🎯 IMPLEMENTACIÓN DEL TRACKING DE COMPRA SEGÚN ESPECIFICACIONES
      const checkoutEventData: CheckoutEventData = {
        content_identifier: mainProduct.item_id,        // = item_id
        content_type: mainProduct.item_category,        // = item_category  
        content_name: mainProduct.item_name,            // = item_name
        content_category: mainProduct.item_category2,   // = item_category2
        value: totalAmount,
        currency: 'USD',
        contents: selectedProducts,
        order_id: orderId,
        total_amount: totalAmount
      };

      // 🚀 ENVIAR EVENTO DE COMPRA COMPLETADA A TIKTOK PIXEL
      trackPurchase(checkoutEventData);

      setPurchaseComplete(true);
      console.log('✅ Compra completada exitosamente!');
      console.log('📋 Datos enviados a TikTok Pixel:', checkoutEventData);

    } catch (error) {
      console.error('❌ Error durante la compra:', error);
      alert('Error durante el proceso de compra');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>🛒 Checkout con TikTok Pixel</h1>
        <div className="pixel-status">
          Status del Pixel: {isInitialized ? '✅ Activo' : '❌ Inactivo'}
        </div>
      </div>

      <div className="products-section">
        <h2>Productos en tu carrito:</h2>
        {selectedProducts.map((product) => (
          <div key={product.item_id} className="product-card">
            <div className="product-info">
              <h3>{product.item_name}</h3>
              <p><strong>ID:</strong> {product.item_id}</p>
              <p><strong>Categoría:</strong> {product.item_category}</p>
              <p><strong>Subcategoría:</strong> {product.item_category2}</p>
              <p><strong>Precio:</strong> ${product.price}</p>
              <p><strong>Cantidad:</strong> {product.quantity}</p>
            </div>
            <button 
              onClick={() => handleAddToCart(product)}
              className="add-to-cart-btn"
            >
              Añadir al Carrito
            </button>
          </div>
        ))}
      </div>

      <div className="checkout-summary">
        <h2>Resumen de Compra</h2>
        <div className="total-amount">
          <strong>Total: ${calculateTotal().toFixed(2)}</strong>
        </div>
        
        <div className="checkout-buttons">
          <button 
            onClick={handleInitiateCheckout}
            className="initiate-checkout-btn"
            disabled={isProcessing}
          >
            Iniciar Checkout
          </button>

          {/* 🎯 BOTÓN PRINCIPAL DE COMPRA CON PIXEL DE TIKTOK */}
          <button 
            onClick={handlePurchaseConfirmation}
            className="purchase-btn"
            disabled={isProcessing || purchaseComplete}
          >
            {isProcessing ? '⏳ Procesando...' : purchaseComplete ? '✅ Compra Completada' : '🚀 Confirmar Compra'}
          </button>
        </div>
      </div>

      {purchaseComplete && (
        <div className="success-message">
          <h2>🎉 ¡Compra Exitosa!</h2>
          <p>Tu pedido ha sido procesado y los datos han sido enviados al TikTok Pixel.</p>
          <p>Revisa la consola del navegador para ver los detalles del tracking.</p>
        </div>
      )}

      <div className="tracking-info">
        <h3>📊 Información de Tracking</h3>
        <p>Este componente implementa el Pixel de TikTok con los siguientes mapeos:</p>
        <ul>
          <li><strong>content_identifier</strong> = item_id</li>
          <li><strong>content_type</strong> = item_category</li>
          <li><strong>content_name</strong> = item_name</li>
          <li><strong>content_category</strong> = item_category2</li>
        </ul>
      </div>
    </div>
  );
};