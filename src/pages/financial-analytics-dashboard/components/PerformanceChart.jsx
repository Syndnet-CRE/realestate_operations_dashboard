import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';


const PerformanceChart = ({ 
  title, 
  data = [], 
  type = 'line', 
  height = 300,
  showControls = true,
  allowTypeSwitch = true 
}) => {
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('6m');

  const timeRanges = [
    { id: '1m', label: '1M' },
    { id: '3m', label: '3M' },
    { id: '6m', label: '6M' },
    { id: '1y', label: '1Y' },
    { id: 'all', label: 'All' }
  ];

  const chartTypes = [
    { id: 'line', label: 'Line', icon: 'TrendingUp' },
    { id: 'bar', label: 'Bar', icon: 'BarChart3' },
    { id: 'pie', label: 'Pie', icon: 'PieChart' }
  ];

  const mockData = data.length > 0 ? data : [
    { month: 'Jan', revenue: 2400000, profit: 480000, deals: 12 },
    { month: 'Feb', revenue: 2100000, profit: 420000, deals: 10 },
    { month: 'Mar', revenue: 2800000, profit: 560000, deals: 14 },
    { month: 'Apr', revenue: 3200000, profit: 640000, deals: 16 },
    { month: 'May', revenue: 2900000, profit: 580000, deals: 15 },
    { month: 'Jun', revenue: 3500000, profit: 700000, deals: 18 }
  ];

  const pieData = [
    { name: 'Residential', value: 45, color: '#1E3A5F' },
    { name: 'Commercial', value: 30, color: '#4A90A4' },
    { name: 'Industrial', value: 15, color: '#E67E22' },
    { name: 'Mixed Use', value: 10, color: '#27AE60' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-interactive">
          <p className="font-body-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-text-secondary">{entry.dataKey}:</span>
              <span className="font-body-medium text-text-primary">
                {entry.dataKey.includes('revenue') || entry.dataKey.includes('profit') 
                  ? formatCurrency(entry.value) 
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="month" stroke="#7F8C8D" fontSize={12} />
              <YAxis stroke="#7F8C8D" fontSize={12} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#4A90A4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="month" stroke="#7F8C8D" fontSize={12} />
              <YAxis stroke="#7F8C8D" fontSize={12} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#1E3A5F" 
                strokeWidth={3}
                dot={{ fill: '#1E3A5F', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#4A90A4" 
                strokeWidth={3}
                dot={{ fill: '#4A90A4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading-medium text-text-primary text-lg">{title}</h3>
        
        {showControls && (
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-3 py-1 text-sm rounded-md transition-smooth ${
                    timeRange === range.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Chart Type Selector */}
            {allowTypeSwitch && (
              <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
                {chartTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    className={`p-2 rounded-md transition-smooth ${
                      chartType === type.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                    title={type.label}
                  >
                    <Icon name={type.icon} size={16} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full">
        {renderChart()}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-text-secondary">Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-secondary rounded-full"></div>
          <span className="text-sm text-text-secondary">Profit</span>
        </div>
        {chartType === 'line' && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-sm text-text-secondary">Deals</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;