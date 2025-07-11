import Header from "../Common/Header"
import Footer from "../Common/Footer"
import { Outlet } from "react-router-dom"
import CartDrawer from "../Layout/CartDrawer";
import { useCartStore } from "../../store/useStore";

const UserLayout = () => {
   const isOpen = useCartStore(state => state.isOpen);
   const toggleCart = useCartStore(state => state.toggleCart);
   return (
      <>
         {/* Header */}
         <Header />
         {/* Cart drawer overlay */}
         {isOpen && (
           <div
             className="fixed inset-0  bg-opacity-30 z-40"
             onClick={toggleCart}
           />
         )}
         {/* Cart drawer */}
         <CartDrawer isOpen={isOpen} onClose={toggleCart} />
         {/* Main Content */}
         <main>
            <Outlet />
         </main>
         {/* Footer */}
         <Footer />
      </>
   )
}

export default UserLayout