import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname or search params change
    const scrollToTop = () => {
      // Try different scroll methods for better compatibility
      if (window.scrollTo) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      } else if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop; 