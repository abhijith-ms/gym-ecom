import { RiDeleteBin3Line } from "react-icons/ri";
import { useCartStore } from "../../store/useStore";

const CartContents = () => {
   const { items, removeItem, updateQuantity } = useCartStore();

   if (items.length === 0) {
      return (
         <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <p className="text-sm text-gray-400">Add some products to get started!</p>
         </div>
      );
   }

   return (
      <div>
         {items.map((item, index) => (
            <div key={index} className="flex items-start justify-between py-4 border-b">
               <div className="flex items-center">
                  <img 
                     src={item.product.images[0]?.url || "https://picsum.photos/200?random=1"} 
                     alt={item.product.name} 
                     className="w-20 h-24 object-cover mr-4 rounded" 
                  />
                  <div>
                     <h3 className="font-medium">{item.product.name}</h3>
                     <p className="text-sm text-gray-500">
                        Size: {item.size} | Color: {item.color}
                     </p>
                     <div className="flex items-center mt-2">
                        <button 
                           onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                           className="rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                        >
                           -
                        </button>
                        <span className="mx-4">{item.quantity}</span>
                        <button 
                           onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                           className="rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                        >
                           +
                        </button>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                     onClick={() => removeItem(item.product._id, item.size, item.color)}
                     className="mt-2 hover:text-red-700"
                  >
                     <RiDeleteBin3Line className="h-6 w-6 text-red-600" />
                  </button>
               </div>
            </div>
         ))}
      </div>
   );
}

export default CartContents