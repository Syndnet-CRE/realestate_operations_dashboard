import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ 
  onFiltersChange, 
  savedTemplates = [],
  onSaveTemplate,
  onLoadTemplate,
  isOpen = false,
  onToggle 
}) => {
  const [filters, setFilters] = useState({
    dateRange: '6m',
    propertyType: 'all',
    region: 'all',
    teamMember: 'all',
    minValue: '',
    maxValue: '',
    status: 'all'
  });

  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);

  const propertyTypes = [
    { id: 'all', label: 'All Property Types' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'mixed-use', label: 'Mixed Use' },
    { id: 'retail', label: 'Retail' }
  ];

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'downtown', label: 'Downtown' },
    { id: 'suburbs', label: 'Suburbs' },
    { id: 'waterfront', label: 'Waterfront' },
    { id: 'industrial-zone', label: 'Industrial Zone' }
  ];

  const teamMembers = [
    { id: 'all', label: 'All Team Members' },
    { id: 'john-doe', label: 'John Doe' },
    { id: 'sarah-johnson', label: 'Sarah Johnson' },
    { id: 'mike-chen', label: 'Mike Chen' },
    { id: 'lisa-wang', label: 'Lisa Wang' }
  ];

  const statusOptions = [
    { id: 'all', label: 'All Statuses' },
    { id: 'active', label: 'Active' },
    { id: 'closed', label: 'Closed' },
    { id: 'pending', label: 'Pending' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const dateRanges = [
    { id: '1m', label: 'Last Month' },
    { id: '3m', label: 'Last 3 Months' },
    { id: '6m', label: 'Last 6 Months' },
    { id: '1y', label: 'Last Year' },
    { id: 'ytd', label: 'Year to Date' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const defaultTemplates = [
    { id: 'executive-summary', name: 'Executive Summary', filters: { dateRange: '1y', propertyType: 'all', region: 'all' } },
    { id: 'monthly-report', name: 'Monthly Report', filters: { dateRange: '1m', propertyType: 'all', region: 'all' } },
    { id: 'commercial-focus', name: 'Commercial Focus', filters: { dateRange: '6m', propertyType: 'commercial', region: 'all' } },
    { id: 'regional-analysis', name: 'Regional Analysis', filters: { dateRange: '3m', propertyType: 'all', region: 'downtown' } }
  ];

  const allTemplates = [...defaultTemplates, ...savedTemplates];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleSaveTemplate = () => {
    if (templateName.trim() && onSaveTemplate) {
      onSaveTemplate({
        id: `custom-${Date.now()}`,
        name: templateName,
        filters: { ...filters }
      });
      setTemplateName('');
      setShowSaveTemplate(false);
    }
  };

  const handleLoadTemplate = (template) => {
    setFilters(template.filters);
    if (onFiltersChange) {
      onFiltersChange(template.filters);
    }
    if (onLoadTemplate) {
      onLoadTemplate(template);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateRange: '6m',
      propertyType: 'all',
      region: 'all',
      teamMember: 'all',
      minValue: '',
      maxValue: '',
      status: 'all'
    };
    setFilters(resetFilters);
    if (onFiltersChange) {
      onFiltersChange(resetFilters);
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== 'all' && value !== '' && value !== '6m'
    ).length;
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        iconName="Filter"
        className="relative"
      >
        Filters
        {getActiveFilterCount() > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
            {getActiveFilterCount()}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading-medium text-text-primary text-lg">Advanced Filters</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            iconName="RotateCcw"
            size="sm"
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            onClick={onToggle}
            iconName="X"
            size="sm"
          />
        </div>
      </div>

      {/* Saved Templates */}
      <div>
        <h4 className="font-body-medium text-text-primary mb-3">Report Templates</h4>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {allTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleLoadTemplate(template)}
              className="p-3 text-left bg-background hover:bg-border rounded-lg transition-smooth"
            >
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-text-secondary" />
                <span className="text-sm font-body-medium text-text-primary">
                  {template.name}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        {!showSaveTemplate ? (
          <Button
            variant="ghost"
            onClick={() => setShowSaveTemplate(true)}
            iconName="Plus"
            size="sm"
          >
            Save Current as Template
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={handleSaveTemplate}
              size="sm"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowSaveTemplate(false)}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-body-medium text-text-primary mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          >
            {dateRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
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
            className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          >
            {propertyTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-body-medium text-text-primary mb-2">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        {/* Team Member */}
        <div>
          <label className="block text-sm font-body-medium text-text-primary mb-2">
            Team Member
          </label>
          <select
            value={filters.teamMember}
            onChange={(e) => handleFilterChange('teamMember', e.target.value)}
            className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          >
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value Range */}
        <div>
          <label className="block text-sm font-body-medium text-text-primary mb-2">
            Min Value
          </label>
          <Input
            type="number"
            placeholder="$0"
            value={filters.minValue}
            onChange={(e) => handleFilterChange('minValue', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-body-medium text-text-primary mb-2">
            Max Value
          </label>
          <Input
            type="number"
            placeholder="No limit"
            value={filters.maxValue}
            onChange={(e) => handleFilterChange('maxValue', e.target.value)}
          />
        </div>
      </div>

      {/* Apply Filters */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-text-secondary">
          {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            size="sm"
          >
            Clear All
          </Button>
          <Button
            variant="primary"
            onClick={() => onFiltersChange && onFiltersChange(filters)}
            size="sm"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;