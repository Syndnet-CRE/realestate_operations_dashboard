import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PropertyCard = ({ 
  property, 
  onEdit, 
  onViewDetails, 
  onStatusChange, 
  onSelect,
  isSelected = false,
  viewMode = 'grid' 
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'sold': return 'bg-primary text-primary-foreground';
      case 'withdrawn': return 'bg-error text-error-foreground';
      case 'draft': return 'bg-text-secondary text-surface';
      default: return 'bg-text-secondary text-surface';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return { icon: 'TrendingUp', color: 'text-error' };
      case 'medium': return { icon: 'Minus', color: 'text-warning' };
      case 'low': return { icon: 'TrendingDown', color: 'text-success' };
      default: return null;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(property.id, property.status);
    }
  };

  const handleSelectChange = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(property.id, e.target.checked);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className={`bg-surface border border-border rounded-lg p-4 hover:shadow-base transition-smooth cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelectChange}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          
          <div className="w-20 h-16 bg-background rounded-lg overflow-hidden flex-shrink-0">
            {imageLoading && (
              <div className="w-full h-full bg-background animate-pulse flex items-center justify-center">
                <Icon name="Image" size={16} className="text-text-secondary" />
              </div>
            )}
            <Image
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-heading-medium text-text-primary text-lg truncate">
                  {property.title}
                </h3>
                <p className="text-text-secondary text-sm">{property.address}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-text-primary font-data text-lg">
                    {formatPrice(property.price)}
                  </span>
                  <span className="text-text-secondary text-sm">
                    {property.bedrooms} bed • {property.bathrooms} bath • {property.sqft.toLocaleString()} sqft
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={handleStatusClick}
                  className={`deal-status-indicator ${getStatusColor(property.status)} text-xs`}
                >
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </button>
                
                {getPriorityIcon(property.priority) && (
                  <Icon 
                    name={getPriorityIcon(property.priority).icon} 
                    size={16} 
                    className={getPriorityIcon(property.priority).color} 
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <span>Listed: {formatDate(property.listingDate)}</span>
                <span>Agent: {property.agent}</span>
                <span>{property.inquiries} inquiries</span>
                <span>{property.views} views</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(property);
                  }}
                  iconName="Edit"
                  className="text-xs px-2 py-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(property);
                  }}
                  iconName="Eye"
                  className="text-xs px-2 py-1"
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-surface border border-border rounded-lg overflow-hidden hover:shadow-base transition-smooth cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onViewDetails(property)}
    >
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelectChange}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary bg-surface"
          />
        </div>
        
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
          <button
            onClick={handleStatusClick}
            className={`deal-status-indicator ${getStatusColor(property.status)} text-xs`}
          >
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </button>
          
          {getPriorityIcon(property.priority) && (
            <div className="bg-surface rounded-full p-1">
              <Icon 
                name={getPriorityIcon(property.priority).icon} 
                size={14} 
                className={getPriorityIcon(property.priority).color} 
              />
            </div>
          )}
        </div>

        <div className="h-48 bg-background overflow-hidden">
          {imageLoading && (
            <div className="w-full h-full bg-background animate-pulse flex items-center justify-center">
              <Icon name="Image" size={24} className="text-text-secondary" />
            </div>
          )}
          <Image
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
          />
        </div>

        <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-text-primary font-data text-sm">
            {property.images.length} photos
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading-medium text-text-primary text-lg line-clamp-1">
            {property.title}
          </h3>
          <span className="text-text-primary font-data text-xl ml-2">
            {formatPrice(property.price)}
          </span>
        </div>

        <p className="text-text-secondary text-sm mb-3 line-clamp-1">
          {property.address}
        </p>

        <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
          <span>{property.bedrooms} bed</span>
          <span>{property.bathrooms} bath</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>

        <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
          <span>Listed: {formatDate(property.listingDate)}</span>
          <span>Agent: {property.agent}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={12} />
              <span>{property.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MessageCircle" size={12} />
              <span>{property.inquiries}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
              iconName="Edit"
              className="text-xs px-2 py-1"
            />
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(property);
              }}
              iconName="ExternalLink"
              className="text-xs px-2 py-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;