import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { currentOffer, isOfferValid, formatDate } from '../../config/offers';

const OfferPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show popup if offer is valid
    if (!isOfferValid()) return;

    // Check if popup has been dismissed in this session
    const hasSeenPopup = currentOffer.showOncePerSession 
      ? sessionStorage.getItem('offerPopupDismissed')
      : false;
      
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, currentOffer.delay);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as dismissed for this session
    if (currentOffer.showOncePerSession) {
      sessionStorage.setItem('offerPopupDismissed', 'true');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Popup Content */}
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-scars-red transition-colors"
          >
            <IoMdClose className="h-6 w-6" />
          </button>

          {/* Offer Content */}
          <div className="text-center">
            {/* Offer Badge */}
            {currentOffer.showBadge && (
              <div className="bg-scars-red text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                {currentOffer.badgeText}
              </div>
            )}

            {/* Main Heading */}
            <h2 className="text-2xl font-bold text-scars-black mb-3">
              {currentOffer.title}
            </h2>

            {/* Offer Details */}
            <div className="space-y-3 mb-6">
              <p className="text-lg font-semibold text-scars-red">
                {currentOffer.discount}
              </p>
              <p className="text-gray-700">
                {currentOffer.description}
              </p>
              <p className="text-sm text-gray-600">
                Valid until <span className="font-semibold">{formatDate(currentOffer.validUntil)}</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                to={currentOffer.ctaLink}
                onClick={handleClose}
                className="block w-full bg-scars-red text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                {currentOffer.ctaText}
              </Link>
              <button
                onClick={handleClose}
                className="block w-full text-scars-black hover:text-scars-red transition-colors text-sm"
              >
                Maybe Later
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 mt-4">
              {currentOffer.terms}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferPopup; 