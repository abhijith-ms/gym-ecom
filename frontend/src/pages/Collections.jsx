import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Collections = () => {
  const query = useQuery();
  const category = query.get('category') || '';
  const search = query.get('search') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [searchTerm, setSearchTerm] = useState(search);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;
        const res = await productsAPI.getAll(params);
        setProducts(res.data.products);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = e => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    const searchParams = new URLSearchParams();
    if (newCategory) searchParams.set('category', newCategory);
    if (searchTerm) searchParams.set('search', searchTerm);
    navigate(`/collections?${searchParams.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (selectedCategory) searchParams.set('category', selectedCategory);
    if (searchTerm) searchParams.set('search', searchTerm);
    navigate(`/collections?${searchParams.toString()}`);
  };

  const categories = ['', 'topwear', 'bottomwear'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Collections</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </form>
        <select value={selectedCategory} onChange={handleCategoryChange} className="border rounded px-4 py-2 md:w-48">
          <option value="">All Categories</option>
          {categories.filter(c => c).map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? `No products found for "${searchTerm}"` : 'No products found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product._id}
              className="border rounded-lg p-4 hover:shadow-lg cursor-pointer flex flex-col"
              onClick={() => navigate(`/products/${product._id}`)}
            >
              <img
                src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.brand}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-bold">₹{product.price}</span>
                {product.isFeatured && (
                  <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections; 