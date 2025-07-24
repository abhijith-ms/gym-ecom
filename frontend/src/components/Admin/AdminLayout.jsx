import { Link, Outlet, useLocation } from "react-router-dom";
import { HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { useState } from "react";

const navItems = [
  { label: "Products", path: "/admin/products" },
  { label: "Orders", path: "/admin/orders" },
  { label: "Users", path: "/admin/users" },
  { label: "Offers", path: "/admin/offers" },
];

export default function AdminLayout() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-56 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-scars-black hover:text-scars-red transition">
            <FaHome className="text-white" />
            <span className="text-base text-white font-medium">Home</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 mt-6">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-2 px-3 rounded hover:bg-gray-700 transition-colors ${location.pathname === item.path ? "bg-gray-700" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white flex items-center justify-between px-4 py-3 shadow">
        <div className="flex items-center gap-3">
          <Link to="/" className="inline-flex items-center" aria-label="Home">
            <FaHome className="h-6 w-6 text-white" />
          </Link>
          <h2 className="text-lg font-bold">Admin Dashboard</h2>
        </div>
        <button onClick={() => setDrawerOpen(true)} aria-label="Open menu">
          <HiBars3BottomRight className="h-7 w-7" />
        </button>
      </div>
      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50" onClick={() => setDrawerOpen(false)} />
          <div className="fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-gray-900 text-white z-50 shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <Link to="/" className="inline-flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
                <FaHome className="h-6 w-6 text-white" />
                <span className="text-base text-white font-medium">Home</span>
              </Link>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <IoMdClose className="h-6 w-6 text-white" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-6 mt-4">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  className={`py-3 px-3 rounded hover:bg-gray-700 transition-colors text-base ${location.pathname === item.path ? "bg-gray-700" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
      {/* Main content, with top padding for mobile topbar */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
} 