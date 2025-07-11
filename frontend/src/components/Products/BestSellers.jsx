import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
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
    <section className="py-12 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Best Sellers</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Shop our most popular men's gym topwear and bottomwear.
        </p>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No best sellers found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="border rounded-lg p-4 hover:shadow-lg flex flex-col transition"
              >
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.brand}</p>
                <span className="text-xl font-bold">₹{product.price}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers; 