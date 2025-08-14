import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterSidebar = ({ filters, onFiltersChange, onSavePreset, savedPresets, onLoadPreset }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);

  const stages = [
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'active', label: 'Active' },
    { id: 'underwriting', label: 'Underwriting' },
    { id: 'pending', label: 'Pending Approval' },
    { id: 'approved', label: 'Approved' },
    { id: 'closed', label: 'Closed' }
  ];

  const propertyTypes = [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'retail', label: 'Retail' },
    { id: 'mixed-use', label: 'Mixed-Use' }
  ];

  const teamMembers = [
    { id: 'john_doe', label: 'John Doe' },
    { id: 'sarah_johnson', label: 'Sarah Johnson' },
    { id: 'mike_chen', label: 'Mike Chen' },
    { id: 'lisa_wang', label: 'Lisa Wang' },
    { id: 'david_brown', label: 'David Brown' }
  ];

  const priorities = [
    { id: 'high', label: 'High Priority' },
    { id: 'medium', label: 'Medium Priority' },
    { id: 'low', label: 'Low Priority' }
  ];

  const handleFilterChange = (filterType, value, checked) => {
    const currentValues = filters[filterType] || [];
    let newValues;

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    onFiltersChange({
      ...filters,
      [filterType]: newValues
    });
  };

  const handleRangeChange = (filterType, field, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: {
        ...filters[filterType],
        [field]: value
      }
    });
  };

  const handleDateChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName.trim(), filters);
      setPresetName('');
      setShowPresetInput(false);
    }
  };

  const handleClearFilters = () => {
    onFiltersChange({
      stages: [],
      propertyTypes: [],
      teamMembers: [],
      priorities: [],
      valueRange: { min: '', max: '' },
      dateRange: { start: '', end: '' }
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.stages?.length) count += filters.stages.length;
    if (filters.propertyTypes?.length) count += filters.propertyTypes.length;
    if (filters.teamMembers?.length) count += filters.teamMembers.length;
    if (filters.priorities?.length) count += filters.priorities.length;
    if (filters.valueRange?.min || filters.valueRange?.max) count += 1;
    if (filters.dateRange?.start || filters.dateRange?.end) count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  if (isCollapsed) {
    return (
      <div className="w-12 bg-surface border-r border-border p-2">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-smooth"
          title="Expand Filters"
        >
          <Icon name="ChevronRight" size={16} />
        </button>
        {activeFilterCount > 0 && (
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-2 mx-auto">
            {activeFilterCount}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-heading-medium text-text-primary">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              onClick={handleClearFilters}
              disabled={activeFilterCount === 0}
            />
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-h-screen overflow-y-auto">
        {/* Saved Presets */}
        <div>
          <h4 className="font-heading-medium text-text-primary text-sm mb-3">Saved Presets</h4>
          <div className="space-y-2">
            {savedPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onLoadPreset(preset)}
                className="w-full text-left p-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded transition-smooth flex items-center justify-between"
              >
                <span>{preset.name}</span>
                <Icon name="ChevronRight" size={14} />
              </button>
            ))}
          </div>
          
          {showPresetInput ? (
            <div className="mt-2 space-y-2">
              <Input
                type="text"
                placeholder="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="text-sm"
              />
              <div className="flex space-x-2">
                <Button variant="primary" size="sm" onClick={handleSavePreset}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowPresetInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={() => setShowPresetInput(true)}
              className="w-full mt-2"
              disabled={activeFilterCount === 0}
            >
              Save Current Filters
            </Button>
          )}
        </div>

        {/* Deal Stages */}
        <div>
          <h4 className="font-heading-medium text-text-primary text-sm mb-3">Deal Stages</h4>
          <div className="space-y-2">
            {stages.map((stage) => (
              <label key={stage.id} className="flex items-center space-x-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={filters.stages?.includes(stage.id) || false}
                  onChange={(e) => handleFilterChange('stages', stage.id, e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-text-secondary">{stage.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div>
          <h4 className="font-heading-medium text-text-primary text-sm mb-3">Property Types</h4>
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={filters.propertyTypes?.includes(type.id) || false}
                  onChange={(e) => handleFilterChange('propertyTypes', type.id, e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-text-secondary">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div>
          <h4 className="font-heading-medium text-text-primary text-sm mb-3">Assigned To</h4>
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <label key={member.id} className="flex items-center space-x-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={filters.teamMembers?.includes(member.id) || false}
                  onChange={(e) => handleFilterChange('teamMembers', member.id, e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-text-secondary">{member.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <h4 className="font-heading-medium text-text-primary text-sm mb-3">Priority</h4>
          <div className="space-y-2">
            {priorities.map((priority) => (
              <label key={priority.id} className="flex items-center space-x-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={filters.priorities?.includes(priority.id) || false}
                  onChange={(e) => handleFilterChange('priorities', priority.id, e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-text-secondary">{priority.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Value Range */}
        <div>
          <h4 className="font-heading-medium text-text-primary text-sm mb-3">Deal Value Range</h4>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Min value"
              value={filters.valueRange?.min || ''}
              onChange={(e) => handleRangeChange('valueRange', 'min', e.target.value)}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Max value"
              value={filters.valueRange?.max || ''}
              onChange={(e) => handleRangeChange('valueRange', 'max', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <h4 className="font-heading-medium text-text-primary text-sm mb-3">Date Range</h4>
          <div className="space-y-2">
            <Input
              type="date"
              value={filters.dateRange?.start || ''}
              onChange={(e) => handleDateChange('dateRange', { ...filters.dateRange, start: e.target.value })}
              className="text-sm"
            />
            <Input
              type="date"
              value={filters.dateRange?.end || ''}
              onChange={(e) => handleDateChange('dateRange', { ...filters.dateRange, end: e.target.value })}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;