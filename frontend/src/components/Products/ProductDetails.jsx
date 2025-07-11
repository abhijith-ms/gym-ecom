import React from 'react'



const selectedProduct = {
   name: "Stylish Jacket",
   price: 125,
   originalPrice: 150,
   description: "This is a stylish Jacket",
   brand: "Nike",
   material: "Leather",
   sizes: ["S", "M", "L"],
   colors: ["Red", "Black"],
   images: [
      {
         url: "https://picsum.photos/500/500?random=1",
         altText: "Stylish Jacket 1",

      },
      {
         url: "https://picsum.photos/500/500?random=2",
         altText: "Stylish Jacket 1",

      },
   ]
};

const ProductDetails = () => {


   return (
      <div className='p-6'>
         <div className='max-w-6xl mx-auto bg-white p-8 rounded-lg'>
            <div className='flex flex-col md:flex-row'>
               {/* Left Thumbnail */}
               <div className='hidden md:flex flex-col space-y-4 mr-6'>
                  {selectedProduct.images.map((image, index) => (
                     <img
                        key={index}
                        src={image.url}
                        alt={image.altText || `Thumbnail ${index}`}
                        className='w-20 h-20 object-cover rounded-lg cursor-pointer border' />
                  ))}
               </div>
               {/* Main IMage */}
               <div className='md:w-1/2'>
                  <div className='mb-4'>
                     <img src={selectedProduct.images[0]?.url}
                        alt="Main Prodcut"
                        className='w-full h-auto object-cover rounded-lg' />
                  </div>

               </div>
               {/* Mobile Thumbnail */}
               <div className='md:hidden flex overscroll-x-scroll space-x-4 mb-4'>
                  {selectedProduct.images.map((image, index) => (
                     <img
                        key={index}
                        src={image.url}
                        alt={image.altText || `Thumbnail ${index}`}
                        className='w-20 h-20 object-cover rounded-lg cursor-pointer border' />
                  ))}
               </div>
               {/* Right Section */}
               <div className='md:w-1/2 md:ml-10'>
                  <h1 className='text-2xl md:text-3xl font-semibold mb-2'>
                     {selectedProduct.name}
                  </h1>
                  <p className='text-lg text-gray-600 mb-1 line-through'></p>
                  {selectedProduct.originalPrice && `${selectedProduct.originalPrice}`}
                  <p className='text-xl text-gray-500 mb-2'>
                     $ {selectedProduct.price}
                  </p>
                  <p className='text-gray-600 mb-4'>{selectedProduct.description}</p>
                  <div className='mb-4'>
                     <p className='text-gray-700'> Colour:
                        {selectedProduct.colors.map((color) => (
                           <button
                              key={color}
                              className='w-8  h-8 rounded-full border'
                              style={{
                                 backgroundColor: color.toLocaleLowerCase(),
                                 filter: "brightness(0.5)",
                              }}
                           >
                           </button>
                        ))}
                     </p>

                  </div>

               </div>

            </div>

         </div>

      </div>
   )
}

export default ProductDetails