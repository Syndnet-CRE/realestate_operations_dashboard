import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import GlobalSearchInterface from '../../components/ui/GlobalSearchInterface';
import NotificationCenter from '../../components/ui/NotificationCenter';

// Import page-specific components
import KPICard from './components/KPICard';
import PerformanceChart from './components/PerformanceChart';
import FilterPanel from './components/FilterPanel';
import ExportPanel from './components/ExportPanel';
import ForecastingWidget from './components/ForecastingWidget';
import BenchmarkingPanel from './components/BenchmarkingPanel';

const FinancialAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Mock KPI data
  const kpiData = [
    {
      title: 'Total Portfolio Value',
      value: 45800000,
      change: 12.5,
      changeType: 'positive',
      icon: 'Building2',
      format: 'currency',
      trend: [42, 45, 48, 52, 49, 55, 58]
    },
    {
      title: 'Monthly Revenue',
      value: 3500000,
      change: 8.3,
      changeType: 'positive',
      icon: 'DollarSign',
      format: 'currency',
      trend: [28, 32, 35, 31, 38, 35, 42]
    },
    {
      title: 'Profit Margin',
      value: 22.3,
      change: -2.1,
      changeType: 'negative',
      icon: 'TrendingUp',
      format: 'percentage',
      trend: [25, 24, 23, 22, 21, 22, 22]
    },
    {
      title: 'Deal Velocity',
      value: 8.2,
      change: 15.7,
      changeType: 'positive',
      icon: 'Zap',
      format: 'number',
      trend: [6, 7, 8, 7, 9, 8, 10]
    }
  ];

  // Mock performance alerts
  const performanceAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Profit Margin Below Target',
      message: 'Current profit margin (22.3%) is below the quarterly target of 25%',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: true,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'success',
      title: 'Revenue Target Exceeded',
      message: 'Monthly revenue has exceeded target by 12.5%',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: false,
      priority: 'low'
    }
  ];

  useEffect(() => {
    // Simulate data loading
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setDashboardData({
          kpis: kpiData,
          alerts: performanceAlerts,
          lastUpdated: new Date()
        });
        
        setAlerts(performanceAlerts);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedTimeRange]);

  const handleSearch = (query, filters) => {
    console.log('Searching financial data:', { query, filters });
    // Implement search functionality
  };

  const handleFiltersChange = (filters) => {
    console.log('Filters changed:', filters);
    // Apply filters to dashboard data
  };

  const handleSaveTemplate = (template) => {
    setSavedTemplates(prev => [...prev, template]);
    console.log('Template saved:', template);
  };

  const handleExport = async (exportData) => {
    console.log('Exporting report:', exportData);
    // Implement export functionality
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleForecastUpdate = (forecastData) => {
    console.log('Forecast updated:', forecastData);
    // Handle forecast data update
  };

  const handleBenchmarkUpdate = () => {
    console.log('Refreshing benchmark data');
    // Refresh benchmark data
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Handle notification action
  };

  const handleQuickNavigation = (path) => {
    navigate(path);
  };

  const quickActions = [
    { id: 'new-report', label: 'Generate Report', icon: 'FileText', action: () => setShowExportPanel(true) },
    { id: 'view-deals', label: 'View Deals', icon: 'Building', action: () => navigate('/deal-pipeline-dashboard') },
    { id: 'underwriting', label: 'Underwriting', icon: 'Calculator', action: () => navigate('/underwriting-analysis-center') },
    { id: 'properties', label: 'Properties', icon: 'Home', action: () => navigate('/listing-management-hub') }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="main-content-offset pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-text-secondary">Loading financial analytics...</p>
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
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading-semibold text-text-primary">
                Financial Analytics Dashboard
              </h1>
              <p className="text-text-secondary mt-1">
                Comprehensive performance tracking and profitability analysis
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <GlobalSearchInterface
                onSearch={handleSearch}
                placeholder="Search financial data, reports, metrics..."
                className="w-80"
              />
              
              <NotificationCenter
                notifications={alerts}
                onNotificationClick={handleNotificationClick}
              />
              
              <FilterPanel
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
                onFiltersChange={handleFiltersChange}
                savedTemplates={savedTemplates}
                onSaveTemplate={handleSaveTemplate}
              />
              
              <ExportPanel
                isOpen={showExportPanel}
                onToggle={() => setShowExportPanel(!showExportPanel)}
                onExport={handleExport}
              />
            </div>
          </div>

          {/* Performance Alerts */}
          {alerts.filter(alert => alert.unread).length > 0 && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-body-medium text-text-primary mb-1">
                    Performance Alerts ({alerts.filter(alert => alert.unread).length})
                  </h3>
                  <div className="space-y-1">
                    {alerts.filter(alert => alert.unread).slice(0, 2).map((alert) => (
                      <p key={alert.id} className="text-sm text-text-secondary">
                        • {alert.message}
                      </p>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setAlerts(prev => prev.map(a => ({ ...a, unread: false })))}
                  size="sm"
                >
                  Dismiss All
                </Button>
              </div>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.changeType}
                icon={kpi.icon}
                format={kpi.format}
                trend={kpi.trend}
                loading={loading}
              />
            ))}
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart
              title="Revenue & Profit Trends"
              type="line"
              height={350}
              showControls={true}
              allowTypeSwitch={true}
            />
            
            <PerformanceChart
              title="Property Type Distribution"
              type="pie"
              height={350}
              showControls={false}
              allowTypeSwitch={false}
            />
          </div>

          {/* Advanced Analytics Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ForecastingWidget
              title="Revenue Forecasting"
              forecastPeriod={6}
              onForecastUpdate={handleForecastUpdate}
            />
            
            <BenchmarkingPanel
              onBenchmarkUpdate={handleBenchmarkUpdate}
              showIndustryBenchmarks={true}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-heading-medium text-text-primary text-lg mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="flex items-center space-x-3 p-4 bg-background hover:bg-border rounded-lg transition-smooth"
                >
                  <Icon name={action.icon} size={20} className="text-primary" />
                  <span className="font-body-medium text-text-primary text-sm">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <div>
              Last updated: {dashboardData.lastUpdated?.toLocaleString() || 'Loading...'}
            </div>
            <div className="flex items-center space-x-4">
              <span>Data refresh: Every 15 minutes</span>
              <Button
                variant="ghost"
                onClick={() => window.location.reload()}
                iconName="RefreshCw"
                size="sm"
              >
                Refresh Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialAnalyticsDashboard;