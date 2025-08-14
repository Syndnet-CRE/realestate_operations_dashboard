import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  trend = [], 
  format = 'currency',
  loading = false 
}) => {
  const formatValue = (val, type) => {
    if (loading) return '---';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      default:
        return val;
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      case 'neutral':
        return 'text-text-secondary';
      default:
        return 'text-text-secondary';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      case 'neutral':
        return 'Minus';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-base transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <h3 className="font-body-medium text-text-secondary text-sm">{title}</h3>
        </div>
        {trend.length > 0 && (
          <div className="w-16 h-8">
            <svg width="100%" height="100%" viewBox="0 0 64 32" className="overflow-visible">
              <polyline
                points={trend.map((point, index) => `${(index / (trend.length - 1)) * 64},${32 - (point / Math.max(...trend)) * 32}`).join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={getChangeColor(changeType)}
              />
            </svg>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-heading-semibold text-text-primary">
            {formatValue(value, format)}
          </span>
          {loading && (
            <div className="w-4 h-4 bg-text-secondary rounded animate-pulse"></div>
          )}
        </div>
        
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={getChangeIcon(changeType)} 
              size={14} 
              className={getChangeColor(changeType)} 
            />
            <span className={`text-sm font-body-medium ${getChangeColor(changeType)}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-text-secondary text-sm">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;