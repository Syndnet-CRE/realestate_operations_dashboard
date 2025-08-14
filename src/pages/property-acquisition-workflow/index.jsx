import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import WorkflowProgressBar from './components/WorkflowProgressBar';
import AcquisitionPipeline from './components/AcquisitionPipeline';
import StageRequirements from './components/StageRequirements';
import TeamAssignments from './components/TeamAssignments';
import DocumentViewer from './components/DocumentViewer';
import BulkOperations from './components/BulkOperations';

const PropertyAcquisitionWorkflow = () => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentStage, setCurrentStage] = useState(2);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('requirements');

  const workflowStages = [
    {
      id: 'identification',
      name: 'Identification',
      icon: 'Search',
      estimatedDays: 3,
      description: 'Initial property identification and basic screening'
    },
    {
      id: 'analysis',
      name: 'Analysis',
      icon: 'Calculator',
      estimatedDays: 7,
      description: 'Financial analysis and market evaluation'
    },
    {
      id: 'due-diligence',
      name: 'Due Diligence',
      icon: 'FileSearch',
      estimatedDays: 14,
      description: 'Comprehensive property investigation and verification',
      completedDate: '12/15/2024'
    },
    {
      id: 'approval',
      name: 'Approval',
      icon: 'CheckCircle',
      estimatedDays: 5,
      description: 'Internal approval process and final decision'
    },
    {
      id: 'closing',
      name: 'Closing',
      icon: 'HandShake',
      estimatedDays: 10,
      description: 'Final negotiations and transaction completion'
    }
  ];

  const mockProperties = [
    {
      id: 'SP-2024-001',
      name: 'Sunset Plaza Acquisition',
      address: '123 Sunset Boulevard, Los Angeles, CA',
      price: '$2,500,000',
      stage: 'due-diligence',
      priority: 'high',
      daysInStage: 8,
      nextDeadline: 'Jan 25, 2025'
    },
    {
      id: 'MB-2024-002',
      name: 'Marina Bay Office Complex',
      address: '456 Harbor Drive, San Francisco, CA',
      price: '$4,200,000',
      stage: 'analysis',
      priority: 'medium',
      daysInStage: 12,
      nextDeadline: 'Jan 30, 2025'
    },
    {
      id: 'DT-2024-003',
      name: 'Downtown Retail Center',
      address: '789 Main Street, Seattle, WA',
      price: '$1,800,000',
      stage: 'approval',
      priority: 'low',
      daysInStage: 3,
      nextDeadline: 'Feb 5, 2025'
    },
    {
      id: 'GV-2024-004',
      name: 'Green Valley Apartments',
      address: '321 Oak Avenue, Portland, OR',
      price: '$3,100,000',
      stage: 'identification',
      priority: 'medium',
      daysInStage: 2,
      nextDeadline: 'Jan 28, 2025'
    },
    {
      id: 'RC-2024-005',
      name: 'Riverside Commercial',
      address: '654 River Road, Denver, CO',
      price: '$2,900,000',
      stage: 'closing',
      priority: 'high',
      daysInStage: 15,
      nextDeadline: 'Jan 22, 2025'
    }
  ];

  const mockRequirements = [
    {
      id: 1,
      title: 'Property Appraisal Report',
      description: 'Independent third-party appraisal of property value',
      type: 'document',
      completed: true,
      priority: 'high',
      assignee: 'Sarah Johnson',
      dueDate: 'Jan 20, 2025',
      documents: ['appraisal_report.pdf']
    },
    {
      id: 2,
      title: 'Environmental Assessment',
      description: 'Phase I Environmental Site Assessment',
      type: 'document',
      completed: false,
      priority: 'high',
      assignee: 'Michael Chen',
      dueDate: 'Jan 25, 2025'
    },
    {
      id: 3,
      title: 'Financial Analysis Review',
      description: 'Complete financial modeling and cash flow analysis',
      type: 'financial',
      completed: true,
      priority: 'medium',
      assignee: 'Emily Rodriguez',
      dueDate: 'Jan 18, 2025'
    },
    {
      id: 4,
      title: 'Legal Document Review',
      description: 'Review all legal documents and contracts',
      type: 'approval',
      completed: false,
      priority: 'high',
      assignee: 'David Kim',
      dueDate: 'Jan 26, 2025'
    },
    {
      id: 5,
      title: 'Property Inspection',
      description: 'Comprehensive structural and systems inspection',
      type: 'inspection',
      completed: false,
      priority: 'medium',
      assignee: 'Lisa Thompson',
      dueDate: 'Jan 24, 2025'
    },
    {
      id: 6,
      title: 'Title Search Verification',
      description: 'Verify clear title and identify any liens',
      type: 'checklist',
      completed: true,
      priority: 'high',
      assignee: 'David Kim',
      dueDate: 'Jan 15, 2025'
    }
  ];

  const mockAssignments = [
    {
      id: 1,
      task: 'Complete Environmental Assessment Report',
      assignee: {
        name: 'Michael Chen',
        role: 'Due Diligence Specialist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      status: 'in-progress',
      priority: 'high',
      dueDate: 'Jan 25, 2025',
      progress: 65
    },
    {
      id: 2,
      task: 'Legal Document Review and Analysis',
      assignee: {
        name: 'David Kim',
        role: 'Legal Counsel',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      },
      status: 'pending',
      priority: 'high',
      dueDate: 'Jan 26, 2025',
      progress: 0
    },
    {
      id: 3,
      task: 'Property Inspection Coordination',
      assignee: {
        name: 'Lisa Thompson',
        role: 'Property Inspector',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
      },
      status: 'overdue',
      priority: 'medium',
      dueDate: 'Jan 20, 2025',
      progress: 30
    },
    {
      id: 4,
      task: 'Financial Model Validation',
      assignee: {
        name: 'Emily Rodriguez',
        role: 'Financial Analyst',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
      },
      status: 'completed',
      priority: 'medium',
      dueDate: 'Jan 18, 2025',
      progress: 100
    }
  ];

  const mockDocuments = [
    {
      id: 1,
      name: 'Property Appraisal Report - Sunset Plaza',
      type: 'pdf',
      size: 2456789,
      category: 'appraisal',
      status: 'approved',
      uploadDate: 'Jan 15, 2025',
      uploadedBy: 'Sarah Johnson',
      version: '1.2',
      description: 'Independent third-party appraisal conducted by certified appraiser',
      compliance: {
        status: 'compliant',
        message: 'Meets all regulatory requirements'
      }
    },
    {
      id: 2,
      name: 'Environmental Site Assessment Phase I',
      type: 'pdf',
      size: 5234567,
      category: 'environmental',
      status: 'pending',
      uploadDate: 'Jan 22, 2025',
      uploadedBy: 'Michael Chen',
      version: '1.0',
      description: 'Phase I Environmental Site Assessment report',
      compliance: {
        status: 'review',
        message: 'Under compliance review'
      }
    },
    {
      id: 3,
      name: 'Financial Analysis Model',
      type: 'xlsx',
      size: 1234567,
      category: 'financial',
      status: 'approved',
      uploadDate: 'Jan 18, 2025',
      uploadedBy: 'Emily Rodriguez',
      version: '2.1',
      description: 'Comprehensive financial modeling and cash flow projections'
    },
    {
      id: 4,
      name: 'Legal Due Diligence Checklist',
      type: 'docx',
      size: 567890,
      category: 'legal',
      status: 'review',
      uploadDate: 'Jan 20, 2025',
      uploadedBy: 'David Kim',
      version: '1.0',
      description: 'Legal review checklist and findings'
    },
    {
      id: 5,
      name: 'Property Inspection Photos',
      type: 'jpg',
      size: 8901234,
      category: 'inspection',
      status: 'approved',
      uploadDate: 'Jan 19, 2025',
      uploadedBy: 'Lisa Thompson',
      version: '1.0',
      description: 'Comprehensive property inspection photographs'
    }
  ];

  useEffect(() => {
    if (mockProperties.length > 0 && !selectedProperty) {
      setSelectedProperty(mockProperties[0]);
    }
  }, [selectedProperty]);

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setSelectedProperties([]);
  };

  const handleStageClick = (stageIndex) => {
    if (stageIndex <= currentStage) {
      setCurrentStage(stageIndex);
    }
  };

  const handleRequirementUpdate = (requirementId, updates) => {
    console.log('Updating requirement:', requirementId, updates);
  };

  const handleApprovalRequest = (requirementIds) => {
    console.log('Requesting approval for:', requirementIds);
  };

  const handleAssignmentUpdate = (assignmentId, updates) => {
    console.log('Updating assignment:', assignmentId, updates);
  };

  const handleEscalate = (assignmentId) => {
    console.log('Escalating assignment:', assignmentId);
  };

  const handleDocumentUpload = (files) => {
    console.log('Uploading documents:', files);
  };

  const handleDocumentDelete = (documentId) => {
    console.log('Deleting document:', documentId);
  };

  const handleDocumentView = (document) => {
    console.log('Viewing document:', document);
  };

  const handleBulkAction = (actionType, data) => {
    console.log('Bulk action:', actionType, data);
  };

  const handleNewProperty = () => {
    console.log('Creating new property');
  };

  const tabs = [
    { id: 'requirements', label: 'Requirements', icon: 'CheckSquare' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'team', label: 'Team', icon: 'Users' },
    { id: 'bulk', label: 'Bulk Ops', icon: 'Layers' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="main-content-offset pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading-semibold text-text-primary">
                Property Acquisition Workflow
              </h1>
              <p className="text-text-secondary mt-1">
                Streamline your property acquisition process from identification to closing
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                onClick={() => console.log('Export report')}
              >
                Export Report
              </Button>
              <Button
                variant="outline"
                iconName="Upload"
                onClick={() => console.log('Import data')}
              >
                Import Data
              </Button>
              <Button
                variant="primary"
                iconName="Plus"
                onClick={handleNewProperty}
              >
                New Property
              </Button>
            </div>
          </div>

          {/* Workflow Progress */}
          <WorkflowProgressBar
            currentStage={currentStage}
            stages={workflowStages}
            onStageClick={handleStageClick}
          />

          {/* Main Content Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Pipeline */}
            <div className="col-span-3">
              <AcquisitionPipeline
                properties={mockProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={handlePropertySelect}
                onNewProperty={handleNewProperty}
              />
            </div>

            {/* Center Panel - Stage Content */}
            <div className="col-span-6">
              {selectedProperty && (
                <div className="space-y-6">
                  {/* Property Header */}
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-heading-semibold text-text-primary">
                        {selectedProperty.name}
                      </h2>
                      <span className="text-sm text-text-secondary">
                        #{selectedProperty.id}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mb-2">
                      {selectedProperty.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-data text-lg text-text-primary">
                        {selectedProperty.price}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-text-secondary">
                          {selectedProperty.daysInStage} days in stage
                        </span>
                        {selectedProperty.priority === 'high' && (
                          <Icon name="AlertTriangle" size={16} className="text-error" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="bg-surface border border-border rounded-lg">
                    <div className="border-b border-border">
                      <nav className="flex space-x-8 px-4">
                        {tabs.map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-body-medium text-sm transition-colors ${
                              activeTab === tab.id
                                ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                            }`}
                          >
                            <Icon name={tab.icon} size={16} />
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                      {activeTab === 'requirements' && (
                        <StageRequirements
                          stage={workflowStages[currentStage]}
                          requirements={mockRequirements}
                          onRequirementUpdate={handleRequirementUpdate}
                          onApprovalRequest={handleApprovalRequest}
                        />
                      )}
                      {activeTab === 'documents' && (
                        <DocumentViewer
                          documents={mockDocuments}
                          onDocumentUpload={handleDocumentUpload}
                          onDocumentDelete={handleDocumentDelete}
                          onDocumentView={handleDocumentView}
                        />
                      )}
                      {activeTab === 'team' && (
                        <TeamAssignments
                          assignments={mockAssignments}
                          onAssignmentUpdate={handleAssignmentUpdate}
                          onEscalate={handleEscalate}
                        />
                      )}
                      {activeTab === 'bulk' && (
                        <BulkOperations
                          selectedProperties={selectedProperties}
                          onBulkAction={handleBulkAction}
                          onClearSelection={() => setSelectedProperties([])}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Team Assignments */}
            <div className="col-span-3">
              <TeamAssignments
                assignments={mockAssignments}
                onAssignmentUpdate={handleAssignmentUpdate}
                onEscalate={handleEscalate}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyAcquisitionWorkflow;