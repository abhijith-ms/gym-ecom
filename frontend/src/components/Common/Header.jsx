import Topbar from '../Layout/Topbar';
import Navbar from './Navbar';
import CartDrawer from '../Layout/CartDrawer';
import { useCartStore } from '../../store/useStore';

const Header = () => {
   const isOpen = useCartStore(state => state.isOpen);
   const toggleCart = useCartStore(state => state.toggleCart);

   return (
      <header className='border-b border-gray-100'>
         {/*  Topbar */}
         <Topbar />
         {/* Navbar */}
         <Navbar />
      </header>
   );
};

export default Header