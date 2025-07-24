import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import scarsLogo from "../../assets/scars.png";
import hero1 from "../../assets/hero1.jpg";
import hero2 from "../../assets/hero2.jpg";
import hero3 from "../../assets/hero3.jpg";

const images = [hero1, hero2, hero3];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    duration: 1000,
    created() {
      setIsLoaded(true);
    },
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),
  });

  // Auto-play functionality
  useEffect(() => {
    if (!instanceRef.current) return;
    
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <section className="relative overflow-hidden">
      {/* Carousel */}
      <div ref={sliderRef} className="keen-slider h-[70vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh] min-h-[500px] max-h-[900px]">
        {images.map((img, idx) => (
          <div className="keen-slider__slide relative" key={idx}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-black/30 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10"></div>
            <img
              src={img}
              alt={`Hero Slide ${idx + 1}`}
              className={`w-full h-[70vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh] min-h-[500px] max-h-[900px] object-cover transition-all duration-1000 ${
                currentSlide === idx ? 'scale-110' : 'scale-100'
              }`}
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      {/* Overlayed content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`text-center text-white p-4 sm:p-8 md:p-12 flex flex-col items-center w-full max-w-6xl mx-auto pointer-events-auto transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          {/* Logo Section with Enhanced Animation */}
          <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-10">
            <div className="relative flex items-center justify-center w-48 h-20 sm:w-60 sm:h-26 md:w-80 md:h-32 lg:w-[32rem] lg:h-40 rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-xl shadow-2xl border border-white/30 hover:bg-white/30 transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl sm:rounded-3xl"></div>
              <div className="absolute inset-0 animate-glow rounded-2xl sm:rounded-3xl opacity-50"></div>
              <img
                src={scarsLogo}
                alt="SCARS Clothing Brand"
                className="h-12 sm:h-18 md:h-24 lg:h-32 w-auto object-contain z-10 p-2 sm:p-3 md:p-4 lg:p-6 drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          
          {/* Main Heading with Optimized Typography */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase mb-3 sm:mb-4 md:mb-6 leading-tight">
            <span className="block lg:inline text-white drop-shadow-2xl">Men's Gym</span>
            <br className="lg:hidden" />
            <span className="block lg:inline bg-gradient-to-r from-scars-red via-red-500 to-red-600 bg-clip-text text-transparent animate-glow">
              Activewear
            </span>
          </h1>
          
          {/* Subtitle with Better Spacing */}
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 md:mb-8 max-w-4xl leading-relaxed font-light text-white/90 drop-shadow-lg">
            Premium <span className="text-scars-red font-bold">performance wear</span> designed for champions.
            <br className="hidden sm:block" />
            <span className="text-scars-red font-bold">Fast delivery</span> across India.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <Link 
              to="/collections" 
              className="group relative bg-gradient-to-r from-scars-red to-red-600 text-white px-8 py-4 sm:px-12 sm:py-6 rounded-xl text-lg sm:text-xl md:text-2xl font-black shadow-2xl hover:shadow-scars-red/50 transition-all duration-300 hover:scale-110 overflow-hidden uppercase tracking-wide"
            >
              <span className="relative z-10">Shop Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 animate-glow opacity-30"></div>
            </Link>
            <Link 
              to="/collections?category=topwear" 
              className="text-white border-3 border-white/70 px-6 py-3 sm:px-10 sm:py-5 rounded-xl text-base sm:text-lg md:text-xl font-bold hover:bg-white hover:text-scars-black transition-all duration-300 hover:scale-110 backdrop-blur-md uppercase tracking-wide"
            >
              View Topwear
            </Link>
          </div>
        </div>
        {/* Enhanced Navigation Arrows */}
        {/* Mobile: arrows near bottom, Desktop: arrows centered */}
        <button
          className="absolute left-4 sm:left-6 md:left-8 top-auto sm:top-1/2 bottom-24 sm:bottom-auto -translate-y-0 sm:-translate-y-1/2 text-white/90 hover:text-scars-red rounded-full p-2 sm:p-4 md:p-5 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md border-2 border-white/30 pointer-events-auto transition-all duration-300 hover:scale-110 sm:hover:scale-125 group shadow-2xl"
          onClick={() => instanceRef.current?.prev()}
          aria-label="Previous slide"
          tabIndex={0}
        >
          <HiArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          className="absolute right-4 sm:right-6 md:right-8 top-auto sm:top-1/2 bottom-24 sm:bottom-auto -translate-y-0 sm:-translate-y-1/2 text-white/90 hover:text-scars-red rounded-full p-2 sm:p-4 md:p-5 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md border-2 border-white/30 pointer-events-auto transition-all duration-300 hover:scale-110 sm:hover:scale-125 group shadow-2xl"
          onClick={() => instanceRef.current?.next()}
          aria-label="Next slide"
          tabIndex={0}
        >
          <HiArrowRight className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-200" />
        </button>
        {/* Enhanced Pagination Dots */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 z-20 pointer-events-auto">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`relative w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 hover:scale-150 ${
                currentSlide === idx 
                  ? 'bg-scars-red shadow-2xl shadow-scars-red/70 scale-125' 
                  : 'bg-white/60 hover:bg-white/90'
              } border-2 border-white/50 backdrop-blur-sm`}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              tabIndex={0}
            >
              {currentSlide === idx && (
                <div className="absolute inset-0 rounded-full bg-scars-red animate-glow"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;