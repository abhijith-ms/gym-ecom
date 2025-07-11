import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { label: "Products", path: "/admin/products" },
  { label: "Orders", path: "/admin/orders" },
  { label: "Users", path: "/admin/users" },
];

export default function AdminLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
        <nav className="flex flex-col gap-2">
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
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
} 