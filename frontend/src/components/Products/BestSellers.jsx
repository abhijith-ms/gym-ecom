import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi2';
import { productsAPI } from '../../services/api';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch best sellers for topwear and bottomwear
        const res = await productsAPI.getBestSellers();
        setProducts(res.data.products.filter(p => ["topwear", "bottomwear"].includes(p.category)));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-24 sm:py-32 md:py-40 px-6 lg:px-0 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto max-w-8xl">
        {/* Enhanced Header */}
        <div className="text-center mb-20 sm:mb-24 md:mb-32 animate-fadeInUp">
          <div className="inline-block">
            <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 sm:mb-12 text-scars-black relative tracking-tighter">
              Best Sellers
              <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 w-32 sm:w-48 md:w-64 h-2 sm:h-3 md:h-4 bg-gradient-to-r from-scars-red to-red-600 rounded-full"></div>
            </h2>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl text-gray-600 mb-12 sm:mb-16 max-w-5xl mx-auto leading-relaxed font-light">
            Discover our most popular men's gym wear that customers love.
          </p>
        </div>
        {loading ? (
          /* Enhanced Loading State */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-fadeInScale" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <div className="skeleton h-80 sm:h-96 w-full"></div>
                  <div className="p-8">
                    <div className="skeleton h-8 w-3/4 mb-4 rounded"></div>
                    <div className="skeleton h-6 w-1/2 mb-6 rounded"></div>
                    <div className="skeleton h-8 w-1/3 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 sm:py-32 animate-fadeInUp">
            <div className="text-8xl sm:text-9xl mb-8">🏆</div>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-6">No Best Sellers Yet</h3>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12">Check back soon for our most popular products!</p>
            <Link to="/collections" className="bg-gradient-to-r from-scars-red to-red-600 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:scale-110 transition-all duration-300 inline-block shadow-2xl">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover-lift animate-fadeInScale"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Product Image Container */}
                <div className="relative overflow-hidden">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </Link>
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3">
                      <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors duration-200 group/btn">
                        <HiOutlineHeart className="w-5 h-5 text-scars-black group-hover/btn:text-scars-red transition-colors" />
                      </button>
                      <Link 
                        to={`/products/${product._id}`}
                        className="px-6 py-3 bg-scars-red text-white rounded-full hover:bg-red-600 transition-colors duration-200 font-semibold"
                      >
                        Quick View
                      </Link>
                    </div>
                  </div>
                  
                  {/* Best Seller Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-base font-bold shadow-xl">
                      BEST SELLER
                    </span>
                  </div>
                  
                  {/* Stock Status */}
                  {(() => {
                    const totalStock = Object.values(product.stock || {}).reduce((sum, qty) => sum + (qty || 0), 0);
                    return totalStock <= 5 && totalStock > 0 ? (
                      <div className="absolute top-6 right-6">
                        <span className="bg-orange-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                          Only {totalStock} left
                        </span>
                      </div>
                    ) : null;
                  })()}
                </div>
                
                {/* Product Info */}
                <div className="p-8">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-bold text-xl sm:text-2xl mb-3 text-scars-black group-hover:text-scars-red transition-colors duration-200 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 mb-4 text-base uppercase tracking-wide font-medium">
                    {product.brand}
                  </p>
                  
                  {/* Category Badge */}
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      product.category === 'topwear' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.category}
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl font-black text-scars-red">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* View All Button */}
        {!loading && products.length > 0 && (
          <div className="text-center mt-20 sm:mt-24 md:mt-32 animate-fadeInUp">
            <Link 
              to="/collections" 
              className="inline-flex items-center gap-4 bg-gradient-to-r from-scars-red to-red-600 text-white px-12 py-6 sm:px-16 sm:py-8 rounded-2xl font-black text-xl sm:text-2xl md:text-3xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-scars-red/50 uppercase tracking-wide"
            >
              View All Products
              <span className="transition-transform duration-200 group-hover:translate-x-2 text-2xl sm:text-3xl">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers; 