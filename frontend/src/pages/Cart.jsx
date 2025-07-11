import React from 'react';
import { useCartStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-500">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <div className="flex flex-col gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center border-b pb-4 gap-4">
            <img
              src={item.product.images[0]?.url || 'https://via.placeholder.com/100'}
              alt={item.product.name}
              className="w-20 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Size: {item.size} | Color: {item.color}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                  className="px-2 py-1 border rounded"
                  disabled={item.quantity <= 1}
                >-</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                  disabled={item.quantity >= item.product.stock}
                >+</button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg mb-2">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => removeItem(item.product._id, item.size, item.color)}
                className="text-red-600 hover:underline text-sm"
              >Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8 border-t pt-6">
        <span className="text-xl font-bold">Total:</span>
        <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
      </div>
      <div className="mt-8 text-right">
        <button
          onClick={() => navigate('/checkout')}
          className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart; 