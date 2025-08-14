import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PropertyComparison = ({ properties, onAddProperty, onRemoveProperty, onSelectProperty }) => {
  const [selectedProperties, setSelectedProperties] = useState([]);

  const mockProperties = [
    {
      id: 1,
      name: "Sunset Plaza",
      address: "123 Main Street",
      city: "Downtown",
      state: "CA",
      type: "Mixed-Use",
      purchasePrice: 2500000,
      squareFootage: 15000,
      capRate: 6.8,
      noi: 170000,
      cashOnCash: 9.2,
      dscr: 1.35,
      riskLevel: "medium",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Marina Bay Office",
      address: "456 Harbor Drive",
      city: "Marina",
      state: "CA",
      type: "Office",
      purchasePrice: 3200000,
      squareFootage: 18500,
      capRate: 7.2,
      noi: 230400,
      cashOnCash: 10.5,
      dscr: 1.42,
      riskLevel: "low",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Downtown Retail",
      address: "789 Commerce Ave",
      city: "Central",
      state: "CA",
      type: "Retail",
      purchasePrice: 1800000,
      squareFootage: 12000,
      capRate: 6.2,
      noi: 111600,
      cashOnCash: 8.1,
      dscr: 1.28,
      riskLevel: "high",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'high': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-background';
    }
  };

  const handlePropertySelect = (property) => {
    const isSelected = selectedProperties.find(p => p.id === property.id);
    if (isSelected) {
      setSelectedProperties(selectedProperties.filter(p => p.id !== property.id));
    } else if (selectedProperties.length < 3) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const getComparisonMetrics = () => {
    if (selectedProperties.length === 0) return [];
    
    const metrics = [
      { key: 'purchasePrice', label: 'Purchase Price', format: 'currency' },
      { key: 'squareFootage', label: 'Square Footage', format: 'number' },
      { key: 'capRate', label: 'Cap Rate', format: 'percentage' },
      { key: 'noi', label: 'NOI', format: 'currency' },
      { key: 'cashOnCash', label: 'Cash-on-Cash', format: 'percentage' },
      { key: 'dscr', label: 'DSCR', format: 'decimal' }
    ];

    return metrics;
  };

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency': return formatCurrency(value);
      case 'percentage': return formatPercentage(value);
      case 'decimal': return value.toFixed(2);
      case 'number': return value.toLocaleString();
      default: return value;
    }
  };

  const getBestValue = (metric, properties) => {
    const values = properties.map(p => p[metric.key]);
    switch (metric.key) {
      case 'capRate': case'cashOnCash': case'dscr':
        return Math.max(...values);
      case 'purchasePrice':
        return Math.min(...values);
      default:
        return Math.max(...values);
    }
  };

  const isHighlighted = (property, metric) => {
    if (selectedProperties.length < 2) return false;
    const bestValue = getBestValue(metric, selectedProperties);
    return property[metric.key] === bestValue;
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-base">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading-semibold text-text-primary">
            Property Comparison
          </h3>
          <Button
            variant="ghost"
            onClick={onAddProperty}
            iconName="Plus"
            className="text-sm"
          >
            Add Property
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockProperties.map((property) => {
            const isSelected = selectedProperties.find(p => p.id === property.id);
            return (
              <div
                key={property.id}
                className={`border rounded-lg p-3 cursor-pointer transition-smooth ${
                  isSelected 
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onClick={() => handlePropertySelect(property)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-background">
                    <Image
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(property.riskLevel)}`}>
                      {property.riskLevel}
                    </span>
                    {isSelected && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </div>
                </div>
                <h4 className="font-heading-medium text-text-primary text-sm mb-1">
                  {property.name}
                </h4>
                <p className="text-text-secondary text-xs mb-2">
                  {property.address}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Price:</span>
                    <span className="font-heading-medium">{formatCurrency(property.purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Cap Rate:</span>
                    <span className="font-heading-medium">{formatPercentage(property.capRate)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProperties.length > 0 && (
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-heading-medium text-text-primary mb-2">
              Comparison Analysis ({selectedProperties.length} properties selected)
            </h4>
            <p className="text-text-secondary text-sm">
              Select up to 3 properties to compare. Best values are highlighted.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-text-secondary font-heading-medium">Metric</th>
                  {selectedProperties.map((property) => (
                    <th key={property.id} className="text-right py-3 text-text-secondary font-heading-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <span>{property.name}</span>
                        <button
                          onClick={() => handlePropertySelect(property)}
                          className="text-text-secondary hover:text-error"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getComparisonMetrics().map((metric) => (
                  <tr key={metric.key} className="border-b border-border">
                    <td className="py-3 text-text-primary font-heading-medium">
                      {metric.label}
                    </td>
                    {selectedProperties.map((property) => (
                      <td
                        key={property.id}
                        className={`py-3 text-right font-heading-medium ${
                          isHighlighted(property, metric)
                            ? 'text-success bg-success/10 rounded' :'text-text-primary'
                        }`}
                      >
                        {formatValue(property[metric.key], metric.format)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success/20 rounded"></div>
                <span className="text-text-secondary text-sm">Best Value</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => setSelectedProperties([])}
                className="text-sm"
              >
                Clear Selection
              </Button>
              <Button
                variant="primary"
                onClick={() => console.log('Export comparison')}
                iconName="Download"
                className="text-sm"
              >
                Export Comparison
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyComparison;