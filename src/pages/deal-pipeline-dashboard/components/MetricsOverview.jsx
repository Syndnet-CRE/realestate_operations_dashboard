import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsOverview = ({ metrics, userRole }) => {
  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getMetricColor = (value, isPositive = true) => {
    if (value === 0) return 'text-text-secondary';
    if (isPositive) {
      return value > 0 ? 'text-success' : 'text-error';
    } else {
      return value > 0 ? 'text-error' : 'text-success';
    }
  };

  const getMetricIcon = (type) => {
    switch (type) {
      case 'total_value': return 'DollarSign';
      case 'active_deals': return 'Activity';
      case 'conversion_rate': return 'TrendingUp';
      case 'avg_deal_size': return 'BarChart3';
      case 'pipeline_velocity': return 'Zap';
      case 'deals_closed': return 'CheckCircle';
      default: return 'BarChart3';
    }
  };

  // Filter metrics based on user role
  const getVisibleMetrics = () => {
    const baseMetrics = [
      {
        id: 'active_deals',
        label: 'Active Deals',
        value: metrics.activeDeals,
        change: metrics.activeDealsChange,
        icon: 'Activity',
        format: 'number'
      },
      {
        id: 'deals_closed',
        label: 'Deals Closed (30d)',
        value: metrics.dealsClosedMonth,
        change: metrics.dealsClosedChange,
        icon: 'CheckCircle',
        format: 'number'
      },
      {
        id: 'conversion_rate',
        label: 'Conversion Rate',
        value: metrics.conversionRate,
        change: metrics.conversionRateChange,
        icon: 'TrendingUp',
        format: 'percentage'
      },
      {
        id: 'pipeline_velocity',
        label: 'Pipeline Velocity',
        value: metrics.pipelineVelocity,
        change: metrics.pipelineVelocityChange,
        icon: 'Zap',
        format: 'days',
        suffix: ' days'
      }
    ];

    // Add financial metrics for authorized roles
    if (userRole === 'acquisition_manager' || userRole === 'executive' || userRole === 'underwriter') {
      baseMetrics.unshift(
        {
          id: 'total_value',
          label: 'Total Pipeline Value',
          value: metrics.totalPipelineValue,
          change: metrics.totalValueChange,
          icon: 'DollarSign',
          format: 'currency'
        },
        {
          id: 'avg_deal_size',
          label: 'Avg Deal Size',
          value: metrics.avgDealSize,
          change: metrics.avgDealSizeChange,
          icon: 'BarChart3',
          format: 'currency'
        }
      );
    }

    return baseMetrics;
  };

  const formatValue = (value, format, suffix = '') => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString();
      case 'days':
        return `${value}${suffix}`;
      default:
        return value.toString();
    }
  };

  const visibleMetrics = getVisibleMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
      {visibleMetrics.map((metric) => (
        <div
          key={metric.id}
          className="bg-surface border border-border rounded-lg p-6 hover:shadow-base transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name={metric.icon} size={20} className="text-primary" />
            </div>
            {metric.change !== undefined && (
              <div className={`flex items-center space-x-1 text-sm ${getMetricColor(metric.change)}`}>
                <Icon 
                  name={metric.change >= 0 ? "TrendingUp" : "TrendingDown"} 
                  size={14} 
                />
                <span>{formatPercentage(metric.change)}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-heading-semibold text-text-primary">
              {formatValue(metric.value, metric.format, metric.suffix)}
            </h3>
            <p className="text-sm text-text-secondary">{metric.label}</p>
          </div>

          {/* Additional Context */}
          {metric.id === 'active_deals' && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>This Week</span>
                <span>+{metrics.newDealsThisWeek}</span>
              </div>
            </div>
          )}

          {metric.id === 'total_value' && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Weighted</span>
                <span>{formatCurrency(metrics.weightedPipelineValue)}</span>
              </div>
            </div>
          )}

          {metric.id === 'conversion_rate' && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Industry Avg</span>
                <span>12.5%</span>
              </div>
            </div>
          )}

          {metric.id === 'pipeline_velocity' && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Target</span>
                <span>&lt; 45 days</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;