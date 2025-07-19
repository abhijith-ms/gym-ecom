import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCartStore, useWishlistStore } from '../store/useStore';
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const { items: wishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.getById(id);
        setProduct(res.data.product);
        setSelectedSize(res.data.product.sizes?.[0] || '');
        setSelectedColor(res.data.product.colors?.[0]?.name || '');
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const isWishlisted = wishlist.some(w => w._id === product._id);
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
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
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
          <p className="text-xl text-gray-800 font-semibold mb-2">${product.price}</p>
          {product.originalPrice && (
            <p className="text-md text-gray-400 line-through mb-2">${product.originalPrice}</p>
          )}
          <p className="mb-4">{product.description}</p>
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Size</label>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {product.sizes?.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Color</label>
              <select
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {product.colors?.map(color => (
                  <option key={color.name} value={color.name}>{color.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
              />
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition mb-2"
          >
            Add to Cart
          </button>
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