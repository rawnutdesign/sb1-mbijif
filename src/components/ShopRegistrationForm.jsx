import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import toast from 'react-hot-toast';

const SHOP_CATEGORIES = [
  'Mobile Repair Shops',
  'Kirana & General Stores',
  'Electric Repair Shops',
  'Bookstalls',
  'Fancy Stores',
  'Milk Shops',
  'Bike Repair Shops',
  'Car Repair Shops',
  'Hardware Traders',
  'Mobile Sales Shops',
  'Bakery Shops'
];

const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu']; // Add more
const COUNTRIES = ['India']; // Add more as needed

export default function ShopRegistrationForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Upload documents
      const documentUrls = await Promise.all(
        documents.map(async (file) => {
          const storageRef = ref(storage, `shop-documents/${Date.now()}-${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return getDownloadURL(snapshot.ref);
        })
      );

      // Prepare shop data
      const shopData = {
        ...data,
        documentUrls,
        createdAt: new Date().toISOString(),
        status: 'pending',
        rating: 0,
        reviews: []
      };

      // Save to Firestore
      await addDoc(collection(db, 'shops'), shopData);
      
      toast.success('Shop registered successfully!');
      reset();
      setDocuments([]);
    } catch (error) {
      console.error('Error registering shop:', error);
      toast.error('Failed to register shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shop Registration Form</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Owner Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Owner Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner Name</label>
              <input
                type="text"
                {...register('ownerName', { required: 'Owner name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          </div>
        </div>

        {/* Shop Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Shop Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                type="text"
                {...register('shopName', { required: 'Shop name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.shopName && <p className="text-red-500 text-sm">{errors.shopName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {SHOP_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Services Offered</label>
            <textarea
              {...register('services', { required: 'Services are required' })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="List your services separated by commas"
            />
            {errors.services && <p className="text-red-500 text-sm">{errors.services.message}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">House/Shop Number</label>
              <input
                type="text"
                {...register('houseNumber', { required: 'House/Shop number is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.houseNumber && <p className="text-red-500 text-sm">{errors.houseNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                {...register('pincode', { 
                  required: 'Pincode is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Invalid pincode'
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                {...register('state', { required: 'State is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a state</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <select
                {...register('country', { required: 'Country is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Contact Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="tel"
              {...register('contactNumber', { 
                required: 'Contact number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Invalid phone number'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Documents</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload shop license, ID proof, and other relevant documents
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Shop'}
          </button>
        </div>
      </form>
    </div>
  );
}