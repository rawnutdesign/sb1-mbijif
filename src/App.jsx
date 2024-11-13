import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/HomePage';
import ShopRegistrationForm from './components/ShopRegistrationForm';
import ShopDetails from './components/ShopDetails';
import CartView from './components/CartView';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                  Local Shop Directory
                </Link>
                <div className="space-x-4">
                  <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
                  <Link to="/register" className="text-gray-600 hover:text-gray-800">Register Shop</Link>
                  <Link to="/cart" className="text-gray-600 hover:text-gray-800">Cart</Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="container mx-auto py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<ShopRegistrationForm />} />
              <Route path="/shop/:shopId" element={<ShopDetails />} />
              <Route path="/cart" element={<CartView />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </Router>
    </CartProvider>
  );
}

export default App;