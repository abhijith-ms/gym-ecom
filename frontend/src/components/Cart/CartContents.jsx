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
                     <div className="text-sm text-gray-600">
                        Size: {item.size}
                     </div>
                     <div className="flex items-center gap-2">
                        <button
                           onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                           className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                           disabled={item.quantity <= 1}
                        >
                           -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                           onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                           className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                           disabled={item.quantity >= item.product.stock}
                        >
                           +
                        </button>
                     </div>
                     <button
                        onClick={() => removeItem(item.product._id, item.size)}
                        className="text-red-600 hover:text-red-800"
                     >
                        Remove
                     </button>
                  </div>
               </div>
               <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                     onClick={() => removeItem(item.product._id, item.size)}
                     className="mt-2 hover:text-scars-red"
                  >
                     <RiDeleteBin3Line className="h-6 w-6 text-scars-red" />
                  </button>
               </div>
            </div>
         ))}
      </div>
   );
}

export default CartContents