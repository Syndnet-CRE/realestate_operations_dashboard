import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StageRequirements = ({ stage, requirements, onRequirementUpdate, onApprovalRequest }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['checklist']));
  const [selectedRequirements, setSelectedRequirements] = useState(new Set());

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleRequirement = (requirementId) => {
    const newSelected = new Set(selectedRequirements);
    if (newSelected.has(requirementId)) {
      newSelected.delete(requirementId);
    } else {
      newSelected.add(requirementId);
    }
    setSelectedRequirements(newSelected);
  };

  const handleRequirementToggle = (requirementId, completed) => {
    if (onRequirementUpdate) {
      onRequirementUpdate(requirementId, { completed: !completed });
    }
  };

  const getRequirementIcon = (requirement) => {
    if (requirement.completed) return 'CheckCircle';
    if (requirement.type === 'document') return 'FileText';
    if (requirement.type === 'approval') return 'UserCheck';
    if (requirement.type === 'inspection') return 'Eye';
    if (requirement.type === 'financial') return 'Calculator';
    return 'Circle';
  };

  const getRequirementColor = (requirement) => {
    if (requirement.completed) return 'text-success';
    if (requirement.priority === 'high') return 'text-error';
    if (requirement.priority === 'medium') return 'text-warning';
    return 'text-text-secondary';
  };

  const getSectionIcon = (sectionId) => {
    switch (sectionId) {
      case 'checklist': return 'CheckSquare';
      case 'documents': return 'FileText';
      case 'approvals': return 'UserCheck';
      case 'financial': return 'Calculator';
      default: return 'List';
    }
  };

  const completedCount = requirements.filter(r => r.completed).length;
  const totalCount = requirements.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const sections = [
    {
      id: 'checklist',
      title: 'Requirements Checklist',
      items: requirements.filter(r => r.type === 'checklist' || !r.type)
    },
    {
      id: 'documents',
      title: 'Document Requirements',
      items: requirements.filter(r => r.type === 'document')
    },
    {
      id: 'approvals',
      title: 'Approval Requirements',
      items: requirements.filter(r => r.type === 'approval')
    },
    {
      id: 'financial',
      title: 'Financial Analysis',
      items: requirements.filter(r => r.type === 'financial')
    }
  ].filter(section => section.items.length > 0);

  return (
    <div className="bg-surface border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading-medium text-text-primary">
            {stage.name} Requirements
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {completedCount}/{totalCount} Complete
            </span>
            {selectedRequirements.size > 0 && (
              <Button
                variant="primary"
                iconName="Send"
                onClick={() => onApprovalRequest && onApprovalRequest(Array.from(selectedRequirements))}
                className="text-xs px-3 py-1"
              >
                Request Approval
              </Button>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Stage Description */}
        {stage.description && (
          <p className="text-sm text-text-secondary">
            {stage.description}
          </p>
        )}
      </div>
      
      {/* Requirements Sections */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {sections.map(section => (
            <div key={section.id} className="border border-border rounded-lg">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-background transition-smooth"
              >
                <div className="flex items-center space-x-2">
                  <Icon name={getSectionIcon(section.id)} size={16} className="text-text-secondary" />
                  <span className="font-body-medium text-text-primary">{section.title}</span>
                  <span className="text-xs text-text-secondary">
                    ({section.items.filter(item => item.completed).length}/{section.items.length})
                  </span>
                </div>
                <Icon 
                  name={expandedSections.has(section.id) ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-text-secondary" 
                />
              </button>
              
              {expandedSections.has(section.id) && (
                <div className="border-t border-border p-3">
                  <div className="space-y-2">
                    {section.items.map(requirement => (
                      <div
                        key={requirement.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg border transition-smooth hover:shadow-base ${
                          requirement.completed ? 'bg-success/5 border-success/20' : 'bg-surface border-border'
                        }`}
                      >
                        <button
                          onClick={() => handleRequirementToggle(requirement.id, requirement.completed)}
                          className="mt-0.5"
                        >
                          <Icon 
                            name={getRequirementIcon(requirement)} 
                            size={16} 
                            className={getRequirementColor(requirement)}
                          />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-body-medium text-sm ${
                              requirement.completed ? 'text-success line-through' : 'text-text-primary'
                            }`}>
                              {requirement.title}
                            </h4>
                            {requirement.priority === 'high' && (
                              <Icon name="AlertTriangle" size={12} className="text-error" />
                            )}
                            {requirement.type === 'approval' && (
                              <button
                                onClick={() => toggleRequirement(requirement.id)}
                                className={`text-xs px-2 py-1 rounded-full transition-smooth ${
                                  selectedRequirements.has(requirement.id)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background text-text-secondary hover:bg-border'
                                }`}
                              >
                                Select
                              </button>
                            )}
                          </div>
                          
                          {requirement.description && (
                            <p className="text-text-secondary text-xs mb-2">
                              {requirement.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              {requirement.assignee && (
                                <span className="text-text-secondary">
                                  Assigned to: {requirement.assignee}
                                </span>
                              )}
                              {requirement.dueDate && (
                                <span className={`flex items-center space-x-1 ${
                                  new Date(requirement.dueDate) < new Date() ? 'text-error' : 'text-warning'
                                }`}>
                                  <Icon name="Clock" size={12} />
                                  <span>Due: {requirement.dueDate}</span>
                                </span>
                              )}
                            </div>
                            
                            {requirement.documents && requirement.documents.length > 0 && (
                              <div className="flex items-center space-x-1 text-text-secondary">
                                <Icon name="Paperclip" size={12} />
                                <span>{requirement.documents.length} files</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StageRequirements;