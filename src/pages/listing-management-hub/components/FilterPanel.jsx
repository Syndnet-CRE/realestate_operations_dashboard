import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ 
  onFiltersChange, 
  onSavePreset, 
  onLoadPreset,
  savedPresets = [],
  isOpen = false,
  onToggle 
}) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    propertyType: 'all',
    priceRange: { min: '', max: '' },
    bedrooms: 'all',
    bathrooms: 'all',
    agent: 'all',
    listingDateRange: { start: '', end: '' },
    priority: 'all',
    marketingStatus: 'all'
  });

  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
    { value: 'withdrawn', label: 'Withdrawn' },
    { value: 'draft', label: 'Draft' }
  ];

  const propertyTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'single-family', label: 'Single Family' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'multi-family', label: 'Multi-Family' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' }
  ];

  const bedroomOptions = [
    { value: 'all', label: 'Any Bedrooms' },
    { value: '1', label: '1+ Bedroom' },
    { value: '2', label: '2+ Bedrooms' },
    { value: '3', label: '3+ Bedrooms' },
    { value: '4', label: '4+ Bedrooms' },
    { value: '5', label: '5+ Bedrooms' }
  ];

  const bathroomOptions = [
    { value: 'all', label: 'Any Bathrooms' },
    { value: '1', label: '1+ Bathroom' },
    { value: '2', label: '2+ Bathrooms' },
    { value: '3', label: '3+ Bathrooms' },
    { value: '4', label: '4+ Bathrooms' }
  ];

  const agentOptions = [
    { value: 'all', label: 'All Agents' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'mike-chen', label: 'Mike Chen' },
    { value: 'lisa-rodriguez', label: 'Lisa Rodriguez' },
    { value: 'david-kim', label: 'David Kim' },
    { value: 'emma-wilson', label: 'Emma Wilson' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const marketingStatusOptions = [
    { value: 'all', label: 'All Marketing Status' },
    { value: 'new', label: 'New Listing' },
    { value: 'featured', label: 'Featured' },
    { value: 'price-reduced', label: 'Price Reduced' },
    { value: 'open-house', label: 'Open House' },
    { value: 'virtual-tour', label: 'Virtual Tour Available' }
  ];

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const handleDateRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      listingDateRange: {
        ...prev.listingDateRange,
        [type]: value
      }
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      propertyType: 'all',
      priceRange: { min: '', max: '' },
      bedrooms: 'all',
      bathrooms: 'all',
      agent: 'all',
      listingDateRange: { start: '', end: '' },
      priority: 'all',
      marketingStatus: 'all'
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset(presetName.trim(), filters);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const handleLoadPreset = (preset) => {
    setFilters(preset.filters);
    if (onLoadPreset) {
      onLoadPreset(preset);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.propertyType !== 'all') count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.bedrooms !== 'all') count++;
    if (filters.bathrooms !== 'all') count++;
    if (filters.agent !== 'all') count++;
    if (filters.listingDateRange.start || filters.listingDateRange.end) count++;
    if (filters.priority !== 'all') count++;
    if (filters.marketingStatus !== 'all') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-surface border-r border-border transition-all duration-300 ${isOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-heading-medium text-text-primary">Filters</h3>
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-background rounded transition-smooth"
            >
              <Icon name="X" size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Search Properties
            </label>
            <Input
              type="search"
              placeholder="Search by title, address, MLS..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Listing Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {propertyTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {bedroomOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Bathrooms
            </label>
            <select
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {bathroomOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Agent */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Listing Agent
            </label>
            <select
              value={filters.agent}
              onChange={(e) => handleFilterChange('agent', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {agentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Listing Date Range */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Listing Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={filters.listingDateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
              />
              <Input
                type="date"
                value={filters.listingDateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Priority Level
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Marketing Status */}
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Marketing Status
            </label>
            <select
              value={filters.marketingStatus}
              onChange={(e) => handleFilterChange('marketingStatus', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              {marketingStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Saved Presets */}
          {savedPresets.length > 0 && (
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Saved Filter Presets
              </label>
              <div className="space-y-2">
                {savedPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleLoadPreset(preset)}
                    className="w-full text-left px-3 py-2 bg-background hover:bg-border rounded-lg transition-smooth text-sm"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save Current Preset */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-body-medium text-text-primary">
                Save Current Filters
              </label>
              <button
                onClick={() => setShowSavePreset(!showSavePreset)}
                className="text-primary hover:text-primary/80 text-sm"
              >
                {showSavePreset ? 'Cancel' : 'Save Preset'}
              </button>
            </div>
            {showSavePreset && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Preset name..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={handleSavePreset}
                  disabled={!presetName.trim()}
                  className="w-full"
                >
                  Save Preset
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="w-full"
            iconName="RotateCcw"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;