import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PropertySummaryCard = ({ property, onStatusChange, onQuickAction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'underwriting': return 'bg-accent text-accent-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'closed': return 'bg-primary text-primary-foreground';
      default: return 'bg-text-secondary text-surface';
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

  const quickActions = [
    { id: 'move-stage', label: 'Move Stage', icon: 'ArrowRight' },
    { id: 'schedule-visit', label: 'Schedule Visit', icon: 'Calendar' },
    { id: 'generate-report', label: 'Generate Report', icon: 'FileText' },
    { id: 'share-deal', label: 'Share Deal', icon: 'Share2' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
      {/* Property Image */}
      <div className="relative">
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <Image
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-3 right-3">
          <span className={`deal-status-indicator ${getStatusColor(property.status)}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-4">
        <div>
          <h2 className="font-heading-semibold text-text-primary text-lg mb-1">
            {property.name}
          </h2>
          <p className="text-text-secondary text-sm flex items-center">
            <Icon name="MapPin" size={14} className="mr-1" />
            {property.address}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-3">
            <p className="text-text-secondary text-xs mb-1">Purchase Price</p>
            <p className="font-heading-medium text-text-primary">
              {formatCurrency(property.purchasePrice)}
            </p>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-text-secondary text-xs mb-1">Est. ARV</p>
            <p className="font-heading-medium text-text-primary">
              {formatCurrency(property.arv)}
            </p>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-text-secondary text-xs mb-1">ROI</p>
            <p className="font-heading-medium text-success">
              {property.roi}%
            </p>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-text-secondary text-xs mb-1">Days Active</p>
            <p className="font-heading-medium text-text-primary">
              {property.daysActive}
            </p>
          </div>
        </div>

        {/* Property Info */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Property Type</span>
            <span className="text-text-primary text-sm font-body-medium">
              {property.type}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Square Footage</span>
            <span className="text-text-primary text-sm font-body-medium">
              {property.sqft.toLocaleString()} sq ft
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Bedrooms/Bathrooms</span>
            <span className="text-text-primary text-sm font-body-medium">
              {property.bedrooms}BR / {property.bathrooms}BA
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Year Built</span>
            <span className="text-text-primary text-sm font-body-medium">
              {property.yearBuilt}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Deal Progress</span>
            <span className="text-text-primary font-body-medium">{property.progress}%</span>
          </div>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${property.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="font-body-medium text-text-primary text-sm">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                onClick={() => onQuickAction(action.id)}
                className="text-xs p-2 h-auto flex flex-col items-center space-y-1"
              >
                <Icon name={action.icon} size={16} />
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Stage Transition */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="primary"
            onClick={() => onStatusChange(property.id)}
            className="w-full"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Move to Next Stage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertySummaryCard;