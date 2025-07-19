import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { TbBrandMeta } from "react-icons/tb"
import { FiPhoneCall, FiMail } from "react-icons/fi"
import { Link } from "react-router-dom"
import scarsLogo from "../../assets/scars.png"

const Footer = () => (
  <footer className="bg-gradient-to-r from-scars-black via-gray-900 to-scars-black text-white py-16 sm:py-20 md:py-24 mt-16 sm:mt-20 md:mt-24">
    <div className="container mx-auto max-w-7xl px-6 lg:px-0">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-12 md:mb-16">
        
        {/* Brand Section */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <div className="bg-white rounded-xl p-3 flex items-center justify-center shadow-xl">
              <img 
                src={scarsLogo} 
                alt="SCARS Clothing Brand" 
                className="h-10 sm:h-12 object-contain"
              />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">SCARS</h3>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Clothing Brand</p>
            </div>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed max-w-md mx-auto md:mx-0">
            Premium activewear designed for champions. Elevate your performance with our cutting-edge gym wear.
          </p>
        </div>
        
        {/* Contact Section */}
        <div className="text-center md:text-left">
          <h4 className="text-xl sm:text-2xl font-bold mb-6 text-white">Get In Touch</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 bg-scars-red rounded-lg">
                <FiPhoneCall className="w-5 h-5" />
              </div>
              <a href="tel:+911234567890" className="text-lg hover:text-scars-red transition-colors duration-300">+91 12345 67890</a>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 bg-scars-red rounded-lg">
                <FiMail className="w-5 h-5" />
              </div>
              <a href="mailto:info@gymbrand.com" className="text-lg hover:text-scars-red transition-colors duration-300">info@gymbrand.com</a>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="mt-8">
            <h5 className="text-lg font-semibold mb-4 text-white">Follow Us</h5>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" 
                 className="p-3 bg-gray-800 rounded-xl hover:bg-scars-red transition-all duration-300 hover:scale-110 group">
                <IoLogoInstagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" 
                 className="p-3 bg-gray-800 rounded-xl hover:bg-scars-red transition-all duration-300 hover:scale-110 group">
                <RiTwitterXLine className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Meta" 
                 className="p-3 bg-gray-800 rounded-xl hover:bg-scars-red transition-all duration-300 hover:scale-110 group">
                <TbBrandMeta className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Quick Links Section */}
        <div className="text-center md:text-left">
          <h4 className="text-xl sm:text-2xl font-bold mb-6 text-white">Quick Links</h4>
          <div className="space-y-3">
            <Link to="/" className="block text-lg hover:text-scars-red transition-colors duration-300 hover:translate-x-2 transform">Home</Link>
            <Link to="/collections?category=topwear" className="block text-lg hover:text-scars-red transition-colors duration-300 hover:translate-x-2 transform">Topwear</Link>
            <Link to="/collections?category=bottomwear" className="block text-lg hover:text-scars-red transition-colors duration-300 hover:translate-x-2 transform">Bottomwear</Link>
            <Link to="/collections" className="block text-lg hover:text-scars-red transition-colors duration-300 hover:translate-x-2 transform">All Products</Link>
            <Link to="/profile" className="block text-lg hover:text-scars-red transition-colors duration-300 hover:translate-x-2 transform">My Account</Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-700 pt-8 md:pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-lg text-gray-400">
              &copy; {new Date().getFullYear()} <span className="text-scars-red font-semibold">SCARS Clothing Brand</span>. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-base">
            <Link to="/privacy" className="hover:text-scars-red transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-scars-red transition-colors duration-300">Terms of Service</Link>
            <Link to="/returns" className="hover:text-scars-red transition-colors duration-300">Returns</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;