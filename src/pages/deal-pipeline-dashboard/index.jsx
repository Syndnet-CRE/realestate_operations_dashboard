import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import MetricsOverview from './components/MetricsOverview';
import PipelineKanban from './components/PipelineKanban';
import DealsDataTable from './components/DealsDataTable';
import FilterSidebar from './components/FilterSidebar';

const DealPipelineDashboard = () => {
  const navigate = useNavigate();
  const [userRole] = useState('acquisition_manager'); // Mock user role
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [filters, setFilters] = useState({
    stages: [],
    propertyTypes: [],
    teamMembers: [],
    priorities: [],
    valueRange: { min: '', max: '' },
    dateRange: { start: '', end: '' }
  });

  // Mock data for deals
  const [deals] = useState([
    {
      id: 1,
      dealId: 'SP-2024-001',
      propertyAddress: '123 Sunset Plaza Drive',
      city: 'Los Angeles',
      state: 'CA',
      propertyType: 'Commercial',
      stage: 'active',
      value: 2500000,
      roi: 18.5,
      assignedTo: 'John Doe',
      progress: 65,
      priority: 'high',
      lastUpdated: '2024-01-15T10:30:00Z',
      nextAction: {
        title: 'Due Diligence Review',
        dueDate: '2024-01-20T17:00:00Z'
      },
      hasDocuments: true,
      hasComments: true,
      isUrgent: true
    },
    {
      id: 2,
      dealId: 'MB-2024-002',
      propertyAddress: '456 Marina Bay Complex',
      city: 'San Francisco',
      state: 'CA',
      propertyType: 'Mixed-Use',
      stage: 'underwriting',
      value: 4200000,
      roi: 22.3,
      assignedTo: 'Sarah Johnson',
      progress: 40,
      priority: 'medium',
      lastUpdated: '2024-01-14T14:20:00Z',
      nextAction: {
        title: 'Financial Analysis',
        dueDate: '2024-01-18T12:00:00Z'
      },
      hasDocuments: true,
      hasComments: false,
      isUrgent: false
    },
    {
      id: 3,
      dealId: 'DOC-2024-003',
      propertyAddress: '789 Downtown Office Tower',
      city: 'Seattle',
      state: 'WA',
      propertyType: 'Commercial',
      stage: 'pending',
      value: 6800000,
      roi: 15.2,
      assignedTo: 'Mike Chen',
      progress: 85,
      priority: 'high',
      lastUpdated: '2024-01-13T09:15:00Z',
      nextAction: {
        title: 'Board Approval',
        dueDate: '2024-01-16T16:00:00Z'
      },
      hasDocuments: true,
      hasComments: true,
      isUrgent: true
    },
    {
      id: 4,
      dealId: 'RH-2024-004',
      propertyAddress: '321 Residential Heights',
      city: 'Austin',
      state: 'TX',
      propertyType: 'Residential',
      stage: 'pipeline',
      value: 1200000,
      roi: 12.8,
      assignedTo: 'Lisa Wang',
      progress: 20,
      priority: 'low',
      lastUpdated: '2024-01-12T16:45:00Z',
      nextAction: {
        title: 'Initial Assessment',
        dueDate: '2024-01-22T10:00:00Z'
      },
      hasDocuments: false,
      hasComments: false,
      isUrgent: false
    },
    {
      id: 5,
      dealId: 'IC-2024-005',
      propertyAddress: '654 Industrial Center',
      city: 'Phoenix',
      state: 'AZ',
      propertyType: 'Industrial',
      stage: 'approved',
      value: 3100000,
      roi: 19.7,
      assignedTo: 'David Brown',
      progress: 95,
      priority: 'medium',
      lastUpdated: '2024-01-11T11:30:00Z',
      nextAction: {
        title: 'Closing Preparation',
        dueDate: '2024-01-17T14:00:00Z'
      },
      hasDocuments: true,
      hasComments: true,
      isUrgent: false
    },
    {
      id: 6,
      dealId: 'RM-2024-006',
      propertyAddress: '987 Retail Mall Plaza',
      city: 'Denver',
      state: 'CO',
      propertyType: 'Retail',
      stage: 'closed',
      value: 5500000,
      roi: 16.4,
      assignedTo: 'John Doe',
      progress: 100,
      priority: 'medium',
      lastUpdated: '2024-01-10T13:20:00Z',
      nextAction: null,
      hasDocuments: true,
      hasComments: false,
      isUrgent: false
    }
  ]);

  // Mock metrics data
  const [metrics] = useState({
    totalPipelineValue: 23300000,
    totalValueChange: 8.5,
    weightedPipelineValue: 18640000,
    activeDeals: 24,
    activeDealsChange: 12.3,
    newDealsThisWeek: 3,
    dealsClosedMonth: 8,
    dealsClosedChange: 15.7,
    avgDealSize: 2900000,
    avgDealSizeChange: -2.1,
    conversionRate: 14.2,
    conversionRateChange: 3.8,
    pipelineVelocity: 42,
    pipelineVelocityChange: -5.2
  });

  // Mock saved filter presets
  const [savedPresets] = useState([
    { id: 1, name: 'High Value Deals', filters: { valueRange: { min: '5000000', max: '' } } },
    { id: 2, name: 'My Active Deals', filters: { stages: ['active'], teamMembers: ['john_doe'] } },
    { id: 3, name: 'Urgent This Week', filters: { priorities: ['high'], dateRange: { start: '2024-01-15', end: '2024-01-21' } } }
  ]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            // Focus search will be handled by GlobalSearchInterface
            break;
          case 'n':
            event.preventDefault();
            handleNewDeal();
            break;
          case 'f':
            event.preventDefault();
            // Focus filters
            break;
          case 'r':
            event.preventDefault();
            handleExport();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (query, filter) => {
    console.log('Search:', query, filter);
    // Implement search logic
  };

  const handleFilterPresetSelect = (preset) => {
    console.log('Filter preset selected:', preset);
    // Apply preset filters
  };

  const handleExport = () => {
    console.log('Exporting deals...');
    // Implement export functionality
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('synced');
    }, 2000);
  };

  const handleDealMove = (dealId, newStage) => {
    console.log('Moving deal', dealId, 'to stage', newStage);
    // Implement deal stage update
  };

  const handleDealClick = (deal) => {
    navigate(`/deal-detail-management?id=${deal.dealId}`);
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action, 'for deals:', selectedDeals);
    // Implement bulk actions
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSavePreset = (name, filterData) => {
    console.log('Saving preset:', name, filterData);
    // Implement save preset functionality
  };

  const handleLoadPreset = (preset) => {
    setFilters(preset.filters);
  };

  const handleNewDeal = () => {
    console.log('Creating new deal...');
    // Navigate to new deal form or open modal
  };

  const totalDeals = deals.length;
  const activeDeals = deals.filter(deal => ['active', 'underwriting', 'pending'].includes(deal.stage)).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="main-content-offset">
        <DashboardHeader
          onSearch={handleSearch}
          onFilterPresetSelect={handleFilterPresetSelect}
          onExport={handleExport}
          onSync={handleSync}
          syncStatus={syncStatus}
          totalDeals={totalDeals}
          activeDeals={activeDeals}
          userRole={userRole}
        />

        <div className="flex">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSavePreset={handleSavePreset}
            savedPresets={savedPresets}
            onLoadPreset={handleLoadPreset}
          />

          <div className="flex-1 p-6">
            <MetricsOverview metrics={metrics} userRole={userRole} />
            
            <div className="space-y-8">
              <PipelineKanban
                deals={deals}
                onDealMove={handleDealMove}
                onDealClick={handleDealClick}
                userRole={userRole}
              />

              <DealsDataTable
                deals={deals}
                onDealClick={handleDealClick}
                onBulkAction={handleBulkAction}
                userRole={userRole}
                selectedDeals={selectedDeals}
                onDealSelect={setSelectedDeals}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DealPipelineDashboard;