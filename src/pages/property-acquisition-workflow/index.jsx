import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import realEstateService from '../../services/realEstateService';
import authService from '../../services/authService';

const PropertyAcquisitionWorkflow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentStage, setCurrentStage] = useState(2);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('requirements');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Get property ID from URL params
  const propertyId = searchParams.get('property');

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

  // Fetch properties, tasks, and documents from API
  useEffect(() => {
    const fetchData = async () => {
      // Check authentication
      if (!authService.isAuthenticated()) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch properties (deals) and tasks in parallel
        const [propertiesData, tasksData] = await Promise.all([
          realEstateService.getDeals(),
          realEstateService.getTasks({ limit: 50 })
        ]);

        // Transform properties to match component format
        const transformedProperties = (propertiesData.deals || []).map(deal => ({
          id: deal.id,
          name: deal.deal_name || `Deal ${deal.id}`,
          address: deal.property_address || 'N/A',
          price: `$${parseFloat(deal.purchase_price || 0).toLocaleString()}`,
          stage: mapStageToWorkflow(deal.stage),
          priority: determinePriority(deal),
          daysInStage: calculateDaysInStage(deal.updated_at),
          nextDeadline: formatDate(deal.expected_closing_date)
        }));

        setProperties(transformedProperties);

        // Transform tasks
        const transformedTasks = (tasksData.tasks || []).map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          type: task.task_type || 'document',
          completed: task.status === 'completed',
          priority: task.priority || 'medium',
          assignee: task.assigned_to_name || 'Unassigned',
          dueDate: formatDate(task.due_date)
        }));

        setTasks(transformedTasks);

        // Set first property as selected if we have one
        if (transformedProperties.length > 0) {
          if (propertyId) {
            const property = transformedProperties.find(p => p.id === parseInt(propertyId));
            setSelectedProperty(property || transformedProperties[0]);
          } else {
            setSelectedProperty(transformedProperties[0]);
          }
        }

        // Fetch documents if we have a selected property
        if (propertyId) {
          try {
            const docsData = await realEstateService.getDocuments({ property_id: propertyId });
            const transformedDocs = (docsData.documents || []).map(doc => ({
              id: doc.id,
              name: doc.file_name,
              type: doc.file_type || 'pdf',
              size: doc.file_size || 0,
              category: doc.document_type || 'general',
              status: doc.status || 'pending',
              uploadDate: formatDate(doc.uploaded_at),
              uploadedBy: doc.uploaded_by_name || 'Unknown',
              version: doc.version || '1.0',
              description: doc.description || ''
            }));
            setDocuments(transformedDocs);
          } catch (err) {
            console.error('Error fetching documents:', err);
            // Don't fail the whole page if documents fail
            setDocuments([]);
          }
        }
      } catch (err) {
        console.error('Error fetching property acquisition data:', err);
        setError(err.message || 'Failed to load property data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId, navigate]);

  // Helper functions
  const mapStageToWorkflow = (dealStage) => {
    const stageMap = {
      'lead': 'identification',
      'qualified': 'identification',
      'under_contract': 'analysis',
      'due_diligence': 'due-diligence',
      'closing': 'approval',
      'closed': 'closing',
      'dead': 'identification'
    };
    return stageMap[dealStage] || 'identification';
  };

  const determinePriority = (deal) => {
    const price = parseFloat(deal.purchase_price || 0);
    if (price > 3000000) return 'high';
    if (price > 1500000) return 'medium';
    return 'low';
  };

  const calculateDaysInStage = (updatedAt) => {
    if (!updatedAt) return 0;
    const diff = Date.now() - new Date(updatedAt).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="main-content-offset pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading property workflow...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="main-content-offset pt-16 flex items-center justify-center">
          <div className="max-w-md text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Workflow</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/deal-pipeline-dashboard')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Back to Pipeline
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                properties={properties}
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
                          requirements={tasks}
                          onRequirementUpdate={handleRequirementUpdate}
                          onApprovalRequest={handleApprovalRequest}
                        />
                      )}
                      {activeTab === 'documents' && (
                        <DocumentViewer
                          documents={documents}
                          onDocumentUpload={handleDocumentUpload}
                          onDocumentDelete={handleDocumentDelete}
                          onDocumentView={handleDocumentView}
                        />
                      )}
                      {activeTab === 'team' && (
                        <TeamAssignments
                          assignments={tasks}
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
                assignments={tasks}
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