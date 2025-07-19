import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FiLogOut, FiHeart } from "react-icons/fi";

import SearchBar from "./SearchBar";
import { useAuthStore, useCartStore } from "../../store/useStore";
import scarsLogo from "../../assets/scars.png";

const Navbar = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleCart, getTotalItems } = useCartStore();

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-3 px-6 relative">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md border-b border-gray-100 -z-10"></div>
        {/* Enhanced Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img 
                src={scarsLogo} 
                alt="SCARS Clothing Brand" 
                className="h-9 md:h-11 object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-sm"
              />
              <div className="absolute inset-0 bg-scars-red/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110"></div>
            </div>
          </Link>
        </div>
        
        {/* Enhanced Navigation Links */}
        <div className="hidden md:flex items-center space-x-12 relative z-10">
          <Link 
            to="/collections?category=topwear" 
            className="relative text-scars-black hover:text-scars-red text-base font-bold uppercase 
              transition-all duration-300 transform hover:scale-105 py-3 px-4 rounded-lg hover:bg-scars-red/5 group"
          >
            <span className="relative z-10">Topwear</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-scars-red transition-all duration-300 group-hover:w-full"></div>
          </Link>
          <Link 
            to="/collections?category=bottomwear" 
            className="relative text-scars-black hover:text-scars-red text-base font-bold uppercase 
              transition-all duration-300 transform hover:scale-105 py-3 px-4 rounded-lg hover:bg-scars-red/5 group"
          >
            <span className="relative z-10">Bottomwear</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-scars-red transition-all duration-300 group-hover:w-full"></div>
          </Link>
          <Link 
            to="/collections" 
            className="relative text-scars-black hover:text-scars-red text-base font-bold uppercase 
              transition-all duration-300 transform hover:scale-105 py-3 px-4 rounded-lg hover:bg-scars-red/5 group"
          >
            <span className="relative z-10">All Products</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-scars-red transition-all duration-300 group-hover:w-full"></div>
          </Link>
        </div>
        
        {/* Enhanced Icon Section */}
        <div className="flex items-center space-x-4 relative z-10">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-scars-black hidden sm:block font-medium">
                Hi, <span className="text-scars-red">{user?.name}</span>
              </span>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/products" 
                  className="text-sm text-white bg-scars-red hover:bg-red-600 px-3 py-1.5 rounded-full
                    transition-all duration-300 hover:scale-105 font-medium"
                >
                  Admin
                </Link>
              )}
              <Link 
                to="/profile" 
                className="p-2 rounded-full hover:bg-scars-red/10 hover:text-scars-red transition-all duration-300 hover:scale-110 group"
              >
                <HiOutlineUser className="h-5 w-5 text-scars-black group-hover:text-scars-red" />
              </Link>
              <button 
                onClick={handleLogout} 
                className="p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-110 group"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5 text-scars-black group-hover:text-red-600" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login" 
                className="text-sm text-scars-black hover:text-scars-red px-3 py-2 rounded-lg hover:bg-scars-red/5
                  transition-all duration-300 hover:scale-105 font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm text-white bg-scars-red hover:bg-red-600 px-4 py-2 rounded-lg
                  transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-scars-red/25"
              >
                Register
              </Link>
            </div>
          )}
          
          <Link 
            to="/wishlist" 
            className="p-2 rounded-full hover:bg-scars-red/10 hover:text-scars-red transition-all duration-300 hover:scale-110 group"
            title="Wishlist"
          >
            <FiHeart className="h-5 w-5 text-scars-black group-hover:text-scars-red" />
          </Link>
          
          <button 
            onClick={toggleCart} 
            className="relative p-2 rounded-full hover:bg-scars-red/10 hover:text-scars-red transition-all duration-300 hover:scale-110 group"
            title="Shopping Cart"
          >
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-scars-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {getTotalItems()}
              </span>
            )}
            <HiOutlineShoppingBag className="h-5 w-5 text-scars-black group-hover:text-scars-red" />
          </button>
          
          {/* Search-icon */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>
          
          <button 
            onClick={toggleNavDrawer} 
            className="md:hidden p-2 rounded-full hover:bg-scars-red/10 transition-all duration-300 hover:scale-110 group"
            title="Menu"
          >
            <HiBars3BottomRight className="h-5 w-5 text-scars-black group-hover:text-scars-red" />
          </button>
        </div>
      </nav>

      {/* Overlay for closing nav drawer */}
      {navDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleNavDrawer}
        />
      )}
      
      {/* Enhanced Mobile Navigation */}
      <div 
        className={`fixed top-0 left-0 w-4/5 sm:w-3/5 md:w-1/3 h-full bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-500 z-50 border-r border-gray-200
          ${navDrawerOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-scars-red/5 to-transparent">
          <Link to="/" onClick={toggleNavDrawer} className="flex items-center group">
            <img 
              src={scarsLogo} 
              alt="SCARS Clothing Brand" 
              className="h-10 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </Link>
          <button 
            onClick={toggleNavDrawer}
            className="p-2 rounded-full hover:bg-red-100 transition-all duration-300 hover:scale-110 group"
          >
            <IoMdClose className="h-6 w-6 text-scars-black group-hover:text-scars-red" />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-scars-black">Menu</h2>
          <nav className="space-y-3">
            <Link 
              to="/collections?category=topwear" 
              onClick={toggleNavDrawer} 
              className="flex items-center text-scars-black hover:text-scars-red py-4 px-4 rounded-xl transition-all duration-300 hover:bg-scars-red/10 hover:scale-105 group border border-transparent hover:border-scars-red/20"
            >
              <span className="font-semibold uppercase tracking-wide">Topwear</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                →
              </div>
            </Link>
            <Link 
              to="/collections?category=bottomwear" 
              onClick={toggleNavDrawer} 
              className="flex items-center text-scars-black hover:text-scars-red py-4 px-4 rounded-xl transition-all duration-300 hover:bg-scars-red/10 hover:scale-105 group border border-transparent hover:border-scars-red/20"
            >
              <span className="font-semibold uppercase tracking-wide">Bottomwear</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                →
              </div>
            </Link>
            <Link 
              to="/collections" 
              onClick={toggleNavDrawer} 
              className="flex items-center text-scars-black hover:text-scars-red py-4 px-4 rounded-xl transition-all duration-300 hover:bg-scars-red/10 hover:scale-105 group border border-transparent hover:border-scars-red/20"
            >
              <span className="font-semibold uppercase tracking-wide">All Products</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                →
              </div>
            </Link>
          </nav>
          
          {/* Mobile Auth Section */}
          {!isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  onClick={toggleNavDrawer}
                  className="block w-full text-center bg-scars-red text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:bg-red-600 hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={toggleNavDrawer}
                  className="block w-full text-center border-2 border-scars-red text-scars-red py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:bg-scars-red hover:text-white hover:scale-105"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar;