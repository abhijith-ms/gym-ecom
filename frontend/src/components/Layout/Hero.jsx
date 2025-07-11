import heroImg from "../../assets/rabbit-hero.webp"
import { Link } from "react-router-dom"

const Hero = () => {
   return (
      <section className="relative">
         <img src={heroImg} alt="Men's Gymwear" className="w-full h-[320px] md:h-[500px] lg:h-[650px] object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-center">
            <div className="text-center text-white p-6">
               <h1 className="text-3xl md:text-6xl font-bold tracking-tighter uppercase mb-4">
                  Men’s Gym Topwear & Bottomwear
               </h1>
               <p className="text-base md:text-lg mb-6 ">
                  Premium activewear for every workout.<br />Fast shipping across Kerala.
               </p>
               <Link to="/collections" className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg font-semibold shadow hover:bg-gray-100 transition">Shop Now</Link>
            </div>
         </div>
      </section>
   )
}

export default Hero