import { FaShippingFast, FaTshirt, FaUndo } from 'react-icons/fa';

const USPRow = () => (
  <section className="bg-gray-50 py-8">
    <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-8">
      <div className="flex flex-col items-center text-center">
        <FaShippingFast className="text-3xl text-black mb-2" />
        <span className="font-semibold">Fast Shipping</span>
        <span className="text-gray-500 text-sm">All Kerala Delivery</span>
      </div>
      <div className="flex flex-col items-center text-center">
        <FaTshirt className="text-3xl text-black mb-2" />
        <span className="font-semibold">Quality Materials</span>
        <span className="text-gray-500 text-sm">Premium Gymwear</span>
      </div>
      <div className="flex flex-col items-center text-center">
        <FaUndo className="text-3xl text-black mb-2" />
        <span className="font-semibold">Easy Returns</span>
        <span className="text-gray-500 text-sm">7-Day Hassle-Free</span>
      </div>
    </div>
  </section>
);

export default USPRow; 