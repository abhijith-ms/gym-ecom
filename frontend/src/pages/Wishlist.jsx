import React from 'react';
import { useWishlistStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-500">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-4 flex flex-col hover:shadow-lg">
            <img
              src={item.images[0]?.url || 'https://via.placeholder.com/300'}
              alt={item.name}
              className="w-full h-48 object-cover rounded mb-4 cursor-pointer"
              onClick={() => navigate(`/products/${item._id}`)}
            />
            <h3 className="font-semibold text-lg mb-1 cursor-pointer" onClick={() => navigate(`/products/${item._id}`)}>{item.name}</h3>
            <p className="text-gray-600 mb-2">{item.brand}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xl font-bold">₹{item.price}</span>
              <button
                onClick={() => removeItem(item._id)}
                className="text-scars-red hover:underline text-sm"
              >Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist; 