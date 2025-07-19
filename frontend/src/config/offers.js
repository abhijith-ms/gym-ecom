// Offer Configuration
// Update this file to change the current offer

export const currentOffer = {
  // Offer Details
  title: "🎉 FLASH SALE! 🎉",
  discount: "UP TO 40% OFF",
  description: "On all men's gym topwear & bottomwear",
  
  // Date Range
  validFrom: "2025-01-01", // Start date (YYYY-MM-DD)
  validUntil: "2025-12-31", // End date (YYYY-MM-DD)
  
  // Display Settings
  showBadge: true,
  badgeText: "LIMITED TIME OFFER",
  
  // Call to Action
  ctaText: "SHOP NOW",
  ctaLink: "/collections",
  
  // Terms
  terms: "*Offer valid on selected items. Cannot be combined with other promotions.",
  
  // Display Settings
  delay: 2000, // Delay in milliseconds before showing popup
  showOncePerSession: true, // Whether to show only once per session
};

// Helper function to check if offer is currently valid
export const isOfferValid = () => {
  const now = new Date();
  const startDate = new Date(currentOffer.validFrom);
  const endDate = new Date(currentOffer.validUntil);
  
  return now >= startDate && now <= endDate;
};

// Helper function to format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}; 