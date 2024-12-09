import React, { useState } from 'react';

const DeliveryUpdate = ({ isOpen, onClose, customerId, onSuccess }) => {
  const [files, setFiles] = useState({
    number_plate_front: null,
    number_plate_back: null,
    delivery_photo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (field, file) => {
    setFiles(prev => ({
      ...prev,
      [field]: file
    }));
    setError('');
  };

  const handleSubmit = async () => {
    // Validate all required files are present
    if (!files.number_plate_front || !files.number_plate_back || !files.delivery_photo) {
      setError('Please upload all required photos');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('number_plate_front', files.number_plate_front);
    formData.append('number_plate_back', files.number_plate_back);
    formData.append('delivery_photo', files.delivery_photo);

    try {
      const response = await fetch(
        `https://api.tophaventvs.com:8000/sales/customers/delivery-update/${customerId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update delivery photos');
      }

      const data = await response.json();
      onSuccess?.(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Update Delivery Photos</h2>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Number Plate Front*
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('number_plate_front', e.target.files[0])}
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Number Plate Back*
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('number_plate_back', e.target.files[0])}
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Delivery Photo*
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('delivery_photo', e.target.files[0])}
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 border-t sm:flex-row-reverse">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? 'Uploading...' : 'Upload Photos'}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryUpdate;