import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";

const SearchBar = () => {

   const [searchTerm, setSearchTerm] = useState("");
   const [isOpen, setIsOpen] = useState(false);
   const handleSearchToggle = () => {
      setIsOpen(!isOpen);
   };
   const handleSearch = (e) => {
      e.preventDefault();
      console.log("Seacrh Term", searchTerm);
      setIsOpen(false);
   }

   return (
      <div className={`flex items-center justify-center w-full transition-all duration-300 text-scars-black hover:text-scars-red ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"}`}>
         {isOpen ? (
            <form
               onSubmit={handleSearch}
               className="relative flex items-center justify-center w-full">
               <div className="relative w-1/2">
                  <input type="text"
                     placeholder="Search"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="bg-gray-100 px-4 py-2 pl-2 pr-20 rounded-lg focus:outline-none w-full placeholder:text-gray-700" />
                  {/* Search Icon and Close button */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                     <button
                        type="submit"
                        className="text-scars-black hover:text-scars-red">
                        <HiMagnifyingGlass className="h-6 w-6" />
                     </button>
                     <button
                        type="button"
                        onClick={handleSearchToggle}
                        className="text-scars-black hover:text-scars-red">
                        <HiMiniXMark className="h-6 w-6" />
                     </button>
                  </div>
               </div>
            </form>
         ) : (
            <button onClick={handleSearchToggle}>
               <HiMagnifyingGlass className="h-6 w-6" />
            </button>
         )}
      </div>
   )
}

export default SearchBar