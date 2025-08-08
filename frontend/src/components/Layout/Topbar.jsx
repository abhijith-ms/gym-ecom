import { IoLogoInstagram } from 'react-icons/io'

const Topbar = () => {
   return (
      <div className='bg-scars-red text-white'>
         <div className='container mx-auto flex justify-between items-center py-3'>
            <div className='hidden md:flex items-center space-x-4'>
               <a href="https://www.instagram.com/scars_india?igsh=MTV2aTFiczJqZGJwcg==" target="_blank" rel="noopener noreferrer" className='hover:text-gray-200 transition-colors'>
                  <IoLogoInstagram className='h-5 w-5' />
               </a>
            </div>
            <div className='text-sm text-center flex-grow'>
               <span>We ship all over India</span>
            </div>
            <div className='text-sm hidden md:block'>
               <a href="tel:+919072808492" className='hover:text-gray-200 transition-colors'>
               +91 90728 08492
               </a>
            </div>
         </div>
      </div>
   )
}

export default Topbar