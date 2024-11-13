import React, { useState, useEffect } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';
import { SHOP_CATEGORIES } from '../constants/categories';

type Shop = {
  id: string;
  shopName: string;
  category: string;
  houseNumber: string;
  state: string;
  rating?: number;
  services: string;
  reviews?: string[];
};

export default function HomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'shops'));
        const shopsData = querySnapshot.docs.map((doc: DocumentData) => ({
          id: doc.id,
          ...doc.data()
        })) as Shop[];
        setShops(shopsData);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop => {
    const matchesCategory = selectedCategory === 'all' || shop.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.services.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border rounded-lg"
          >
            <option value="all">All Categories</option>
            {SHOP_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Search shops or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading shops...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map(shop => (
            <Link 
              key={shop.id} 
              to={`/shop/${shop.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{shop.shopName}</h3>
                <p className="text-gray-600 mb-2">{shop.category}</p>
                <p className="text-sm text-gray-500 mb-2">{shop.houseNumber}, {shop.state}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Rating: {shop.rating || 'New'}</span>
                  <span>•</span>
                  <span className="ml-2">{shop.reviews?.length || 0} reviews</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
