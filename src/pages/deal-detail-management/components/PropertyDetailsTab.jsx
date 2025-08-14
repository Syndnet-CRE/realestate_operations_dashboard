import React, { useState } from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PropertyDetailsTab = ({ property, onPropertyUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(property);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const propertyImages = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onPropertyUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(property);
    setIsEditing(false);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    console.log('Uploading images:', files);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading-semibold text-text-primary text-lg">Property Details</h3>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)} iconName="Edit">
              Edit Details
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photo Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-body-medium text-text-primary">Photo Gallery</h4>
            <Button variant="ghost" iconName="Upload" className="text-sm">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              Upload Photos
            </Button>
          </div>
          
          {/* Main Image */}
          <div className="relative">
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={propertyImages[selectedImageIndex]}
                alt={`${property.name} - Image ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-3 right-3 bg-text-primary/80 text-surface px-2 py-1 rounded text-sm">
              {selectedImageIndex + 1} / {propertyImages.length}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {propertyImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-full h-16 rounded-lg overflow-hidden border-2 transition-smooth ${
                  selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image
                  src={image}
                  alt={`${property.name} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Information Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-body-medium text-text-primary">Basic Information</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Property Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter property name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Address
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mb-2">
                    Property Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm disabled:opacity-50"
                  >
                    <option value="Single Family">Single Family</option>
                    <option value="Multi Family">Multi Family</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mb-2">
                    Year Built
                  </label>
                  <Input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value))}
                    disabled={!isEditing}
                    placeholder="YYYY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mb-2">
                    Bedrooms
                  </label>
                  <Input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                    disabled={!isEditing}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mb-2">
                    Bathrooms
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                    disabled={!isEditing}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mb-2">
                    Square Feet
                  </label>
                  <Input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => handleInputChange('sqft', parseInt(e.target.value))}
                    disabled={!isEditing}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h4 className="font-body-medium text-text-primary">Financial Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Purchase Price
                </label>
                <Input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', parseInt(e.target.value))}
                  disabled={!isEditing}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Estimated ARV
                </label>
                <Input
                  type="number"
                  value={formData.arv}
                  onChange={(e) => handleInputChange('arv', parseInt(e.target.value))}
                  disabled={!isEditing}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Rehab Budget
                </label>
                <Input
                  type="number"
                  value={formData.rehabBudget || 0}
                  onChange={(e) => handleInputChange('rehabBudget', parseInt(e.target.value))}
                  disabled={!isEditing}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Holding Costs
                </label>
                <Input
                  type="number"
                  value={formData.holdingCosts || 0}
                  onChange={(e) => handleInputChange('holdingCosts', parseInt(e.target.value))}
                  disabled={!isEditing}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="space-y-4">
            <h4 className="font-body-medium text-text-primary">Property Features</h4>
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm disabled:opacity-50 resize-none"
                placeholder="Enter property description..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map Integration */}
      <div className="space-y-4">
        <h4 className="font-body-medium text-text-primary">Location</h4>
        <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={property.name}
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=40.7128,-74.0060&z=14&output=embed"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsTab;