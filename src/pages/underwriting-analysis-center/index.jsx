import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PropertySummaryCard from './components/PropertySummaryCard';
import FinancialInputForm from './components/FinancialInputForm';
import AnalysisResults from './components/AnalysisResults';
import PropertyComparison from './components/PropertyComparison';
import RiskAssessment from './components/RiskAssessment';
import realEstateService from '../../services/realEstateService';
import authService from '../../services/authService';

const UnderwritingAnalysisCenter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeProperty, setActiveProperty] = useState(null);
  const [financialData, setFinancialData] = useState({});
  const [activeView, setActiveView] = useState('analysis');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);

  // Get property/deal ID from URL params
  const propertyId = searchParams.get('property');
  const dealId = searchParams.get('deal');

  const viewOptions = [
    { id: 'analysis', label: 'Financial Analysis', icon: 'Calculator' },
    { id: 'comparison', label: 'Property Comparison', icon: 'GitCompare' },
    { id: 'risk', label: 'Risk Assessment', icon: 'Shield' }
  ];

  // Fetch property/deal data from API
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

        let propertyData = null;
        let dealData = null;

        // Fetch property or deal based on URL params
        if (dealId) {
          dealData = await realEstateService.getDeal(dealId);
          if (dealData.property_id) {
            propertyData = await realEstateService.getProperty(dealData.property_id);
          }
        } else if (propertyId) {
          propertyData = await realEstateService.getProperty(propertyId);
        } else {
          // No specific property selected - fetch list of properties for comparison
          const propertiesData = await realEstateService.getProperties({ limit: 10 });
          setProperties(propertiesData.properties || []);

          // Set first property as active if available
          if (propertiesData.properties && propertiesData.properties.length > 0) {
            propertyData = propertiesData.properties[0];
          }
        }

        // Transform property/deal data to match component format
        if (propertyData || dealData) {
          const transformedProperty = {
            id: dealData?.id || propertyData?.id,
            name: dealData?.deal_name || `${propertyData?.address}`,
            address: propertyData?.address || dealData?.property_address || 'N/A',
            city: propertyData?.city || dealData?.city || '',
            state: propertyData?.state || dealData?.state || '',
            type: propertyData?.property_type || 'Unknown',
            purchasePrice: parseFloat(dealData?.purchase_price || propertyData?.asking_price || 0),
            squareFootage: parseFloat(propertyData?.square_footage || 0),
            capRate: parseFloat(dealData?.cap_rate || propertyData?.cap_rate || 0),
            noi: parseFloat(dealData?.net_operating_income || 0),
            riskLevel: calculateRiskLevel(dealData || propertyData),
            underwritingScore: calculateUnderwritingScore(dealData || propertyData),
            lastUpdated: formatLastUpdated(propertyData?.updated_at || dealData?.updated_at),
            image: propertyData?.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'
          };

          setActiveProperty(transformedProperty);

          // Set initial financial data from property/deal
          setFinancialData({
            purchasePrice: transformedProperty.purchasePrice,
            downPayment: parseFloat(dealData?.down_payment_percent || 25),
            interestRate: parseFloat(dealData?.interest_rate || 6.5),
            loanTerm: parseFloat(dealData?.loan_term_years || 30),
            grossRentalIncome: parseFloat(dealData?.gross_rental_income || 0),
            vacancyRate: parseFloat(dealData?.vacancy_rate || 5),
            operatingExpenses: parseFloat(dealData?.operating_expenses || 0),
            propertyTaxes: parseFloat(dealData?.property_taxes || 0),
            insurance: parseFloat(dealData?.insurance || 0),
            maintenance: parseFloat(dealData?.maintenance_costs || 0),
            management: parseFloat(dealData?.management_fee_percent || 8),
            capEx: parseFloat(dealData?.cap_ex || 0),
            closingCosts: parseFloat(dealData?.closing_costs_percent || 3),
            renovationBudget: parseFloat(dealData?.renovation_budget || 0),
            otherIncome: parseFloat(dealData?.other_income || 0)
          });
        }
      } catch (err) {
        console.error('Error fetching underwriting data:', err);
        setError(err.message || 'Failed to load property data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dealId, propertyId, navigate]);

  // Helper functions
  const calculateRiskLevel = (data) => {
    const capRate = parseFloat(data?.cap_rate || 0);
    if (capRate > 8) return 'low';
    if (capRate > 5) return 'medium';
    return 'high';
  };

  const calculateUnderwritingScore = (data) => {
    // Simple scoring algorithm based on available metrics
    let score = 50;
    const capRate = parseFloat(data?.cap_rate || 0);
    const roi = parseFloat(data?.roi || 0);

    if (capRate > 0) score += Math.min(capRate * 3, 30);
    if (roi > 0) score += Math.min(roi, 20);

    return Math.min(Math.round(score), 100);
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const handleFinancialDataChange = (newData) => {
    setFinancialData(newData);
  };

  const handleSaveTemplate = () => {
    const templateName = prompt('Enter template name:');
    if (templateName) {
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        data: financialData,
        createdAt: new Date().toISOString()
      };
      setSavedTemplates([...savedTemplates, newTemplate]);
      alert('Template saved successfully!');
    }
  };

  const handleLoadTemplate = () => {
    if (savedTemplates.length === 0) {
      alert('No saved templates available');
      return;
    }
    
    const templateNames = savedTemplates.map(t => t.name);
    const selectedTemplate = prompt(`Select template:\n${templateNames.join('\n')}`);
    
    const template = savedTemplates.find(t => t.name === selectedTemplate);
    if (template) {
      setFinancialData(template.data);
      alert('Template loaded successfully!');
    }
  };

  const handleExportReport = () => {
    alert('Exporting comprehensive underwriting report...');
  };

  const handleSaveAnalysis = async () => {
    try {
      // If we have a deal ID, update the deal with the financial data
      if (dealId) {
        const updateData = {
          purchase_price: financialData.purchasePrice,
          down_payment_percent: financialData.downPayment,
          interest_rate: financialData.interestRate,
          loan_term_years: financialData.loanTerm,
          gross_rental_income: financialData.grossRentalIncome,
          vacancy_rate: financialData.vacancyRate,
          operating_expenses: financialData.operatingExpenses,
          property_taxes: financialData.propertyTaxes,
          insurance: financialData.insurance,
          maintenance_costs: financialData.maintenance,
          management_fee_percent: financialData.management,
          cap_ex: financialData.capEx,
          closing_costs_percent: financialData.closingCosts,
          renovation_budget: financialData.renovationBudget,
          other_income: financialData.otherIncome
        };

        await realEstateService.updateDeal(dealId, updateData);
        alert('Analysis saved successfully!');
      } else {
        alert('Cannot save analysis without an associated deal. Please create a deal first.');
      }
    } catch (err) {
      console.error('Error saving analysis:', err);
      alert('Failed to save analysis. Please try again.');
    }
  };

  const handlePropertyEdit = () => {
    if (propertyId) {
      navigate(`/property-acquisition-workflow?property=${propertyId}`);
    } else {
      alert('No property selected');
    }
  };

  const handlePropertyRefresh = async () => {
    try {
      setLoading(true);
      let propertyData = null;
      let dealData = null;

      if (dealId) {
        dealData = await realEstateService.getDeal(dealId);
        if (dealData.property_id) {
          propertyData = await realEstateService.getProperty(dealData.property_id);
        }
      } else if (propertyId) {
        propertyData = await realEstateService.getProperty(propertyId);
      }

      if (propertyData || dealData) {
        const transformedProperty = {
          id: dealData?.id || propertyData?.id,
          name: dealData?.deal_name || `${propertyData?.address}`,
          address: propertyData?.address || dealData?.property_address || 'N/A',
          city: propertyData?.city || dealData?.city || '',
          state: propertyData?.state || dealData?.state || '',
          type: propertyData?.property_type || 'Unknown',
          purchasePrice: parseFloat(dealData?.purchase_price || propertyData?.asking_price || 0),
          squareFootage: parseFloat(propertyData?.square_footage || 0),
          capRate: parseFloat(dealData?.cap_rate || propertyData?.cap_rate || 0),
          noi: parseFloat(dealData?.net_operating_income || 0),
          riskLevel: calculateRiskLevel(dealData || propertyData),
          underwritingScore: calculateUnderwritingScore(dealData || propertyData),
          lastUpdated: formatLastUpdated(new Date()),
          image: propertyData?.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'
        };

        setActiveProperty(transformedProperty);
      }
    } catch (err) {
      console.error('Error refreshing property:', err);
      alert('Failed to refresh property data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    alert('Opening property selection dialog...');
  };

  const handleRemoveProperty = (propertyId) => {
    alert(`Removing property ${propertyId} from comparison`);
  };

  const handleSelectProperty = async (property) => {
    try {
      setLoading(true);
      // Fetch full property data
      const propertyData = await realEstateService.getProperty(property.id);

      const transformedProperty = {
        id: propertyData.id,
        name: propertyData.address,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        type: propertyData.property_type,
        purchasePrice: parseFloat(propertyData.asking_price || 0),
        squareFootage: parseFloat(propertyData.square_footage || 0),
        capRate: parseFloat(propertyData.cap_rate || 0),
        noi: 0,
        riskLevel: calculateRiskLevel(propertyData),
        underwritingScore: calculateUnderwritingScore(propertyData),
        lastUpdated: formatLastUpdated(propertyData.updated_at),
        image: propertyData.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'
      };

      setActiveProperty(transformedProperty);
      navigate(`/underwriting-analysis-center?property=${property.id}`);
    } catch (err) {
      console.error('Error selecting property:', err);
      alert('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRisk = (riskData) => {
    console.log('Risk data updated:', riskData);
  };

  const handleSaveRiskAssessment = () => {
    alert('Risk assessment saved successfully!');
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'analysis':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <FinancialInputForm
                initialData={financialData}
                onDataChange={handleFinancialDataChange}
                onSaveTemplate={handleSaveTemplate}
                onLoadTemplate={handleLoadTemplate}
              />
            </div>
            <div className="lg:col-span-3">
              <AnalysisResults
                financialData={financialData}
                onExportReport={handleExportReport}
                onSaveAnalysis={handleSaveAnalysis}
              />
            </div>
          </div>
        );
      case 'comparison':
        return (
          <PropertyComparison
            properties={properties}
            onAddProperty={handleAddProperty}
            onRemoveProperty={handleRemoveProperty}
            onSelectProperty={handleSelectProperty}
          />
        );
      case 'risk':
        return (
          <RiskAssessment
            propertyData={activeProperty}
            onUpdateRisk={handleUpdateRisk}
            onSaveAssessment={handleSaveRiskAssessment}
          />
        );
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="main-content-offset pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading property data...</p>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Property</h2>
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-heading-semibold text-text-primary mb-2">
                  Underwriting Analysis Center
                </h1>
                <p className="text-text-secondary">
                  Comprehensive financial modeling and risk assessment tools for property evaluation
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/deal-pipeline-dashboard')}
                  iconName="ArrowLeft"
                  className="text-sm"
                >
                  Back to Pipeline
                </Button>
                <Button
                  variant="primary"
                  onClick={handleExportReport}
                  iconName="Download"
                  className="text-sm"
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* View Navigation */}
            <div className="flex space-x-1 bg-surface border border-border rounded-lg p-1">
              {viewOptions.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                    activeView === view.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background'
                  }`}
                >
                  <Icon name={view.icon} size={16} />
                  <span>{view.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Property Summary */}
          {activeProperty && (
            <div className="mb-6">
              <PropertySummaryCard
                property={activeProperty}
                onEdit={handlePropertyEdit}
                onRefresh={handlePropertyRefresh}
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className="space-y-6">
            {renderMainContent()}
          </div>

          {/* Quick Actions */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
            <Button
              variant="primary"
              onClick={() => alert('Opening quick calculator...')}
              iconName="Calculator"
              className="w-12 h-12 rounded-full shadow-interactive"
              title="Quick Calculator"
            />
            <Button
              variant="secondary"
              onClick={() => alert('Opening help documentation...')}
              iconName="HelpCircle"
              className="w-12 h-12 rounded-full shadow-interactive"
              title="Help & Documentation"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnderwritingAnalysisCenter;