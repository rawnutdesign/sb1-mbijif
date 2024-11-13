import React from 'react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

export default function CartView() {
  const { cart, removeFromCart, clearCart } = useCart();

  const groupedItems = cart.reduce((groups, item) => {
    if (!groups[item.shopId]) {
      groups[item.shopId] = [];
    }
    groups[item.shopId].push(item);
    return groups;
  }, {});

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    toast.success('Order placed successfully!');
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600">Start shopping to add items to your cart</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      
      {Object.entries(groupedItems).map(([shopId, items]) => (
        <div key={shopId} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Shop ID: {shopId}</h3>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ₹{item.price * item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.shopId)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-xl font-bold">₹{total}</span>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={clearCart}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}