import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export default function AddToCart({ product, shopId }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      ...product,
      shopId,
      quantity
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="w-20 px-2 py-1 border rounded-md"
      />
      <button
        onClick={handleAddToCart}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}