import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AcquisitionPipeline = ({ properties, selectedProperty, onPropertySelect, onNewProperty }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stageFilters = [
    { id: 'all', label: 'All Properties', count: properties.length },
    { id: 'identification', label: 'Identification', count: properties.filter(p => p.stage === 'identification').length },
    { id: 'analysis', label: 'Analysis', count: properties.filter(p => p.stage === 'analysis').length },
    { id: 'due-diligence', label: 'Due Diligence', count: properties.filter(p => p.stage === 'due-diligence').length },
    { id: 'approval', label: 'Approval', count: properties.filter(p => p.stage === 'approval').length },
    { id: 'closing', label: 'Closing', count: properties.filter(p => p.stage === 'closing').length }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' || property.stage === filter;
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStageColor = (stage) => {
    switch (stage) {
      case 'identification': return 'bg-text-secondary/10 text-text-secondary';
      case 'analysis': return 'bg-accent/10 text-accent';
      case 'due-diligence': return 'bg-warning/10 text-warning';
      case 'approval': return 'bg-primary/10 text-primary';
      case 'closing': return 'bg-success/10 text-success';
      default: return 'bg-background text-text-secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-error';
      case 'medium': return 'border-l-4 border-warning';
      case 'low': return 'border-l-4 border-success';
      default: return '';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading-medium text-text-primary">Acquisition Pipeline</h3>
          <Button
            variant="primary"
            iconName="Plus"
            onClick={onNewProperty}
            className="text-xs px-3 py-1"
          >
            New
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        {/* Stage Filters */}
        <div className="space-y-1">
          {stageFilters.map(stageFilter => (
            <button
              key={stageFilter.id}
              onClick={() => setFilter(stageFilter.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-smooth ${
                filter === stageFilter.id 
                  ? 'bg-primary/10 text-primary' :'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <span>{stageFilter.label}</span>
              <span className="text-xs">{stageFilter.count}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Properties List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredProperties.length > 0 ? (
          <div className="space-y-2">
            {filteredProperties.map(property => (
              <button
                key={property.id}
                onClick={() => onPropertySelect(property)}
                className={`w-full p-3 text-left rounded-lg border transition-smooth hover:shadow-base ${
                  selectedProperty?.id === property.id 
                    ? 'border-primary bg-primary/5' :'border-border bg-surface hover:border-border-accent'
                } ${getPriorityColor(property.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-body-medium text-text-primary text-sm line-clamp-1">
                    {property.name}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStageColor(property.stage)}`}>
                    {property.stage.replace('-', ' ')}
                  </span>
                </div>
                
                <p className="text-text-secondary text-xs mb-2 line-clamp-1">
                  {property.address}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="font-data text-text-primary">
                    {property.price}
                  </span>
                  <div className="flex items-center space-x-2">
                    {property.daysInStage && (
                      <span className="text-text-secondary">
                        {property.daysInStage}d
                      </span>
                    )}
                    {property.priority === 'high' && (
                      <Icon name="AlertTriangle" size={12} className="text-error" />
                    )}
                  </div>
                </div>
                
                {property.nextDeadline && (
                  <div className="flex items-center space-x-1 mt-2 text-xs text-warning">
                    <Icon name="Clock" size={12} />
                    <span>Due: {property.nextDeadline}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Icon name="Search" size={24} className="text-text-secondary mb-2" />
            <p className="text-text-secondary text-sm">No properties found</p>
            <p className="text-text-secondary text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcquisitionPipeline;