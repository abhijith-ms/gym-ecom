import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { TbBrandMeta } from "react-icons/tb"
import { FiPhoneCall, FiMail } from "react-icons/fi"
import { Link } from "react-router-dom"
import scarsLogo from "../../assets/scars.png"

const Footer = () => (
  <footer className="bg-scars-black text-white py-6 mt-8">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center gap-4">
      <div className="flex items-center gap-2">
        <img 
          src={scarsLogo} 
          alt="SCARS Clothing Brand" 
          className="h-6 object-contain"
        />
        <span className="text-sm">&copy; {new Date().getFullYear()} SCARS Clothing Brand. All rights reserved.</span>
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center text-sm">
        <div className="flex items-center gap-2">
          <FiPhoneCall className="inline-block" />
          <a href="tel:+911234567890" className="hover:underline">+91 12345 67890</a>
        </div>
        <div className="flex items-center gap-2">
          <FiMail className="inline-block" />
          <a href="mailto:info@gymbrand.com" className="hover:underline">info@gymbrand.com</a>
        </div>
        <div className="flex gap-3 text-lg mt-1 md:mt-0">
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-scars-red transition-colors"><IoLogoInstagram /></a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-scars-red transition-colors"><RiTwitterXLine /></a>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Meta" className="hover:text-scars-red transition-colors"><TbBrandMeta /></a>
        </div>
      </div>
      <div className="flex gap-4 text-sm mt-2 md:mt-0">
        <Link to="/collections?category=topwear" className="hover:text-scars-red transition-colors">Topwear</Link>
        <Link to="/collections?category=bottomwear" className="hover:text-scars-red transition-colors">Bottomwear</Link>
        <Link to="/" className="hover:text-scars-red transition-colors">Home</Link>
      </div>
    </div>
  </footer>
);

export default Footer;