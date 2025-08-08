import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Collections from "./pages/Collections";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import { useAuthStore } from "./store/useStore";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminOrders from "./components/Admin/AdminOrders";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminOffers from "./components/Admin/AdminOffers";
import ScrollToTop from "./components/Common/ScrollToTop";

const App = () => {
  const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="collections" element={<Collections />} />
          <Route path="wishlist" element={<Wishlist />} />
          {/* Add more user routes here */}
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="offers" element={<AdminOffers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App