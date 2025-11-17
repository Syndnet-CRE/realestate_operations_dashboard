import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import MetricsOverview from './components/MetricsOverview';
import PipelineKanban from './components/PipelineKanban';
import DealsDataTable from './components/DealsDataTable';
import FilterSidebar from './components/FilterSidebar';
import realEstateService from '../../services/realEstateService';
import authService from '../../services/authService';

const DealPipelineDashboard = () => {
  const navigate = useNavigate();
  const [userRole] = useState('acquisition_manager');
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    stages: [],
    propertyTypes: [],
    teamMembers: [],
    priorities: [],
    valueRange: { min: '', max: '' },
    dateRange: { start: '', end: '' }
  });

  // Real data from API
  const [deals, setDeals] = useState([]);
  const [metrics, setMetrics] = useState({
    totalPipelineValue: 0,
    totalValueChange: 0,
    weightedPipelineValue: 0,
    activeDeals: 0,
    activeDealsChange: 0,
    newDealsThisWeek: 0,
    dealsClosedMonth: 0,
    dealsClosedChange: 0,
    avgDealSize: 0,
    avgDealSizeChange: 0,
    conversionRate: 0,
    conversionRateChange: 0,
    pipelineVelocity: 0,
    pipelineVelocityChange: 0
  });

  // Saved filter presets (could be stored in backend later)
  const [savedPresets] = useState([
    { id: 1, name: 'High Value Deals', filters: { valueRange: { min: '5000000', max: '' } } },
    { id: 2, name: 'My Active Deals', filters: { stages: ['active'], teamMembers: ['john_doe'] } },
    { id: 3, name: 'Urgent This Week', filters: { priorities: ['high'], dateRange: { start: '2024-01-15', end: '2024-01-21' } } }
  ]);

  // Fetch deals and metrics from API
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

        // Build filter parameters
        const filterParams = {};
        if (filters.stages.length > 0) {
          filterParams.stage = filters.stages.join(',');
        }

        // Fetch deals and metrics in parallel
        const [dealsData, metricsData] = await Promise.all([
          realEstateService.getDeals(filterParams),
          realEstateService.getDealStats()
        ]);

        // Transform deals to match component format
        const transformedDeals = (dealsData.deals || []).map(deal => ({
          id: deal.id,
          dealId: deal.deal_name || `DEAL-${deal.id}`,
          propertyAddress: deal.property_address || 'N/A',
          city: deal.city || '',
          state: deal.state || '',
          propertyType: deal.property_type || 'Unknown',
          stage: deal.stage || 'pipeline',
          value: parseFloat(deal.purchase_price) || 0,
          roi: parseFloat(deal.roi) || 0,
          assignedTo: deal.assigned_to_name || 'Unassigned',
          progress: calculateProgress(deal.stage),
          priority: determinePriority(deal),
          lastUpdated: deal.updated_at || deal.created_at,
          nextAction: {
            title: getNextAction(deal.stage),
            dueDate: deal.expected_closing_date
          },
          hasDocuments: deal.document_count > 0,
          hasComments: deal.note_count > 0,
          isUrgent: isUrgent(deal.expected_closing_date)
        }));

        setDeals(transformedDeals);
        setMetrics(metricsData || metrics);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, navigate]);

  // Helper functions for deal transformation
  const calculateProgress = (stage) => {
    const stageProgress = {
      'lead': 10,
      'qualified': 25,
      'under_contract': 50,
      'due_diligence': 70,
      'closing': 90,
      'closed': 100,
      'dead': 0
    };
    return stageProgress[stage] || 0;
  };

  const determinePriority = (deal) => {
    if (deal.purchase_price > 5000000) return 'high';
    if (deal.purchase_price > 2000000) return 'medium';
    return 'low';
  };

  const getNextAction = (stage) => {
    const actions = {
      'lead': 'Initial Assessment',
      'qualified': 'Financial Analysis',
      'under_contract': 'Due Diligence Review',
      'due_diligence': 'Inspection & Appraisal',
      'closing': 'Closing Preparation',
      'closed': 'Post-Closing',
      'dead': 'Archived'
    };
    return actions[stage] || 'Follow up';
  };

  const isUrgent = (closingDate) => {
    if (!closingDate) return false;
    const daysUntil = Math.floor((new Date(closingDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0;
  };

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

  const handleSync = async () => {
    setSyncStatus('syncing');
    try {
      // Build filter parameters
      const filterParams = {};
      if (filters.stages.length > 0) {
        filterParams.stage = filters.stages.join(',');
      }

      // Fetch fresh data
      const [dealsData, metricsData] = await Promise.all([
        realEstateService.getDeals(filterParams),
        realEstateService.getDealStats()
      ]);

      // Transform and update deals
      const transformedDeals = (dealsData.deals || []).map(deal => ({
        id: deal.id,
        dealId: deal.deal_name || `DEAL-${deal.id}`,
        propertyAddress: deal.property_address || 'N/A',
        city: deal.city || '',
        state: deal.state || '',
        propertyType: deal.property_type || 'Unknown',
        stage: deal.stage || 'pipeline',
        value: parseFloat(deal.purchase_price) || 0,
        roi: parseFloat(deal.roi) || 0,
        assignedTo: deal.assigned_to_name || 'Unassigned',
        progress: calculateProgress(deal.stage),
        priority: determinePriority(deal),
        lastUpdated: deal.updated_at || deal.created_at,
        nextAction: {
          title: getNextAction(deal.stage),
          dueDate: deal.expected_closing_date
        },
        hasDocuments: deal.document_count > 0,
        hasComments: deal.note_count > 0,
        isUrgent: isUrgent(deal.expected_closing_date)
      }));

      setDeals(transformedDeals);
      setMetrics(metricsData || metrics);
      setSyncStatus('synced');
    } catch (err) {
      console.error('Sync error:', err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('synced'), 3000);
    }
  };

  const handleDealMove = async (dealId, newStage) => {
    try {
      // Update deal stage in backend
      await realEstateService.updateDealStage(dealId, newStage);

      // Optimistically update local state
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.id === dealId
            ? {
                ...deal,
                stage: newStage,
                progress: calculateProgress(newStage),
                lastUpdated: new Date().toISOString()
              }
            : deal
        )
      );

      // Refresh metrics
      const metricsData = await realEstateService.getDealStats();
      setMetrics(metricsData || metrics);
    } catch (err) {
      console.error('Error moving deal:', err);
      alert('Failed to update deal stage. Please try again.');
      // Refresh data to revert optimistic update
      handleSync();
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="main-content-offset flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading deals...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="main-content-offset flex items-center justify-center">
          <div className="max-w-md text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Dashboard</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={handleSync}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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