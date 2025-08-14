import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PropertySummaryCard from './components/PropertySummaryCard';
import PropertyDetailsTab from './components/PropertyDetailsTab';
import FinancialAnalysisTab from './components/FinancialAnalysisTab';
import DocumentsTab from './components/DocumentsTab';
import TimelineTab from './components/TimelineTab';
import TeamTab from './components/TeamTab';
import ActivityFeed from './components/ActivityFeed';

const DealDetailManagement = () => {
  const [searchParams] = useSearchParams();
  const dealId = searchParams.get('id') || 'SP-2024-001';
  const [activeTab, setActiveTab] = useState('details');
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock property data
  const mockProperty = {
    id: dealId,
    name: 'Sunset Plaza Acquisition',
    address: '1234 Sunset Boulevard, Los Angeles, CA 90028',
    type: 'Multi Family',
    status: 'active',
    purchasePrice: 2500000,
    arv: 3200000,
    roi: 22.5,
    daysActive: 45,
    progress: 65,
    sqft: 8500,
    bedrooms: 12,
    bathrooms: 8,
    yearBuilt: 1985,
    rehabBudget: 350000,
    holdingCosts: 125000,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    description: `Prime multi-family investment opportunity in the heart of West Hollywood. This 12-unit property features a mix of 1 and 2-bedroom apartments with excellent rental potential.\n\nKey highlights include recent exterior renovations, updated electrical systems, and strong rental history. The property is located in a high-demand area with excellent walkability and proximity to entertainment districts.`
  };

  const tabs = [
    { id: 'details', label: 'Property Details', icon: 'Home' },
    { id: 'financial', label: 'Financial Analysis', icon: 'Calculator' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock' },
    { id: 'team', label: 'Team', icon: 'Users' }
  ];

  useEffect(() => {
    // Simulate loading property data
    const timer = setTimeout(() => {
      setProperty(mockProperty);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dealId]);

  useEffect(() => {
    // Keyboard shortcuts for tab navigation
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        const tabIndex = parseInt(event.key) - 1;
        if (tabIndex >= 0 && tabIndex < tabs.length) {
          event.preventDefault();
          setActiveTab(tabs[tabIndex].id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePropertyUpdate = (updatedProperty) => {
    setProperty(updatedProperty);
    console.log('Property updated:', updatedProperty);
  };

  const handleStatusChange = (propertyId) => {
    console.log('Changing status for property:', propertyId);
    // Implement status change logic
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action:', actionId);
    // Implement quick action logic
  };

  const handleAnalysisUpdate = (analysisData) => {
    console.log('Analysis updated:', analysisData);
    // Implement analysis update logic
  };

  const handleDocumentAction = (action, docId) => {
    console.log('Document action:', action, docId);
    // Implement document action logic
  };

  const handleTimelineUpdate = (event) => {
    console.log('Timeline updated:', event);
    // Implement timeline update logic
  };

  const handleTeamUpdate = (teamData) => {
    console.log('Team updated:', teamData);
    // Implement team update logic
  };

  const handleActivityAdd = (activity) => {
    console.log('Activity added:', activity);
    // Implement activity add logic
  };

  const renderTabContent = () => {
    if (!property) return null;

    switch (activeTab) {
      case 'details':
        return (
          <PropertyDetailsTab 
            property={property} 
            onPropertyUpdate={handlePropertyUpdate}
          />
        );
      case 'financial':
        return (
          <FinancialAnalysisTab 
            property={property} 
            onAnalysisUpdate={handleAnalysisUpdate}
          />
        );
      case 'documents':
        return (
          <DocumentsTab 
            dealId={property.id} 
            onDocumentAction={handleDocumentAction}
          />
        );
      case 'timeline':
        return (
          <TimelineTab 
            dealId={property.id} 
            onTimelineUpdate={handleTimelineUpdate}
          />
        );
      case 'team':
        return (
          <TeamTab 
            dealId={property.id} 
            onTeamUpdate={handleTeamUpdate}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="main-content-offset pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-text-secondary">Loading deal details...</p>
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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" iconName="ArrowLeft" className="text-sm">
                Back to Pipeline
              </Button>
              <div>
                <h1 className="font-heading-semibold text-text-primary text-2xl">
                  {property?.name}
                </h1>
                <p className="text-text-secondary text-sm">
                  Deal ID: {property?.id} • Last updated 2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" iconName="Share2">
                Share Deal
              </Button>
              <Button variant="outline" iconName="Download">
                Export Report
              </Button>
              <Button variant="primary" iconName="Settings">
                Deal Settings
              </Button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Left Panel - Property Summary */}
            <div className="col-span-12 lg:col-span-3">
              <PropertySummaryCard
                property={property}
                onStatusChange={handleStatusChange}
                onQuickAction={handleQuickAction}
              />
            </div>

            {/* Center Panel - Tab Content */}
            <div className="col-span-12 lg:col-span-6 flex flex-col">
              {/* Tab Navigation */}
              <div className="bg-surface border border-border rounded-t-lg">
                <div className="flex items-center border-b border-border">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-smooth border-b-2 ${
                        activeTab === tab.id
                          ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-background'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 bg-surface border-l border-r border-b border-border rounded-b-lg overflow-y-auto">
                <div className="p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>

            {/* Right Panel - Activity Feed */}
            <div className="col-span-12 lg:col-span-3">
              <ActivityFeed
                dealId={property?.id}
                onActivityAdd={handleActivityAdd}
              />
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="fixed bottom-4 right-4 bg-surface border border-border rounded-lg p-3 text-xs text-text-secondary">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Keyboard" size={14} />
              <span className="font-body-medium">Keyboard Shortcuts</span>
            </div>
            <div className="space-y-1">
              <div>Ctrl+1-5: Switch tabs</div>
              <div>Ctrl+S: Save changes</div>
              <div>Ctrl+K: Global search</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DealDetailManagement;