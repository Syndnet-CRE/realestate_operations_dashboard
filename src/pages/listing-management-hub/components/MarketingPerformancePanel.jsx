import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MarketingPerformancePanel = ({ 
  selectedProperties = [],
  onExportReport,
  onRefreshData 
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [showComparison, setShowComparison] = useState(false);

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const performanceMetrics = [
    {
      id: 'total-views',
      label: 'Total Views',
      value: '12,847',
      change: '+15.3%',
      trend: 'up',
      icon: 'Eye',
      color: 'text-primary'
    },
    {
      id: 'inquiries',
      label: 'Inquiries',
      value: '342',
      change: '+8.7%',
      trend: 'up',
      icon: 'MessageCircle',
      color: 'text-success'
    },
    {
      id: 'showings',
      label: 'Showings Scheduled',
      value: '89',
      change: '+12.1%',
      trend: 'up',
      icon: 'Calendar',
      color: 'text-accent'
    },
    {
      id: 'conversion',
      label: 'Conversion Rate',
      value: '2.66%',
      change: '-0.3%',
      trend: 'down',
      icon: 'TrendingUp',
      color: 'text-warning'
    }
  ];

  const topPerformingProperties = [
    {
      id: 1,
      title: 'Sunset Plaza Penthouse',
      views: 1247,
      inquiries: 23,
      conversionRate: 1.85,
      status: 'active'
    },
    {
      id: 2,
      title: 'Marina Bay Office Complex',
      views: 987,
      inquiries: 19,
      conversionRate: 1.93,
      status: 'active'
    },
    {
      id: 3,
      title: 'Downtown Loft Collection',
      views: 834,
      inquiries: 15,
      conversionRate: 1.80,
      status: 'active'
    },
    {
      id: 4,
      title: 'Harbor View Townhomes',
      views: 756,
      inquiries: 12,
      conversionRate: 1.59,
      status: 'pending'
    },
    {
      id: 5,
      title: 'Executive Office Tower',
      views: 623,
      inquiries: 8,
      conversionRate: 1.28,
      status: 'active'
    }
  ];

  const marketingChannels = [
    {
      channel: 'Company Website',
      views: 4521,
      inquiries: 127,
      percentage: 35.2,
      trend: 'up'
    },
    {
      channel: 'Zillow',
      views: 3847,
      inquiries: 98,
      percentage: 29.9,
      trend: 'up'
    },
    {
      channel: 'Realtor.com',
      views: 2156,
      inquiries: 67,
      percentage: 16.8,
      trend: 'stable'
    },
    {
      channel: 'MLS',
      views: 1523,
      inquiries: 34,
      percentage: 11.9,
      trend: 'down'
    },
    {
      channel: 'Social Media',
      views: 800,
      inquiries: 16,
      percentage: 6.2,
      trend: 'up'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      case 'stable': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const handleExportReport = () => {
    if (onExportReport) {
      onExportReport({
        timeRange,
        metrics: performanceMetrics,
        properties: topPerformingProperties,
        channels: marketingChannels
      });
    }
  };

  const handleRefreshData = () => {
    if (onRefreshData) {
      onRefreshData();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading-semibold text-text-primary text-lg">
              Marketing Performance
            </h3>
            <p className="text-text-secondary text-sm mt-1">
              Track listing performance and marketing effectiveness
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              onClick={handleRefreshData}
              iconName="RefreshCw"
              className="text-sm"
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExportReport}
              iconName="Download"
              className="text-sm"
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Key Metrics */}
        <div>
          <h4 className="font-heading-medium text-text-primary mb-4">Key Metrics</h4>
          <div className="grid grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.id} className="bg-background rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon name={metric.icon} size={20} className={metric.color} />
                  <div className={`flex items-center space-x-1 text-sm ${
                    metric.trend === 'up' ? 'text-success' : 
                    metric.trend === 'down' ? 'text-error' : 'text-text-secondary'
                  }`}>
                    <Icon name={getTrendIcon(metric.trend)} size={14} />
                    <span>{metric.change}</span>
                  </div>
                </div>
                <p className="text-2xl font-data text-text-primary mb-1">{metric.value}</p>
                <p className="text-text-secondary text-sm">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Properties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading-medium text-text-primary">Top Performing Properties</h4>
            <Button variant="ghost" iconName="BarChart3" className="text-sm">
              View All Analytics
            </Button>
          </div>
          <div className="bg-background rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-border text-sm font-body-medium text-text-secondary">
              <span>Property</span>
              <span>Views</span>
              <span>Inquiries</span>
              <span>Conversion Rate</span>
              <span>Status</span>
            </div>
            {topPerformingProperties.map((property, index) => (
              <div key={property.id} className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-b-0 hover:bg-surface transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-body-medium">
                    {index + 1}
                  </span>
                  <span className="text-text-primary font-body-medium truncate">
                    {property.title}
                  </span>
                </div>
                <span className="text-text-primary font-data">{property.views.toLocaleString()}</span>
                <span className="text-text-primary font-data">{property.inquiries}</span>
                <span className="text-text-primary font-data">{property.conversionRate}%</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  property.status === 'active' ? 'bg-success/10 text-success' :
                  property.status === 'pending'? 'bg-warning/10 text-warning' : 'bg-text-secondary/10 text-text-secondary'
                }`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Channels */}
        <div>
          <h4 className="font-heading-medium text-text-primary mb-4">Marketing Channel Performance</h4>
          <div className="bg-background rounded-lg p-4">
            <div className="space-y-4">
              {marketingChannels.map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="font-body-medium text-text-primary">{channel.channel}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-text-primary font-data">{channel.views.toLocaleString()}</p>
                      <p className="text-text-secondary text-xs">Views</p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-primary font-data">{channel.inquiries}</p>
                      <p className="text-text-secondary text-xs">Inquiries</p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-primary font-data">{channel.percentage}%</p>
                      <p className="text-text-secondary text-xs">Share</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${getTrendColor(channel.trend)}`}>
                      <Icon name={getTrendIcon(channel.trend)} size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparative Analysis */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading-medium text-text-primary">Market Comparison</h4>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-primary hover:text-primary/80 text-sm"
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
            </button>
          </div>
          
          {showComparison && (
            <div className="bg-background rounded-lg p-4">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-data text-text-primary">2.66%</p>
                  <p className="text-text-secondary text-sm">Your Avg Conversion</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-data text-primary">3.12%</p>
                  <p className="text-text-secondary text-sm">Market Average</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-data text-success">4.85%</p>
                  <p className="text-text-secondary text-sm">Top Performers</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={16} className="text-warning" />
                  <p className="text-warning text-sm font-body-medium">
                    Opportunity: Your conversion rate is 0.46% below market average
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingPerformancePanel;