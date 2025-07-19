import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { currentOffer, formatDate } from '../../config/offers';

const AdminOffers = () => {
  const [form, setForm] = useState(currentOffer);
  const [isEditing, setIsEditing] = useState(false);
  const endDate = new Date(form.validUntil);

  // Helper to check if the offer is valid based on form state
  const isFormOfferValid = () => {
    const now = new Date();
    const startDate = new Date(form.validFrom);
    const endDate = new Date(form.validUntil);
    return now >= startDate && now <= endDate;
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
    toast.success('Offer updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(currentOffer);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-scars-black">Manage Offers</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-scars-red text-white rounded hover:bg-red-700 transition"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Offer'}
          </button>
        </div>

        {/* Current Offer Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Offer Status</h2>
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
                {formatDate(form.validFrom)} - {formatDate(form.validUntil)}
              </p>
            </div>
          </div>
        </div>

        {/* Offer Configuration Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Offer Configuration</h2>
          
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
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-scars-red text-white rounded hover:bg-red-700 transition"
                >
                  Save Changes
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
                Valid until <span className="font-semibold">{formatDate(form.validUntil)}</span>
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