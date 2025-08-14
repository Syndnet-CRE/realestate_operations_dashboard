import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkOperations = ({ selectedProperties, onBulkAction, onClearSelection }) => {
  const [activeOperation, setActiveOperation] = useState(null);
  const [operationData, setOperationData] = useState({});

  const bulkOperations = [
    {
      id: 'document-request',
      label: 'Request Documents',
      icon: 'FileText',
      description: 'Request specific documents from multiple properties',
      color: 'text-primary'
    },
    {
      id: 'status-update',
      label: 'Update Status',
      icon: 'RefreshCw',
      description: 'Change workflow stage for selected properties',
      color: 'text-accent'
    },
    {
      id: 'assign-team',
      label: 'Assign Team',
      icon: 'Users',
      description: 'Assign team members to selected properties',
      color: 'text-success'
    },
    {
      id: 'set-deadline',
      label: 'Set Deadlines',
      icon: 'Calendar',
      description: 'Set due dates for workflow stages',
      color: 'text-warning'
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: 'BarChart3',
      description: 'Create reports for selected properties',
      color: 'text-secondary'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: 'Download',
      description: 'Export property data to various formats',
      color: 'text-text-secondary'
    }
  ];

  const documentTypes = [
    'Financial Statements',
    'Property Appraisal',
    'Environmental Report',
    'Legal Documents',
    'Inspection Report',
    'Insurance Documents',
    'Title Documents',
    'Survey Reports'
  ];

  const workflowStages = [
    'identification',
    'analysis',
    'due-diligence',
    'approval',
    'closing'
  ];

  const teamMembers = [
    { id: 1, name: "Sarah Johnson", role: "Acquisition Manager" },
    { id: 2, name: "Michael Chen", role: "Due Diligence Specialist" },
    { id: 3, name: "Emily Rodriguez", role: "Financial Analyst" },
    { id: 4, name: "David Kim", role: "Legal Counsel" },
    { id: 5, name: "Lisa Thompson", role: "Property Inspector" }
  ];

  const handleOperationSelect = (operation) => {
    setActiveOperation(operation);
    setOperationData({});
  };

  const handleExecuteOperation = () => {
    if (onBulkAction && activeOperation) {
      onBulkAction(activeOperation.id, {
        properties: selectedProperties,
        data: operationData
      });
    }
    setActiveOperation(null);
    setOperationData({});
  };

  const handleDataChange = (key, value) => {
    setOperationData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderOperationForm = () => {
    if (!activeOperation) return null;

    switch (activeOperation.id) {
      case 'document-request':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Select Documents to Request
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {documentTypes.map(docType => (
                  <label key={docType} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={operationData.documents?.includes(docType) || false}
                      onChange={(e) => {
                        const docs = operationData.documents || [];
                        if (e.target.checked) {
                          handleDataChange('documents', [...docs, docType]);
                        } else {
                          handleDataChange('documents', docs.filter(d => d !== docType));
                        }
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-text-primary">{docType}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={operationData.dueDate || ''}
                onChange={(e) => handleDataChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Additional Notes
              </label>
              <textarea
                value={operationData.notes || ''}
                onChange={(e) => handleDataChange('notes', e.target.value)}
                placeholder="Add any specific instructions..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        );

      case 'status-update':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                New Workflow Stage
              </label>
              <select
                value={operationData.stage || ''}
                onChange={(e) => handleDataChange('stage', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select stage...</option>
                {workflowStages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Reason for Change
              </label>
              <textarea
                value={operationData.reason || ''}
                onChange={(e) => handleDataChange('reason', e.target.value)}
                placeholder="Explain the reason for status change..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        );

      case 'assign-team':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Select Team Members
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {teamMembers.map(member => (
                  <label key={member.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={operationData.teamMembers?.includes(member.id) || false}
                      onChange={(e) => {
                        const members = operationData.teamMembers || [];
                        if (e.target.checked) {
                          handleDataChange('teamMembers', [...members, member.id]);
                        } else {
                          handleDataChange('teamMembers', members.filter(m => m !== member.id));
                        }
                      }}
                      className="rounded border-border"
                    />
                    <div>
                      <span className="text-sm text-text-primary">{member.name}</span>
                      <span className="text-xs text-text-secondary ml-2">({member.role})</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Assignment Notes
              </label>
              <textarea
                value={operationData.assignmentNotes || ''}
                onChange={(e) => handleDataChange('assignmentNotes', e.target.value)}
                placeholder="Add instructions for the team..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4">
            <p className="text-text-secondary text-sm">
              Configuration options for this operation will be available soon.
            </p>
          </div>
        );
    }
  };

  if (selectedProperties.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 text-center">
        <Icon name="MousePointer" size={24} className="text-text-secondary mx-auto mb-2" />
        <p className="text-text-secondary text-sm">Select properties to enable bulk operations</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading-medium text-text-primary">Bulk Operations</h3>
            <p className="text-text-secondary text-sm">
              {selectedProperties.length} propert{selectedProperties.length !== 1 ? 'ies' : 'y'} selected
            </p>
          </div>
          <Button
            variant="ghost"
            iconName="X"
            onClick={onClearSelection}
            className="text-xs px-2 py-1"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Operations Grid */}
      {!activeOperation ? (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {bulkOperations.map(operation => (
              <button
                key={operation.id}
                onClick={() => handleOperationSelect(operation)}
                className="p-3 text-left border border-border rounded-lg hover:shadow-base transition-smooth hover:border-border-accent"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name={operation.icon} size={16} className={operation.color} />
                  <span className="font-body-medium text-text-primary text-sm">
                    {operation.label}
                  </span>
                </div>
                <p className="text-text-secondary text-xs">
                  {operation.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Operation Form */
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={() => setActiveOperation(null)}
              className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
            >
              <Icon name="ArrowLeft" size={16} />
            </button>
            <Icon name={activeOperation.icon} size={16} className={activeOperation.color} />
            <h4 className="font-body-medium text-text-primary">{activeOperation.label}</h4>
          </div>

          {renderOperationForm()}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-text-secondary text-sm">
              This will affect {selectedProperties.length} propert{selectedProperties.length !== 1 ? 'ies' : 'y'}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => setActiveOperation(null)}
                className="text-sm px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleExecuteOperation}
                className="text-sm px-4 py-2"
              >
                Execute Operation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperations;