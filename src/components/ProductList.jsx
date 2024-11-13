import React from 'react';
import AddToCart from './AddToCart';

export default function ProductList({ products, shopId }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Products & Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
            {product.imageUrl && (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-4">₹{product.price}</p>
            <AddToCart product={product} shopId={shopId} />
          </div>
        ))}
      </div>
    </div>
  );
}