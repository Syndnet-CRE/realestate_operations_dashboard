import React from 'react';
import Icon from '../../../components/AppIcon';


const DealCard = ({ deal, onClick, userRole, showFinancials = false }) => {
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDaysInStage = (lastUpdated) => {
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffTime = Math.abs(now - updated);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-error';
      case 'medium': return 'border-l-4 border-warning';
      case 'low': return 'border-l-4 border-success';
      default: return '';
    }
  };

  const getPropertyTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'residential': return 'Home';
      case 'commercial': return 'Building';
      case 'industrial': return 'Factory';
      case 'retail': return 'Store';
      case 'mixed-use': return 'Building2';
      default: return 'MapPin';
    }
  };

  const daysInStage = getDaysInStage(deal.lastUpdated);

  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-border rounded-lg p-4 hover:shadow-base transition-all duration-200 cursor-pointer ${getPriorityColor(deal.priority)}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-heading-medium text-text-primary text-sm truncate mb-1">
            {deal.propertyAddress}
          </h4>
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <Icon name={getPropertyTypeIcon(deal.propertyType)} size={12} />
            <span>{deal.propertyType}</span>
            <span>•</span>
            <span>#{deal.dealId}</span>
          </div>
        </div>
        {deal.priority === 'high' && (
          <Icon name="AlertTriangle" size={14} className="text-error flex-shrink-0" />
        )}
      </div>

      {/* Financial Information */}
      {showFinancials && (
        <div className="mb-3 p-2 bg-background rounded">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-text-secondary">Deal Value</span>
            <span className="text-sm font-data text-text-primary">{formatCurrency(deal.value)}</span>
          </div>
          {deal.roi && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-secondary">Projected ROI</span>
              <span className={`text-sm font-data ${deal.roi >= 15 ? 'text-success' : deal.roi >= 10 ? 'text-warning' : 'text-error'}`}>
                {deal.roi}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Team Assignment */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
            {deal.assignedTo.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-xs text-text-secondary truncate">{deal.assignedTo}</span>
        </div>
        <div className="text-xs text-text-secondary">
          {daysInStage} day{daysInStage !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Progress Bar */}
      {deal.progress > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>Progress</span>
            <span>{deal.progress}%</span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${deal.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Next Action */}
      {deal.nextAction && (
        <div className="mb-3 p-2 bg-accent/10 rounded text-xs">
          <div className="flex items-center space-x-1 text-accent">
            <Icon name="Clock" size={12} />
            <span className="font-medium">Next: {deal.nextAction.title}</span>
          </div>
          <div className="text-text-secondary mt-1">
            Due: {formatDate(deal.nextAction.dueDate)}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {deal.hasDocuments && (
            <Icon name="Paperclip" size={12} className="text-text-secondary" />
          )}
          {deal.hasComments && (
            <Icon name="MessageCircle" size={12} className="text-text-secondary" />
          )}
          {deal.isUrgent && (
            <Icon name="Zap" size={12} className="text-warning" />
          )}
        </div>
        <div className="text-xs text-text-secondary">
          Updated {formatDate(deal.lastUpdated)}
        </div>
      </div>
    </div>
  );
};

export default DealCard;