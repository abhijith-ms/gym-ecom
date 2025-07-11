import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { TbBrandMeta } from "react-icons/tb"
import { FiPhoneCall } from "react-icons/fi"

import { Link } from "react-router-dom"

const Footer = () => (
  <footer className="bg-black text-white py-6 mt-8">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center gap-4">
      <span className="text-sm">&copy; {new Date().getFullYear()} Gym Clothing Brand. All rights reserved.</span>
      <div className="flex gap-4 text-sm">
        <a href="/collections?category=topwear" className="hover:underline">Topwear</a>
        <a href="/collections?category=bottomwear" className="hover:underline">Bottomwear</a>
        <a href="/" className="hover:underline">Home</a>
      </div>
    </div>
  </footer>
);

export default Footer;