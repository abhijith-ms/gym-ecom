import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCartStore, useWishlistStore } from '../store/useStore';
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const { wishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Calculate total stock and check if selected size is in stock
  const totalStock = product ? Object.values(product.stock || {}).reduce((sum, qty) => sum + (qty || 0), 0) : 0;
  const selectedSizeStock = product && selectedSize ? (product.stock?.[selectedSize] || 0) : 0;
  const isSelectedSizeInStock = selectedSizeStock > 0;
  const isLowStock = selectedSizeStock > 0 && selectedSizeStock < 5;

  // Reset quantity when size changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsAPI.getById(id);
        setProduct(res.data.product);
        setSelectedSize(res.data.product.sizes?.[0] || '');
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const isWishlisted = wishlist?.some(w => w._id === product?._id) || false;

  const handleWishlist = () => {
    if (isWishlisted) {
      removeWishlist(product._id);
      toast('Removed from wishlist');
    } else {
      addWishlist(product);
      toast('Added to wishlist');
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select size');
      return;
    }
    addItem(product, quantity, selectedSize);
    toast.success('Added to cart!');
    // Stay on same page instead of navigating to cart
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading product...</div>;
  if (!product) return <div className="text-center py-12 text-gray-500">Product not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Images */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <img
            src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-96 object-cover rounded"
          />
          <div className="flex gap-2">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.altText || product.name}
                className={`w-20 h-20 object-cover rounded border cursor-pointer transition-all ${
                  selectedImage === idx ? 'border-2 border-black' : 'border-gray-300'
                }`}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
        </div>
        {/* Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-gray-600 mb-1">{product.brand}</p>
          <p className="text-xl text-gray-800 font-semibold mb-2">₹{product.price}</p>
          {product.originalPrice && (
            <p className="text-md text-gray-400 line-through mb-2">₹{product.originalPrice}</p>
          )}
          <p className="mb-4">{product.description}</p>
          {isLowStock && (
            <p className="text-red-600 text-sm font-medium mb-2">
              ⚠️ Only {selectedSizeStock} left in stock!
            </p>
          )}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Size</label>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {product.sizes?.filter(size => product.stock?.[size] > 0).map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Quantity</label>
              <div className="flex items-center border rounded">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={selectedSizeStock}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-16 text-center border-x py-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                  className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity >= selectedSizeStock}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          {isSelectedSizeInStock ? (
            <button
              onClick={handleAddToCart}
              className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition mb-2"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white py-3 rounded-lg font-semibold mb-2 cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/cart')}
              className="border border-black text-black py-2 rounded-lg font-semibold flex-1 hover:bg-gray-100 transition"
            >
              View Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`border py-2 rounded-lg font-semibold flex-1 ${isWishlisted ? 'bg-scars-red text-white' : 'bg-white text-scars-black'}`}
            >
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 