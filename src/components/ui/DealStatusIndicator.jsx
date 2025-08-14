import React from 'react';
import Icon from '../AppIcon';

const DealStatusIndicator = ({ 
  status, 
  dealId, 
  dealName, 
  progress = 0, 
  priority = 'normal',
  lastUpdated,
  showDetails = false,
  size = 'md',
  onClick 
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      'pipeline': {
        color: 'bg-text-secondary text-surface',
        icon: 'Clock',
        label: 'In Pipeline'
      },
      'active': {
        color: 'bg-success text-success-foreground',
        icon: 'Play',
        label: 'Active'
      },
      'underwriting': {
        color: 'bg-accent text-accent-foreground',
        icon: 'Calculator',
        label: 'Underwriting'
      },
      'pending': {
        color: 'bg-warning text-warning-foreground',
        icon: 'AlertCircle',
        label: 'Pending Approval'
      },
      'approved': {
        color: 'bg-success text-success-foreground',
        icon: 'CheckCircle',
        label: 'Approved'
      },
      'on-hold': {
        color: 'bg-text-secondary text-surface',
        icon: 'Pause',
        label: 'On Hold'
      },
      'closed': {
        color: 'bg-primary text-primary-foreground',
        icon: 'Check',
        label: 'Closed'
      },
      'cancelled': {
        color: 'bg-error text-error-foreground',
        icon: 'X',
        label: 'Cancelled'
      }
    };
    return configs[status] || configs['pipeline'];
  };

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-error';
      case 'medium':
        return 'border-l-4 border-warning';
      case 'low':
        return 'border-l-4 border-success';
      default:
        return '';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return {
          container: 'text-xs',
          badge: 'px-2 py-1',
          icon: 12
        };
      case 'lg':
        return {
          container: 'text-base',
          badge: 'px-4 py-2',
          icon: 20
        };
      default:
        return {
          container: 'text-sm',
          badge: 'px-3 py-1.5',
          icon: 16
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  const shouldAnimate = ['active', 'underwriting', 'pending'].includes(status);

  const handleClick = () => {
    if (onClick) {
      onClick({ status, dealId, dealName, progress, priority });
    }
  };

  if (showDetails) {
    return (
      <div 
        className={`bg-surface border border-border rounded-lg p-4 transition-smooth hover:shadow-base cursor-pointer ${getPriorityIndicator(priority)}`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`deal-status-indicator ${statusConfig.color} ${shouldAnimate ? 'animate-pulse-subtle' : ''}`}>
              <Icon name={statusConfig.icon} size={sizeClasses.icon} className="mr-1" />
              {statusConfig.label}
            </span>
            {priority === 'high' && (
              <Icon name="AlertTriangle" size={14} className="text-error" />
            )}
          </div>
          <span className="text-text-secondary text-xs">#{dealId}</span>
        </div>
        
        <h4 className="font-body-medium text-text-primary mb-2">{dealName}</h4>
        
        {progress > 0 && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {lastUpdated && (
          <p className="text-text-secondary text-xs">
            Updated {lastUpdated}
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`deal-status-indicator ${statusConfig.color} ${shouldAnimate ? 'animate-pulse-subtle' : ''} ${sizeClasses.container} ${sizeClasses.badge} transition-smooth hover:opacity-80`}
      title={`${statusConfig.label} - ${dealName || `Deal #${dealId}`}`}
    >
      <Icon name={statusConfig.icon} size={sizeClasses.icon} className="mr-1" />
      {statusConfig.label}
      {priority === 'high' && (
        <Icon name="AlertTriangle" size={sizeClasses.icon - 2} className="ml-1" />
      )}
    </button>
  );
};

export default DealStatusIndicator;