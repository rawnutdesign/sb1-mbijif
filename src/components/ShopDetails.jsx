import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductList from './ProductList';
import AddToCart from './AddToCart';

export default function ShopDetails() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      try {
        // Fetch shop details
        const shopDoc = await getDoc(doc(db, 'shops', shopId));
        if (shopDoc.exists()) {
          setShop({ id: shopDoc.id, ...shopDoc.data() });
        }

        // Fetch shop's products
        const productsSnapshot = await getDocs(collection(db, 'shops', shopId, 'products'));
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching shop details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndProducts();
  }, [shopId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!shop) return <div className="text-center py-8">Shop not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{shop.shopName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-2">{shop.category}</p>
            <p className="text-gray-600 mb-4">{shop.houseNumber}, {shop.state}, {shop.pincode}</p>
            <p className="text-gray-600 mb-2">Contact: {shop.contactNumber}</p>
            <p className="text-gray-600">Email: {shop.email}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Services Offered</h3>
            <p className="text-gray-600">{shop.services}</p>
          </div>
        </div>
      </div>

      <ProductList products={products} shopId={shopId} />
    </div>
  );
}