import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PropertySummaryCard from './components/PropertySummaryCard';
import FinancialInputForm from './components/FinancialInputForm';
import AnalysisResults from './components/AnalysisResults';
import PropertyComparison from './components/PropertyComparison';
import RiskAssessment from './components/RiskAssessment';

const UnderwritingAnalysisCenter = () => {
  const navigate = useNavigate();
  const [activeProperty, setActiveProperty] = useState(null);
  const [financialData, setFinancialData] = useState({});
  const [activeView, setActiveView] = useState('analysis');
  const [savedTemplates, setSavedTemplates] = useState([]);

  const mockProperty = {
    id: 'SP-2024-001',
    name: 'Sunset Plaza Mixed-Use Development',
    address: '123 Main Street',
    city: 'Downtown',
    state: 'CA',
    type: 'Mixed-Use',
    purchasePrice: 2500000,
    squareFootage: 15000,
    capRate: 6.8,
    noi: 170000,
    riskLevel: 'medium',
    underwritingScore: 78,
    lastUpdated: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'
  };

  const viewOptions = [
    { id: 'analysis', label: 'Financial Analysis', icon: 'Calculator' },
    { id: 'comparison', label: 'Property Comparison', icon: 'GitCompare' },
    { id: 'risk', label: 'Risk Assessment', icon: 'Shield' }
  ];

  useEffect(() => {
    setActiveProperty(mockProperty);
    setFinancialData({
      purchasePrice: mockProperty.purchasePrice,
      downPayment: 25,
      interestRate: 6.5,
      loanTerm: 30,
      grossRentalIncome: 350000,
      vacancyRate: 5,
      operatingExpenses: 125000,
      propertyTaxes: 35000,
      insurance: 15000,
      maintenance: 25000,
      management: 8,
      capEx: 15000,
      closingCosts: 3,
      renovationBudget: 0,
      otherIncome: 0
    });
  }, []);

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

  const handleSaveAnalysis = () => {
    alert('Analysis saved successfully!');
  };

  const handlePropertyEdit = () => {
    alert('Opening property editor...');
  };

  const handlePropertyRefresh = () => {
    alert('Refreshing property data...');
  };

  const handleAddProperty = () => {
    alert('Opening property selection dialog...');
  };

  const handleRemoveProperty = (propertyId) => {
    alert(`Removing property ${propertyId} from comparison`);
  };

  const handleSelectProperty = (property) => {
    setActiveProperty(property);
    navigate(`/underwriting-analysis-center?property=${property.id}`);
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
            properties={[]}
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