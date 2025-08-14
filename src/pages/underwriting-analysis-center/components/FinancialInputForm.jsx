import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FinancialInputForm = ({ initialData, onDataChange, onSaveTemplate, onLoadTemplate }) => {
  const [formData, setFormData] = useState({
    purchasePrice: initialData?.purchasePrice || 2500000,
    downPayment: initialData?.downPayment || 25,
    interestRate: initialData?.interestRate || 6.5,
    loanTerm: initialData?.loanTerm || 30,
    grossRentalIncome: initialData?.grossRentalIncome || 350000,
    vacancyRate: initialData?.vacancyRate || 5,
    operatingExpenses: initialData?.operatingExpenses || 125000,
    propertyTaxes: initialData?.propertyTaxes || 35000,
    insurance: initialData?.insurance || 15000,
    maintenance: initialData?.maintenance || 25000,
    management: initialData?.management || 8,
    capEx: initialData?.capEx || 15000,
    ...initialData
  });

  const [activeSection, setActiveSection] = useState('acquisition');

  const sections = [
    { id: 'acquisition', label: 'Acquisition', icon: 'DollarSign' },
    { id: 'financing', label: 'Financing', icon: 'CreditCard' },
    { id: 'income', label: 'Income', icon: 'TrendingUp' },
    { id: 'expenses', label: 'Expenses', icon: 'TrendingDown' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: parseFloat(value) || 0 };
    setFormData(updatedData);
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderAcquisitionSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Purchase Price
        </label>
        <Input
          type="number"
          value={formData.purchasePrice}
          onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
          placeholder="2,500,000"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Closing Costs (%)
        </label>
        <Input
          type="number"
          value={formData.closingCosts || 3}
          onChange={(e) => handleInputChange('closingCosts', e.target.value)}
          placeholder="3"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Renovation Budget
        </label>
        <Input
          type="number"
          value={formData.renovationBudget || 0}
          onChange={(e) => handleInputChange('renovationBudget', e.target.value)}
          placeholder="0"
          className="w-full"
        />
      </div>
    </div>
  );

  const renderFinancingSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Down Payment (%)
        </label>
        <Input
          type="number"
          value={formData.downPayment}
          onChange={(e) => handleInputChange('downPayment', e.target.value)}
          placeholder="25"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Interest Rate (%)
        </label>
        <Input
          type="number"
          step="0.1"
          value={formData.interestRate}
          onChange={(e) => handleInputChange('interestRate', e.target.value)}
          placeholder="6.5"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Loan Term (Years)
        </label>
        <Input
          type="number"
          value={formData.loanTerm}
          onChange={(e) => handleInputChange('loanTerm', e.target.value)}
          placeholder="30"
          className="w-full"
        />
      </div>
      <div className="bg-background rounded-lg p-3">
        <p className="text-sm text-text-secondary mb-1">Loan Amount</p>
        <p className="text-lg font-heading-semibold text-text-primary">
          {formatCurrency(formData.purchasePrice * (1 - formData.downPayment / 100))}
        </p>
      </div>
    </div>
  );

  const renderIncomeSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Gross Rental Income (Annual)
        </label>
        <Input
          type="number"
          value={formData.grossRentalIncome}
          onChange={(e) => handleInputChange('grossRentalIncome', e.target.value)}
          placeholder="350,000"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Vacancy Rate (%)
        </label>
        <Input
          type="number"
          value={formData.vacancyRate}
          onChange={(e) => handleInputChange('vacancyRate', e.target.value)}
          placeholder="5"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Other Income (Annual)
        </label>
        <Input
          type="number"
          value={formData.otherIncome || 0}
          onChange={(e) => handleInputChange('otherIncome', e.target.value)}
          placeholder="0"
          className="w-full"
        />
      </div>
      <div className="bg-background rounded-lg p-3">
        <p className="text-sm text-text-secondary mb-1">Effective Gross Income</p>
        <p className="text-lg font-heading-semibold text-text-primary">
          {formatCurrency(formData.grossRentalIncome * (1 - formData.vacancyRate / 100) + (formData.otherIncome || 0))}
        </p>
      </div>
    </div>
  );

  const renderExpensesSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Property Taxes (Annual)
        </label>
        <Input
          type="number"
          value={formData.propertyTaxes}
          onChange={(e) => handleInputChange('propertyTaxes', e.target.value)}
          placeholder="35,000"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Insurance (Annual)
        </label>
        <Input
          type="number"
          value={formData.insurance}
          onChange={(e) => handleInputChange('insurance', e.target.value)}
          placeholder="15,000"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Maintenance & Repairs (Annual)
        </label>
        <Input
          type="number"
          value={formData.maintenance}
          onChange={(e) => handleInputChange('maintenance', e.target.value)}
          placeholder="25,000"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Property Management (%)
        </label>
        <Input
          type="number"
          value={formData.management}
          onChange={(e) => handleInputChange('management', e.target.value)}
          placeholder="8"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Capital Expenditures (Annual)
        </label>
        <Input
          type="number"
          value={formData.capEx}
          onChange={(e) => handleInputChange('capEx', e.target.value)}
          placeholder="15,000"
          className="w-full"
        />
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'acquisition': return renderAcquisitionSection();
      case 'financing': return renderFinancingSection();
      case 'income': return renderIncomeSection();
      case 'expenses': return renderExpensesSection();
      default: return renderAcquisitionSection();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-base">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading-semibold text-text-primary">
            Financial Inputs
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={onLoadTemplate}
              iconName="Upload"
              className="text-sm"
            >
              Load Template
            </Button>
            <Button
              variant="ghost"
              onClick={onSaveTemplate}
              iconName="Save"
              className="text-sm"
            >
              Save Template
            </Button>
          </div>
        </div>

        <div className="flex space-x-1 bg-background rounded-lg p-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeSection === section.id
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={section.icon} size={16} />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default FinancialInputForm;