import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import Button from '../../../components/ui/Button';

const ForecastingWidget = ({ 
  title = "Revenue Forecasting",
  historicalData = [],
  forecastPeriod = 6,
  onForecastUpdate 
}) => {
  const [selectedModel, setSelectedModel] = useState('linear');
  const [confidenceLevel, setConfidenceLevel] = useState(80);
  const [showConfidenceBands, setShowConfidenceBands] = useState(true);

  const forecastModels = [
    { id: 'linear', name: 'Linear Trend', description: 'Simple linear progression' },
    { id: 'seasonal', name: 'Seasonal', description: 'Accounts for seasonal patterns' },
    { id: 'exponential', name: 'Exponential', description: 'Exponential growth model' },
    { id: 'arima', name: 'ARIMA', description: 'Advanced time series analysis' }
  ];

  const mockHistoricalData = historicalData.length > 0 ? historicalData : [
    { month: 'Jan', actual: 2400000, type: 'historical' },
    { month: 'Feb', actual: 2100000, type: 'historical' },
    { month: 'Mar', actual: 2800000, type: 'historical' },
    { month: 'Apr', actual: 3200000, type: 'historical' },
    { month: 'May', actual: 2900000, type: 'historical' },
    { month: 'Jun', actual: 3500000, type: 'historical' }
  ];

  const generateForecast = () => {
    const lastValue = mockHistoricalData[mockHistoricalData.length - 1].actual;
    const trend = selectedModel === 'exponential' ? 1.05 : 50000;
    
    const forecastData = [];
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < forecastPeriod; i++) {
      let forecastValue;
      
      switch (selectedModel) {
        case 'exponential':
          forecastValue = lastValue * Math.pow(trend, i + 1);
          break;
        case 'seasonal':
          const seasonalFactor = [1.1, 0.9, 1.2, 1.0, 0.8, 1.3][i % 6];
          forecastValue = (lastValue + (trend * (i + 1))) * seasonalFactor;
          break;
        case 'arima':
          forecastValue = lastValue + (trend * (i + 1)) + (Math.random() - 0.5) * 100000;
          break;
        default:
          forecastValue = lastValue + (trend * (i + 1));
      }
      
      const confidenceMargin = forecastValue * (0.1 + (i * 0.02));
      
      forecastData.push({
        month: months[i] || `Month ${i + 1}`,
        forecast: Math.round(forecastValue),
        upper: Math.round(forecastValue + confidenceMargin),
        lower: Math.round(forecastValue - confidenceMargin),
        type: 'forecast'
      });
    }
    
    return forecastData;
  };

  const forecastData = generateForecast();
  const combinedData = [
    ...mockHistoricalData.map(d => ({ ...d, forecast: null, upper: null, lower: null })),
    ...forecastData.map(d => ({ ...d, actual: null }))
  ];

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-interactive">
          <p className="font-body-medium text-text-primary mb-2">{label}</p>
          {data.actual && (
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-text-secondary">Actual:</span>
              <span className="font-body-medium text-text-primary">
                {formatCurrency(data.actual)}
              </span>
            </div>
          )}
          {data.forecast && (
            <>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-text-secondary">Forecast:</span>
                <span className="font-body-medium text-text-primary">
                  {formatCurrency(data.forecast)}
                </span>
              </div>
              {showConfidenceBands && data.upper && data.lower && (
                <div className="text-xs text-text-secondary mt-1">
                  Range: {formatCurrency(data.lower)} - {formatCurrency(data.upper)}
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const calculateAccuracy = () => {
    // Mock accuracy calculation
    const accuracyByModel = {
      linear: 78,
      seasonal: 85,
      exponential: 72,
      arima: 91
    };
    return accuracyByModel[selectedModel] || 80;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading-medium text-text-primary text-lg">{title}</h3>
          <p className="text-text-secondary text-sm">
            Predictive analysis based on historical performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-sm text-text-secondary">Model Accuracy</div>
            <div className="font-body-medium text-success">{calculateAccuracy()}%</div>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="mb-6">
        <h4 className="font-body-medium text-text-primary mb-3">Forecasting Model</h4>
        <div className="grid grid-cols-2 gap-2">
          {forecastModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`p-3 text-left rounded-lg border transition-smooth ${
                selectedModel === model.id
                  ? 'border-primary bg-primary/5' :'border-border hover:bg-background'
              }`}
            >
              <div className="font-body-medium text-text-primary text-sm">
                {model.name}
              </div>
              <div className="text-text-secondary text-xs">
                {model.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="month" stroke="#7F8C8D" fontSize={12} />
            <YAxis stroke="#7F8C8D" fontSize={12} tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Historical Data */}
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#1E3A5F" 
              strokeWidth={3}
              dot={{ fill: '#1E3A5F', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            
            {/* Forecast Data */}
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="#E67E22" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#E67E22', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            
            {/* Confidence Bands */}
            {showConfidenceBands && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="upper" 
                  stroke="#E67E22" 
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  dot={false}
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="lower" 
                  stroke="#E67E22" 
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  dot={false}
                  connectNulls={false}
                />
              </>
            )}
            
            {/* Divider between historical and forecast */}
            <ReferenceLine 
              x="Jun" 
              stroke="#7F8C8D" 
              strokeDasharray="2 2" 
              strokeOpacity={0.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showConfidenceBands}
              onChange={(e) => setShowConfidenceBands(e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
            />
            <span className="text-sm text-text-primary">Show confidence bands</span>
          </label>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Confidence:</span>
            <select
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(Number(e.target.value))}
              className="p-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={70}>70%</option>
              <option value={80}>80%</option>
              <option value={90}>90%</option>
              <option value={95}>95%</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onForecastUpdate && onForecastUpdate(forecastData)}
            iconName="RefreshCw"
            size="sm"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => console.log('Export forecast data')}
            iconName="Download"
            size="sm"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-text-secondary">Historical Data</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <span className="text-sm text-text-secondary">Forecast</span>
        </div>
        {showConfidenceBands && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-accent opacity-30"></div>
            <span className="text-sm text-text-secondary">Confidence Range</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastingWidget;