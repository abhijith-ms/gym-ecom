import { useState, useEffect, useRef } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [isOpen, setIsOpen] = useState(false);
   const searchRef = useRef(null);
   const inputRef = useRef(null);
   const navigate = useNavigate();
   
   const handleSearchToggle = () => {
      setIsOpen(!isOpen);
   };
   
   const handleSearch = (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
         // Navigate to products page with search parameter
         navigate(`/collections?search=${encodeURIComponent(searchTerm.trim())}`);
         setIsOpen(false);
         setSearchTerm(""); // Clear search term after search
      }
   }

   // Close search when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (searchRef.current && !searchRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };

      const handleEscape = (event) => {
         if (event.key === 'Escape') {
            setIsOpen(false);
         }
      };

      if (isOpen) {
         document.addEventListener('mousedown', handleClickOutside);
         document.addEventListener('keydown', handleEscape);
         // Focus input when opened
         setTimeout(() => {
            inputRef.current?.focus();
         }, 100);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
         document.removeEventListener('keydown', handleEscape);
      };
   }, [isOpen]);

   return (
      <div className="relative" ref={searchRef}>
         <div className={`flex items-center transition-all duration-300 ease-in-out ${
            isOpen 
               ? "w-64 md:w-80 lg:w-96" 
               : "w-10"
         }`}>
            {isOpen ? (
               <form onSubmit={handleSearch} className="relative w-full">
                  <div className="relative">
                     <input 
                        ref={inputRef}
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 px-4 py-2 pl-10 pr-20 rounded-full border border-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-scars-red/20 focus:border-scars-red
                           placeholder:text-gray-500 text-scars-black text-sm"
                     />
                     <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     
                     {/* Action Buttons */}
                     <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <button
                           type="submit"
                           className="p-1.5 rounded-full bg-scars-red text-white hover:bg-red-600 
                              transition-all duration-200 hover:scale-105"
                           title="Search"
                        >
                           <HiMagnifyingGlass className="h-3 w-3" />
                        </button>
                        <button
                           type="button"
                           onClick={handleSearchToggle}
                           className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 
                              transition-all duration-200 hover:scale-105"
                           title="Close"
                        >
                           <HiMiniXMark className="h-3 w-3" />
                        </button>
                     </div>
                  </div>
               </form>
            ) : (
               <button 
                  onClick={handleSearchToggle}
                  className="p-2 rounded-full hover:bg-scars-red/10 hover:text-scars-red 
                     transition-all duration-300 hover:scale-110 group w-10 h-10 flex items-center justify-center"
                  title="Search"
               >
                  <HiMagnifyingGlass className="h-5 w-5 text-scars-black group-hover:text-scars-red" />
               </button>
            )}
         </div>
      </div>
   )
}

export default SearchBar