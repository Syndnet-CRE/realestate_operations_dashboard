import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ 
  selectedCount = 0, 
  onClearSelection, 
  onBulkAction,
  isVisible = false 
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const bulkActions = [
    {
      id: 'status-change',
      label: 'Change Status',
      icon: 'ToggleLeft',
      options: [
        { value: 'active', label: 'Set to Active', color: 'text-success' },
        { value: 'pending', label: 'Set to Pending', color: 'text-warning' },
        { value: 'withdrawn', label: 'Set to Withdrawn', color: 'text-error' },
        { value: 'draft', label: 'Set to Draft', color: 'text-text-secondary' }
      ]
    },
    {
      id: 'price-update',
      label: 'Price Update',
      icon: 'DollarSign',
      options: [
        { value: 'increase-5', label: 'Increase by 5%', color: 'text-success' },
        { value: 'decrease-5', label: 'Decrease by 5%', color: 'text-warning' },
        { value: 'increase-10', label: 'Increase by 10%', color: 'text-success' },
        { value: 'decrease-10', label: 'Decrease by 10%', color: 'text-error' },
        { value: 'custom', label: 'Custom Price Change', color: 'text-primary' }
      ]
    },
    {
      id: 'marketing-status',
      label: 'Marketing Status',
      icon: 'Megaphone',
      options: [
        { value: 'featured', label: 'Mark as Featured', color: 'text-accent' },
        { value: 'price-reduced', label: 'Mark Price Reduced', color: 'text-warning' },
        { value: 'open-house', label: 'Schedule Open House', color: 'text-primary' },
        { value: 'virtual-tour', label: 'Add Virtual Tour', color: 'text-success' },
        { value: 'remove-marketing', label: 'Remove Marketing Tags', color: 'text-text-secondary' }
      ]
    },
    {
      id: 'agent-assignment',
      label: 'Assign Agent',
      icon: 'UserCheck',
      options: [
        { value: 'sarah-johnson', label: 'Assign to Sarah Johnson', color: 'text-primary' },
        { value: 'mike-chen', label: 'Assign to Mike Chen', color: 'text-primary' },
        { value: 'lisa-rodriguez', label: 'Assign to Lisa Rodriguez', color: 'text-primary' },
        { value: 'david-kim', label: 'Assign to David Kim', color: 'text-primary' },
        { value: 'emma-wilson', label: 'Assign to Emma Wilson', color: 'text-primary' }
      ]
    },
    {
      id: 'mls-sync',
      label: 'MLS Actions',
      icon: 'RefreshCw',
      options: [
        { value: 'sync-mls', label: 'Sync to MLS', color: 'text-success' },
        { value: 'update-mls', label: 'Update MLS Listing', color: 'text-primary' },
        { value: 'remove-mls', label: 'Remove from MLS', color: 'text-error' }
      ]
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: 'Download',
      options: [
        { value: 'export-pdf', label: 'Export as PDF Report', color: 'text-primary' },
        { value: 'export-excel', label: 'Export to Excel', color: 'text-success' },
        { value: 'export-csv', label: 'Export as CSV', color: 'text-primary' },
        { value: 'export-marketing', label: 'Export Marketing Materials', color: 'text-accent' }
      ]
    }
  ];

  const handleBulkAction = (actionId, optionValue) => {
    const action = bulkActions.find(a => a.id === actionId);
    const option = action?.options.find(o => o.value === optionValue);
    
    if (action && option) {
      setPendingAction({ action, option, actionId, optionValue });
      setShowConfirmation(true);
    }
  };

  const confirmBulkAction = () => {
    if (pendingAction && onBulkAction) {
      onBulkAction(pendingAction.actionId, pendingAction.optionValue, selectedCount);
    }
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const cancelBulkAction = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-surface border border-border rounded-lg shadow-modal z-50 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-body-medium text-text-primary">
              {selectedCount} propert{selectedCount !== 1 ? 'ies' : 'y'} selected
            </span>
          </div>

          <div className="h-6 w-px bg-border"></div>

          <div className="flex items-center space-x-2">
            {bulkActions.map((action) => (
              <div key={action.id} className="relative group">
                <Button
                  variant="ghost"
                  iconName={action.icon}
                  className="text-sm px-3 py-2"
                >
                  {action.label}
                </Button>
                
                {/* Dropdown Menu */}
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-surface border border-border rounded-lg shadow-interactive opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-dropdown">
                  <div className="p-2">
                    <div className="text-xs font-body-medium text-text-secondary mb-2 px-2">
                      {action.label}
                    </div>
                    {action.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleBulkAction(action.id, option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-background transition-smooth text-sm ${option.color}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-6 w-px bg-border"></div>

          <Button
            variant="ghost"
            onClick={onClearSelection}
            iconName="X"
            className="text-sm px-3 py-2"
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && pendingAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="font-heading-medium text-text-primary">
                  Confirm Bulk Action
                </h3>
                <p className="text-text-secondary text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-text-primary mb-2">
                You are about to perform the following action:
              </p>
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name={pendingAction.action.icon} size={16} className="text-primary" />
                  <span className="font-body-medium text-text-primary">
                    {pendingAction.action.label}
                  </span>
                </div>
                <p className={`text-sm ${pendingAction.option.color}`}>
                  {pendingAction.option.label}
                </p>
                <p className="text-text-secondary text-sm mt-2">
                  This will affect {selectedCount} selected propert{selectedCount !== 1 ? 'ies' : 'y'}.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={cancelBulkAction}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmBulkAction}
              >
                Confirm Action
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;