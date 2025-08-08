import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { offersAPI } from '../../services/api';

const AdminOffers = () => {
  const [form, setForm] = useState({
    title: '',
    discount: '',
    description: '',
    validFrom: '',
    validUntil: '',
    showBadge: true,
    badgeText: 'LIMITED TIME OFFER',
    ctaText: '',
    ctaLink: '',
    terms: '*Offer valid on selected items. Cannot be combined with other promotions.',
    delay: 2000,
    showOncePerSession: true,
    isActive: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentOffer, setCurrentOffer] = useState(null);

  useEffect(() => {
    fetchCurrentOffer();
  }, []);

  const fetchCurrentOffer = async () => {
    try {
      console.log('Fetching current offer...'); // Debug log
      const response = await offersAPI.getCurrent();
      console.log('API response:', response.data); // Debug log
      
      if (response.data.success && response.data.offer) {
        const offer = response.data.offer;
        console.log('Received offer:', offer); // Debug log
        console.log('Offer ID:', offer._id); // Debug log
        
        setCurrentOffer(offer);
        setForm({
          title: offer.title || '',
          discount: offer.discount || '',
          description: offer.description || '',
          validFrom: offer.validFrom ? new Date(offer.validFrom).toISOString().split('T')[0] : '',
          validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().split('T')[0] : '',
          showBadge: offer.showBadge !== undefined ? offer.showBadge : true,
          badgeText: offer.badgeText || 'LIMITED TIME OFFER',
          ctaText: offer.ctaText || '',
          ctaLink: offer.ctaLink || '',
          terms: offer.terms || '*Offer valid on selected items. Cannot be combined with other promotions.',
          delay: offer.delay || 2000,
          showOncePerSession: offer.showOncePerSession !== undefined ? offer.showOncePerSession : true,
          isActive: offer.isActive !== undefined ? offer.isActive : true
        });
      } else {
        console.log('No offer found in response'); // Debug log
      }
    } catch (error) {
      console.error('Error fetching current offer:', error);
      toast.error('Failed to load current offer');
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if the offer is valid based on form state
  const isFormOfferValid = () => {
    const now = new Date();
    const startDate = new Date(form.validFrom);
    const endDate = new Date(form.validUntil);
    return form.isActive && now >= startDate && now <= endDate;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting offer:', { currentOffer, form }); // Debug log
      
      if (currentOffer && currentOffer._id) {
        // Update existing offer
        console.log('Updating offer with ID:', currentOffer._id); // Debug log
        await offersAPI.update(currentOffer._id, form);
        toast.success('Offer updated successfully!');
      } else {
        // Create new offer
        console.log('Creating new offer'); // Debug log
        await offersAPI.create(form);
        toast.success('Offer created successfully!');
      }
      
      setIsEditing(false);
      fetchCurrentOffer(); // Refresh the data
    } catch (error) {
      console.error('Error saving offer:', error);
      toast.error('Failed to save offer');
    }
  };

  const handleCancel = () => {
    if (currentOffer) {
      setForm({
        title: currentOffer.title || '',
        discount: currentOffer.discount || '',
        description: currentOffer.description || '',
        validFrom: currentOffer.validFrom ? new Date(currentOffer.validFrom).toISOString().split('T')[0] : '',
        validUntil: currentOffer.validUntil ? new Date(currentOffer.validUntil).toISOString().split('T')[0] : '',
        showBadge: currentOffer.showBadge !== undefined ? currentOffer.showBadge : true,
        badgeText: currentOffer.badgeText || 'LIMITED TIME OFFER',
        ctaText: currentOffer.ctaText || '',
        ctaLink: currentOffer.ctaLink || '',
        terms: currentOffer.terms || '*Offer valid on selected items. Cannot be combined with other promotions.',
        delay: currentOffer.delay || 2000,
        showOncePerSession: currentOffer.showOncePerSession !== undefined ? currentOffer.showOncePerSession : true,
        isActive: currentOffer.isActive !== undefined ? currentOffer.isActive : true
      });
    }
    setIsEditing(false);
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-500">Loading offer data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-scars-black">Manage Offers</h1>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  console.log('Testing API call...');
                  const response = await offersAPI.getCurrent();
                  console.log('Test API response:', response.data);
                } catch (error) {
                  console.error('Test API error:', error);
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Test API
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-scars-red text-white rounded hover:bg-red-700 transition"
            >
              {isEditing ? 'Cancel Edit' : currentOffer ? 'Edit Offer' : 'Create Offer'}
            </button>
          </div>
        </div>

        {/* Current Offer Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Offer Status</h2>
          {currentOffer ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold ${isFormOfferValid() ? 'text-green-600' : 'text-red-600'}`}>
                  {isFormOfferValid() ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valid Period</p>
                <p className="font-semibold">
                  {formatDate(currentOffer.validFrom)} - {formatDate(currentOffer.validUntil)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No active offer found</p>
            </div>
          )}
        </div>

        {/* Offer Configuration Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentOffer ? 'Offer Configuration' : 'Create New Offer'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Discount</label>
                <input
                  type="text"
                  name="discount"
                  value={form.discount}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                required
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Valid From</label>
                <input
                  type="date"
                  name="validFrom"
                  value={form.validFrom}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Valid Until</label>
                <input
                  type="date"
                  name="validUntil"
                  value={form.validUntil}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            {/* Display Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Badge Text</label>
                <input
                  type="text"
                  name="badgeText"
                  value={form.badgeText}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CTA Text</label>
                <input
                  type="text"
                  name="ctaText"
                  value={form.ctaText}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CTA Link</label>
              <input
                type="text"
                name="ctaLink"
                value={form.ctaLink}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Terms</label>
              <textarea
                name="terms"
                value={form.terms}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="3"
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="showBadge"
                  checked={form.showBadge}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className="text-sm">Show Badge</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="showOncePerSession"
                  checked={form.showOncePerSession}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className="text-sm">Show Once Per Session</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Delay (ms)</label>
              <input
                type="number"
                name="delay"
                value={form.delay}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                min="0"
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-scars-red text-white rounded hover:bg-red-700 transition"
                >
                  {currentOffer ? 'Update Offer' : 'Create Offer'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-center">
              {form.showBadge && (
                <div className="bg-scars-red text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  {form.badgeText}
                </div>
              )}
              <h3 className="text-xl font-bold text-scars-black mb-3">{form.title}</h3>
              <p className="text-lg font-semibold text-scars-red mb-2">{form.discount}</p>
              <p className="text-gray-700 mb-2">{form.description}</p>
              <p className="text-sm text-gray-600 mb-4">
                Valid until <span className="font-semibold">{form.validUntil ? formatDate(form.validUntil) : 'Not set'}</span>
              </p>
              <button className="bg-scars-red text-white py-2 px-4 rounded">
                {form.ctaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOffers; 