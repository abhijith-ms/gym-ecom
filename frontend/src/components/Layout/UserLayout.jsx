import Header from "../Common/Header"
import Footer from "../Common/Footer"
import { Outlet } from "react-router-dom"
import CartDrawer from "../Layout/CartDrawer";
import OfferPopup from "../Common/OfferPopup";
import { useCartStore } from "../../store/useStore";

const UserLayout = () => {
   const isOpen = useCartStore(state => state.isOpen);
   const toggleCart = useCartStore(state => state.toggleCart);
   return (
      <div className="min-h-screen flex flex-col">
         {/* Header */}
         <Header />
         {/* Cart drawer overlay */}
         {isOpen && (
           <div
             className="fixed inset-0 bg-transparent z-40"
             onClick={toggleCart}
           />
         )}
         {/* Cart drawer */}
         <CartDrawer isOpen={isOpen} onClose={toggleCart} />
         {/* Offer Popup */}
         <OfferPopup />
         {/* Main Content */}
         <main className="flex-1">
            <Outlet />
         </main>
         {/* Footer */}
         <Footer />
      </div>
   )
}

export default UserLayout