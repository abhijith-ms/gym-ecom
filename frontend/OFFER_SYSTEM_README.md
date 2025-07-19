# Offer Popup System

This system allows you to display promotional offers to users when they visit your site. The popup is fully configurable and can be easily updated.

## Features

- **Automatic Display**: Shows after a configurable delay when users first visit
- **Session Management**: Can be set to show only once per session
- **Date Validation**: Only shows during the specified date range
- **Fully Configurable**: All text, dates, and settings can be customized
- **Admin Interface**: Easy-to-use admin panel for managing offers
- **Mobile Responsive**: Works perfectly on all devices

## How to Update Offers

### Method 1: Edit Configuration File (Quick)

1. Open `frontend/src/config/offers.js`
2. Update the `currentOffer` object with your new offer details:

```javascript
export const currentOffer = {
  title: "🎉 NEW YEAR SALE! 🎉",
  discount: "UP TO 50% OFF",
  description: "On all gym wear collections",
  validFrom: "2025-01-01",
  validUntil: "2025-01-31",
  // ... other settings
};
```

### Method 2: Use Admin Interface (Recommended)

1. Log in as an admin user
2. Navigate to `/admin/offers`
3. Click "Edit Offer" to modify the current offer
4. Update any fields you want to change
5. Click "Save Changes"

## Configuration Options

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Main heading of the popup | "🎉 FLASH SALE! 🎉" |
| `discount` | Discount text | "UP TO 40% OFF" |
| `description` | Offer description | "On all men's gym topwear & bottomwear" |
| `validFrom` | Start date (YYYY-MM-DD) | "2024-12-01" |
| `validUntil` | End date (YYYY-MM-DD) | "2024-12-31" |
| `badgeText` | Badge text | "LIMITED TIME OFFER" |
| `ctaText` | Call-to-action button text | "SHOP NOW" |
| `ctaLink` | Where the CTA button links to | "/collections" |
| `terms` | Terms and conditions | "*Offer valid on selected items..." |
| `showBadge` | Whether to show the badge | `true` |
| `showOncePerSession` | Show only once per session | `true` |
| `delay` | Delay before showing (milliseconds) | `2000` |

## Current Offer

The current offer is set to:
- **Title**: 🎉 FLASH SALE! 🎉
- **Discount**: UP TO 40% OFF
- **Valid Period**: December 1, 2024 - December 31, 2024
- **Description**: On all men's gym topwear & bottomwear

## Technical Details

- **File Location**: `frontend/src/components/Common/OfferPopup.jsx`
- **Configuration**: `frontend/src/config/offers.js`
- **Admin Panel**: `frontend/src/components/Admin/AdminOffers.jsx`
- **Session Storage**: Uses `sessionStorage` to track dismissed popups
- **Z-Index**: Uses `z-50` to appear above other content

## Customization

### Styling
The popup uses the SCARS brand colors:
- Primary: `scars-red` (#ae0405)
- Text: `scars-black` (#000000)
- Background: `scars-white` (#ffffff)

### Behavior
- Shows after 2 seconds delay
- Can be dismissed by clicking outside or the close button
- Only shows once per session (configurable)
- Only shows during valid date range

## Troubleshooting

### Popup not showing?
1. Check if the current date is within the valid range
2. Clear session storage: `sessionStorage.removeItem('offerPopupDismissed')`
3. Verify the offer configuration is correct

### Need to test the popup?
1. Open browser developer tools
2. Go to Application/Storage tab
3. Clear session storage
4. Refresh the page

### Want to disable the popup temporarily?
Set `validFrom` to a future date or `validUntil` to a past date in the configuration. 