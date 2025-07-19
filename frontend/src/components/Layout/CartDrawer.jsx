import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import CartContents from '../Cart/CartContents';
import { useCartStore } from '../../store/useStore';

const CartDrawer = ({ isOpen, onClose }) => {


   const { getTotalPrice, getTotalItems } = useCartStore();

   return (
      <div className={
         `fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 
      ${isOpen ?
            "translate-x-0" :
            "translate-x-full"}`
      }>
         {/* close button */}
         <div className='flex justify-between items-center p-4 border-b'>
            <h2 className='text-xl font-semibold'>
               Shopping Cart ({getTotalItems()})
            </h2>
            <button onClick={onClose}>
               <IoMdClose className='h-6 w-6 text-scars-black hover:text-scars-red transition-colors' />
            </button>
         </div>
         
         {/* Cart contents with scrollable area */}
         <div className='flex-grow p-4 overflow-y-auto'>
            <CartContents />
         </div>
         
         {/* Checkout button */}
         <div className='p-4 bg-white sticky bottom-0 border-t'>
            <div className='flex justify-between items-center mb-4'>
               <span className='text-lg font-semibold'>Total:</span>
               <span className='text-lg font-semibold'>${getTotalPrice().toFixed(2)}</span>
            </div>
            <Link 
               to="/checkout" 
               onClick={onClose}
               className='w-full bg-scars-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition block text-center'
            >
               Proceed to Checkout
            </Link>
            <p className='text-sm text-gray-500 mt-2 text-center'>Shipping and taxes are calculated at checkout</p>
         </div>
      </div>
   );

}


export default CartDrawer