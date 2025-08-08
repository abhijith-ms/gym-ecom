import { IoLogoInstagram } from "react-icons/io"
import { FiPhoneCall, FiMail } from "react-icons/fi"
import { Link } from "react-router-dom"
import scarsLogo from "../../assets/scars.png"

const Footer = () => (
  <footer className="bg-gradient-to-r from-scars-black via-gray-900 to-scars-black text-white py-8 sm:py-12 mt-8 sm:mt-12">
    <div className="container mx-auto max-w-7xl px-4 lg:px-0">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
        
        {/* Brand Section */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="bg-white rounded-lg p-2 flex items-center justify-center shadow-lg">
              <img 
                src={scarsLogo} 
                alt="SCARS Clothing Brand" 
                className="h-8 sm:h-10 object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">SCARS</h3>
              <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">Clothing Brand</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md mx-auto md:mx-0">
            Premium activewear designed for champions.
          </p>
        </div>
        
        {/* Contact Section */}
        <div className="text-center md:text-left">
          <h4 className="text-lg sm:text-xl font-bold mb-4 text-white">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="p-1.5 bg-scars-red rounded-md">
                <FiPhoneCall className="w-4 h-4" />
              </div>
              <a href="tel:+919072808492" className="text-sm sm:text-base hover:text-scars-red transition-colors duration-300">+91 90728 08492</a>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="p-1.5 bg-scars-red rounded-md">
                <FiMail className="w-4 h-4" />
              </div>
              <a href="mailto:scarsindia2025@gmail.com" className="text-sm sm:text-base hover:text-scars-red transition-colors duration-300">scarsindia2025@gmail.com</a>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="mt-6">
            <div className="flex justify-center md:justify-start gap-3">
              <a href="https://www.instagram.com/scars_india?igsh=MTV2aTFiczJqZGJwcg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" 
                 className="p-2 bg-gray-800 rounded-lg hover:bg-scars-red transition-all duration-300 hover:scale-110 group">
                <IoLogoInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Quick Links Section */}
        <div className="text-center md:text-left">
          <h4 className="text-lg sm:text-xl font-bold mb-4 text-white">Quick Links</h4>
          <div className="space-y-2">
            <Link to="/" className="block text-sm sm:text-base hover:text-scars-red transition-colors duration-300 hover:translate-x-1 transform" role="link" tabIndex={0}>Home</Link>
            <Link to="/collections?category=topwear" className="block text-sm sm:text-base hover:text-scars-red transition-colors duration-300 hover:translate-x-1 transform" role="link" tabIndex={0}>Topwear</Link>
            <Link to="/collections?category=bottomwear" className="block text-sm sm:text-base hover:text-scars-red transition-colors duration-300 hover:translate-x-1 transform" role="link" tabIndex={0}>Bottomwear</Link>
            <Link to="/collections" className="block text-sm sm:text-base hover:text-scars-red transition-colors duration-300 hover:translate-x-1 transform" role="link" tabIndex={0}>All Products</Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-700 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} <span className="text-scars-red font-semibold">SCARS</span>. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className="hover:text-scars-red transition-colors duration-300">Privacy</Link>
            <Link to="/terms" className="hover:text-scars-red transition-colors duration-300">Terms</Link>
            <Link to="/returns" className="hover:text-scars-red transition-colors duration-300">Returns</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;