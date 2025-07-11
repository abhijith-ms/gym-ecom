import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiMiniBars3BottomRight,
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
          <Link to="/" className="text-2xl font-medium">
            GYM
          </Link>
        </div>
        {/* Navigation link- center */}
        <div className="hidden md:flex space-x-6">
          <Link to="/collections?category=topwear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">Topwear</Link>
          <Link to="/collections?category=bottomwear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">Bottomwear</Link>
        </div>
        {/* Icon section - Right */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 hidden sm:block">
                Hi, {user?.name}
              </span>
              {user?.role === 'admin' && (
                <Link to="/admin/products" className="text-sm text-gray-700 hover:text-black">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="hover:text-black">
                <HiOutlineUser className="h-6 w-6 text-gray-700" />
              </Link>
              <button onClick={handleLogout} className="hover:text-black">
                <FiLogOut className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="text-sm text-gray-700 hover:text-black">
                Login
              </Link>
              <Link to="/register" className="text-sm text-gray-700 hover:text-black">
                Register
              </Link>
            </div>
          )}
          
          <Link to="/wishlist" className="hover:text-black">
            <FiHeart className="h-6 w-6 text-gray-700" />
          </Link>
          
          <button onClick={toggleCart} className="relative hover:text-black">
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
          </button>
          
          {/* Search-icon */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>
          
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>


      {/* Overlay for closing nav drawer */}
      {navDrawerOpen && (
        <div
          className="fixed inset-0 bg-opacity-30 z-40"
          onClick={toggleNavDrawer}
        />
      )}
      {/* Mobile Navigation */}
      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 
      ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4"> Menu</h2>
          <nav className="space-y-4">
            <Link to="/collections?category=topwear" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Topwear</Link>
            <Link to="/collections?category=bottomwear" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Bottomwear</Link>
          </nav>

        </div>
      </div>

    </>
  )
}

export default Navbar