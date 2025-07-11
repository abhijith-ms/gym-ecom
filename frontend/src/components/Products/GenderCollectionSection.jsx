import mensCollectionImage from "../../assets/mens-collection.webp"
import { Link } from "react-router-dom"
import featuredImg from "../../assets/featured.webp";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Topwear Collection */}
        <div className="relative flex-1 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
          <img
            src={mensCollectionImage}
            alt="Men's Topwear Collection"
            className="w-full h-[350px] md:h-[400px] object-cover" />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4 rounded">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Topwear
            </h2>
            <Link to="/collections?category=topwear" className="text-gray-900 underline font-semibold">
              Shop Now
            </Link>
          </div>
        </div>
        {/* Bottomwear Collection */}
        <div className="relative flex-1 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
          <img
            src={featuredImg}
            alt="Men's Bottomwear Collection"
            className="w-full h-[350px] md:h-[400px] object-cover" />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4 rounded">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Bottomwear
            </h2>
            <Link to="/collections?category=bottomwear" className="text-gray-900 underline font-semibold">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenderCollectionSection;