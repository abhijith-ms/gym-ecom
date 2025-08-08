import { useState, useEffect, useRef } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";

const SearchBar = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [isOpen, setIsOpen] = useState(false);
   const searchRef = useRef(null);
   
   const handleSearchToggle = () => {
      setIsOpen(!isOpen);
   };
   
   const handleSearch = (e) => {
      e.preventDefault();
      console.log("Search Term", searchTerm);
      setIsOpen(false);
   }

   // Close search modal when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (searchRef.current && !searchRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };

      if (isOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isOpen]);

   return (
      <div className="relative" ref={searchRef}>
         {isOpen ? (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                  <form onSubmit={handleSearch} className="relative">
                     <div className="relative">
                        <input 
                           type="text"
                           placeholder="Search for products..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full bg-gray-50 px-4 py-3 pl-12 pr-20 rounded-lg border border-gray-200 
                              focus:outline-none focus:ring-2 focus:ring-scars-red/20 focus:border-scars-red
                              placeholder:text-gray-500 text-scars-black"
                           autoFocus
                        />
                        <HiMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        
                        {/* Action Buttons */}
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                           <button
                              type="submit"
                              className="p-2 rounded-lg bg-scars-red text-white hover:bg-red-600 
                                 transition-all duration-200 hover:scale-105"
                              title="Search"
                           >
                              <HiMagnifyingGlass className="h-4 w-4" />
                           </button>
                           <button
                              type="button"
                              onClick={handleSearchToggle}
                              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 
                                 transition-all duration-200 hover:scale-105"
                              title="Close"
                           >
                              <HiMiniXMark className="h-4 w-4" />
                           </button>
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         ) : (
            <button 
               onClick={handleSearchToggle}
               className="p-2 rounded-full hover:bg-scars-red/10 hover:text-scars-red 
                  transition-all duration-300 hover:scale-110 group"
               title="Search"
            >
               <HiMagnifyingGlass className="h-5 w-5 text-scars-black group-hover:text-scars-red" />
            </button>
         )}
      </div>
   )
}

export default SearchBar