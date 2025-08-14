import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BenchmarkingPanel = ({ 
  onBenchmarkUpdate,
  comparisonData = [],
  showIndustryBenchmarks = true 
}) => {
  const [selectedMetric, setSelectedMetric] = useState('roi');
  const [comparisonPeriod, setComparisonPeriod] = useState('ytd');
  const [viewType, setViewType] = useState('bar');

  const metrics = [
    { id: 'roi', label: 'ROI %', icon: 'TrendingUp', format: 'percentage' },
    { id: 'profit_margin', label: 'Profit Margin', icon: 'DollarSign', format: 'percentage' },
    { id: 'deal_velocity', label: 'Deal Velocity', icon: 'Zap', format: 'number' },
    { id: 'acquisition_cost', label: 'Acquisition Cost', icon: 'Building', format: 'currency' },
    { id: 'time_to_close', label: 'Time to Close', icon: 'Clock', format: 'days' }
  ];

  const periods = [
    { id: 'mtd', label: 'Month to Date' },
    { id: 'qtd', label: 'Quarter to Date' },
    { id: 'ytd', label: 'Year to Date' },
    { id: 'trailing12', label: 'Trailing 12 Months' }
  ];

  const mockBenchmarkData = [
    {
      category: 'Your Performance',
      roi: 18.5,
      profit_margin: 22.3,
      deal_velocity: 8.2,
      acquisition_cost: 2850000,
      time_to_close: 45,
      color: '#1E3A5F'
    },
    {
      category: 'Team Average',
      roi: 16.2,
      profit_margin: 19.8,
      deal_velocity: 7.1,
      acquisition_cost: 3100000,
      time_to_close: 52,
      color: '#4A90A4'
    },
    {
      category: 'Company Target',
      roi: 20.0,
      profit_margin: 25.0,
      deal_velocity: 10.0,
      acquisition_cost: 2500000,
      time_to_close: 40,
      color: '#27AE60'
    },
    {
      category: 'Industry Average',
      roi: 14.8,
      profit_margin: 18.5,
      deal_velocity: 6.8,
      acquisition_cost: 3200000,
      time_to_close: 58,
      color: '#E67E22'
    }
  ];

  const radarData = [
    { metric: 'ROI', yourScore: 85, target: 100, industry: 70 },
    { metric: 'Profit Margin', yourScore: 89, target: 100, industry: 74 },
    { metric: 'Deal Velocity', yourScore: 82, target: 100, industry: 68 },
    { metric: 'Cost Efficiency', yourScore: 91, target: 100, industry: 76 },
    { metric: 'Speed to Close', yourScore: 87, target: 100, industry: 69 }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'days':
        return `${value} days`;
      default:
        return value.toString();
    }
  };

  const getPerformanceStatus = (current, target) => {
    const ratio = current / target;
    if (ratio >= 1.0) return { status: 'excellent', color: 'text-success', icon: 'TrendingUp' };
    if (ratio >= 0.9) return { status: 'good', color: 'text-primary', icon: 'ArrowUp' };
    if (ratio >= 0.8) return { status: 'fair', color: 'text-warning', icon: 'Minus' };
    return { status: 'needs-improvement', color: 'text-error', icon: 'TrendingDown' };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const selectedMetricData = metrics.find(m => m.id === selectedMetric);
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-interactive">
          <p className="font-body-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-text-secondary">{selectedMetricData?.label}:</span>
              <span className="font-body-medium text-text-primary">
                {formatValue(entry.value, selectedMetricData?.format)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading-medium text-text-primary text-lg">Performance Benchmarking</h3>
          <p className="text-text-secondary text-sm">
            Compare your performance against targets and industry standards
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewType === 'bar' ? 'primary' : 'outline'}
            onClick={() => setViewType('bar')}
            iconName="BarChart3"
            size="sm"
          />
          <Button
            variant={viewType === 'radar' ? 'primary' : 'outline'}
            onClick={() => setViewType('radar')}
            iconName="Target"
            size="sm"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-1">
              Metric
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-1">
              Period
            </label>
            <select
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
              className="p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {mockBenchmarkData.map((item, index) => {
          const currentValue = item[selectedMetric];
          const targetValue = mockBenchmarkData.find(d => d.category === 'Company Target')?.[selectedMetric];
          const performance = targetValue ? getPerformanceStatus(currentValue, targetValue) : null;
          const selectedMetricData = metrics.find(m => m.id === selectedMetric);
          
          return (
            <div key={index} className="bg-background rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-body-medium text-text-primary text-sm">{item.category}</h4>
                {performance && item.category === 'Your Performance' && (
                  <Icon name={performance.icon} size={16} className={performance.color} />
                )}
              </div>
              <div className="text-xl font-heading-semibold text-text-primary">
                {formatValue(currentValue, selectedMetricData?.format)}
              </div>
              {item.category === 'Your Performance' && targetValue && (
                <div className="text-xs text-text-secondary mt-1">
                  {((currentValue / targetValue) * 100).toFixed(1)}% of target
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="mb-6">
        {viewType === 'bar' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockBenchmarkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="category" stroke="#7F8C8D" fontSize={12} />
              <YAxis stroke="#7F8C8D" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={selectedMetric} 
                fill="#1E3A5F"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Your Performance"
                dataKey="yourScore"
                stroke="#1E3A5F"
                fill="#1E3A5F"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="#27AE60"
                fill="#27AE60"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Radar
                name="Industry Average"
                dataKey="industry"
                stroke="#E67E22"
                fill="#E67E22"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="3 3"
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-background rounded-lg p-4">
        <h4 className="font-body-medium text-text-primary mb-3">Performance Insights</h4>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success mt-0.5" />
            <div>
              <p className="text-sm text-text-primary">
                Your ROI performance is <span className="font-body-medium">25% above</span> industry average
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Target" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm text-text-primary">
                Deal velocity is <span className="font-body-medium">18% below</span> company target
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Award" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm text-text-primary">
                Profit margin ranks in <span className="font-body-medium">top 20%</span> of team performance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="text-sm text-text-secondary">
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onBenchmarkUpdate && onBenchmarkUpdate()}
            iconName="RefreshCw"
            size="sm"
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            onClick={() => console.log('Generate benchmark report')}
            iconName="FileText"
            size="sm"
          >
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkingPanel;