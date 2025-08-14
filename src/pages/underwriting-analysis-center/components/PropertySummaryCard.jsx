import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PropertySummaryCard = ({ property, onEdit, onRefresh }) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'high': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-background';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-base">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-background">
            <Image
              src={property.image}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-heading-semibold text-text-primary mb-1">
              {property.name}
            </h2>
            <p className="text-text-secondary mb-2">{property.address}</p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">
                <Icon name="MapPin" size={14} className="inline mr-1" />
                {property.city}, {property.state}
              </span>
              <span className="text-sm text-text-secondary">
                <Icon name="Building" size={14} className="inline mr-1" />
                {property.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-smooth"
            title="Refresh Data"
          >
            <Icon name="RefreshCw" size={16} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-smooth"
            title="Edit Property"
          >
            <Icon name="Edit" size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-background rounded-lg p-3">
          <p className="text-text-secondary text-sm mb-1">Purchase Price</p>
          <p className="text-lg font-heading-semibold text-text-primary">
            {formatCurrency(property.purchasePrice)}
          </p>
        </div>
        <div className="bg-background rounded-lg p-3">
          <p className="text-text-secondary text-sm mb-1">Square Footage</p>
          <p className="text-lg font-heading-semibold text-text-primary">
            {property.squareFootage.toLocaleString()} sq ft
          </p>
        </div>
        <div className="bg-background rounded-lg p-3">
          <p className="text-text-secondary text-sm mb-1">Cap Rate</p>
          <p className="text-lg font-heading-semibold text-text-primary">
            {property.capRate}%
          </p>
        </div>
        <div className="bg-background rounded-lg p-3">
          <p className="text-text-secondary text-sm mb-1">NOI</p>
          <p className="text-lg font-heading-semibold text-text-primary">
            {formatCurrency(property.noi)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Risk Level:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(property.riskLevel)}`}>
              {property.riskLevel.charAt(0).toUpperCase() + property.riskLevel.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Score:</span>
            <span className="text-sm font-heading-medium text-text-primary">
              {property.underwritingScore}/100
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-text-secondary text-sm">Last Updated</p>
          <p className="text-sm font-heading-medium text-text-primary">
            {property.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertySummaryCard;