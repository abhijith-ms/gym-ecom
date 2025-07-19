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
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo-left */}
        <div>
          <Link to="/" className="text-2xl font-bold text-scars-black">
            SCARS
          </Link>
        </div>
        
        {/* Navigation links - center with hover enlargement */}
        <div className="hidden md:flex space-x-8">
          <Link 
            to="/collections?category=topwear" 
            className="text-scars-black hover:text-scars-red text-sm font-medium uppercase 
              transition-all duration-300 transform hover:scale-105"
          >
            Topwear
          </Link>
          <Link 
            to="/collections?category=bottomwear" 
            className="text-scars-black hover:text-scars-red text-sm font-medium uppercase 
              transition-all duration-300 transform hover:scale-105"
          >
            Bottomwear
          </Link>
        </div>
        
        {/* Icon section - Right */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-scars-black hidden sm:block">
                Hi, {user?.name}
              </span>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/products" 
                  className="text-sm text-scars-black hover:text-scars-red
                    transition-all duration-300 hover:scale-105"
                >
                  Admin
                </Link>
              )}
              <Link 
                to="/profile" 
                className="hover:text-scars-red transition-all duration-300 hover:scale-105"
              >
                <HiOutlineUser className="h-6 w-6 text-scars-black" />
              </Link>
              <button 
                onClick={handleLogout} 
                className="hover:text-scars-red transition-all duration-300 hover:scale-105"
              >
                <FiLogOut className="h-6 w-6 text-scars-black" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login" 
                className="text-sm text-scars-black hover:text-scars-red
                  transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm text-scars-black hover:text-scars-red
                  transition-all duration-300 hover:scale-105"
              >
                Register
              </Link>
            </div>
          )}
          
          <Link 
            to="/wishlist" 
            className="hover:text-scars-red transition-all duration-300 hover:scale-105"
          >
            <FiHeart className="h-6 w-6 text-scars-black" />
          </Link>
          
          <button 
            onClick={toggleCart} 
            className="relative hover:text-scars-red transition-all duration-300 hover:scale-105"
          >
            <span className="absolute -top-2 -right-2 bg-scars-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
            <HiOutlineShoppingBag className="h-6 w-6 text-scars-black" />
          </button>
          
          {/* Search-icon */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>
          
          <button 
            onClick={toggleNavDrawer} 
            className="md:hidden transition-all duration-300 hover:scale-105"
          >
            <HiBars3BottomRight className="h-6 w-6 text-scars-black" />
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
      
      {/* Mobile Navigation with hover effects */}
      <div 
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 
          ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button 
            onClick={toggleNavDrawer}
            className="transition-all duration-300 hover:scale-105"
          >
            <IoMdClose className="h-6 w-6 text-scars-black" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link 
              to="/collections?category=topwear" 
              onClick={toggleNavDrawer} 
              className="block text-scars-black hover:text-scars-red py-2 px-4 rounded-md transition-all duration-300 hover:bg-gray-50 hover:scale-105"
            >
              Topwear
            </Link>
            <Link 
              to="/collections?category=bottomwear" 
              onClick={toggleNavDrawer} 
              className="block text-scars-black hover:text-scars-red py-2 px-4 rounded-md transition-all duration-300 hover:bg-gray-50 hover:scale-105"
            >
              Bottomwear
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Navbar;