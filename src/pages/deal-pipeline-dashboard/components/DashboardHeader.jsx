import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import GlobalSearchInterface from '../../../components/ui/GlobalSearchInterface';

const DashboardHeader = ({ 
  onSearch, 
  onFilterPresetSelect, 
  onExport, 
  onSync, 
  syncStatus,
  totalDeals,
  activeDeals,
  userRole 
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const filterPresets = [
    { id: 'all', label: 'All Deals', icon: 'List' },
    { id: 'my_deals', label: 'My Deals', icon: 'User' },
    { id: 'urgent', label: 'Urgent', icon: 'AlertTriangle' },
    { id: 'high_value', label: 'High Value', icon: 'DollarSign' },
    { id: 'closing_soon', label: 'Closing Soon', icon: 'Clock' },
    { id: 'needs_attention', label: 'Needs Attention', icon: 'AlertCircle' }
  ];

  const quickActions = [
    { id: 'new_deal', label: 'New Deal', icon: 'Plus', shortcut: 'Ctrl+N' },
    { id: 'import_data', label: 'Import Data', icon: 'Upload', shortcut: 'Ctrl+I' },
    { id: 'bulk_update', label: 'Bulk Update', icon: 'Edit3', shortcut: 'Ctrl+B' },
    { id: 'generate_report', label: 'Generate Report', icon: 'FileText', shortcut: 'Ctrl+R' }
  ];

  const getSyncStatusColor = (status) => {
    switch (status) {
      case 'synced': return 'text-success';
      case 'syncing': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'synced': return 'CheckCircle';
      case 'syncing': return 'RefreshCw';
      case 'error': return 'AlertCircle';
      default: return 'Cloud';
    }
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action:', actionId);
    setShowQuickActions(false);
    
    switch (actionId) {
      case 'new_deal':
        // Navigate to new deal form
        break;
      case 'import_data':
        // Open import dialog
        break;
      case 'bulk_update':
        // Open bulk update dialog
        break;
      case 'generate_report':
        onExport();
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-surface border-b border-border p-6">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading-semibold text-text-primary mb-2">
            Deal Pipeline Dashboard
          </h1>
          <div className="flex items-center space-x-6 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <Icon name="BarChart3" size={16} />
              <span>{totalDeals} Total Deals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={16} />
              <span>{activeDeals} Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="User" size={16} />
              <span className="capitalize">{userRole.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sync Status */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSync}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${getSyncStatusColor(syncStatus)} hover:bg-background`}
              title="Sync with external systems"
            >
              <Icon 
                name={getSyncStatusIcon(syncStatus)} 
                size={16} 
                className={syncStatus === 'syncing' ? 'animate-spin' : ''} 
              />
              <span className="text-sm capitalize">{syncStatus}</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="relative">
            <Button
              variant="outline"
              iconName="Zap"
              onClick={() => setShowQuickActions(!showQuickActions)}
            >
              Quick Actions
            </Button>

            {showQuickActions && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-lg shadow-interactive z-dropdown">
                <div className="p-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="w-full flex items-center justify-between p-2 text-sm text-text-primary hover:bg-background rounded transition-smooth"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name={action.icon} size={16} />
                        <span>{action.label}</span>
                      </div>
                      <kbd className="text-xs text-text-secondary bg-background px-1 py-0.5 rounded">
                        {action.shortcut}
                      </kbd>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          <Button variant="outline" iconName="Download" onClick={onExport}>
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-4">
        {/* Global Search */}
        <div className="flex-1 max-w-2xl">
          <GlobalSearchInterface
            onSearch={onSearch}
            placeholder="Search deals, properties, documents..."
            showAdvancedFilters={true}
            recentSearches={['Sunset Plaza', 'Marina Bay', 'Downtown Office']}
          />
        </div>

        {/* Filter Presets */}
        <div className="flex items-center space-x-2">
          {filterPresets.slice(0, 4).map((preset) => (
            <button
              key={preset.id}
              onClick={() => onFilterPresetSelect(preset)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-smooth"
            >
              <Icon name={preset.icon} size={14} />
              <span>{preset.label}</span>
            </button>
          ))}
          
          {/* More Presets Dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-smooth">
              <Icon name="MoreHorizontal" size={14} />
              <span>More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center space-x-4">
          <span>Keyboard shortcuts:</span>
          <div className="flex items-center space-x-2">
            <kbd className="px-1 py-0.5 bg-background border border-border rounded">Ctrl+K</kbd>
            <span>Search</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1 py-0.5 bg-background border border-border rounded">Ctrl+N</kbd>
            <span>New Deal</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1 py-0.5 bg-background border border-border rounded">Ctrl+F</kbd>
            <span>Focus Filters</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Wifi" size={12} className="text-success" />
          <span>Real-time updates active</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;