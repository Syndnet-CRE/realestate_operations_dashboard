import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisResults = ({ financialData, onExportReport, onSaveAnalysis }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary', icon: 'BarChart3' },
    { id: 'cashflow', label: 'Cash Flow', icon: 'TrendingUp' },
    { id: 'sensitivity', label: 'Sensitivity', icon: 'Target' },
    { id: 'comparison', label: 'Comparison', icon: 'GitCompare' }
  ];

  const calculations = useMemo(() => {
    const purchasePrice = financialData.purchasePrice || 0;
    const downPayment = (financialData.downPayment || 0) / 100;
    const loanAmount = purchasePrice * (1 - downPayment);
    const interestRate = (financialData.interestRate || 0) / 100;
    const loanTerm = financialData.loanTerm || 30;
    
    // Monthly payment calculation
    const monthlyRate = interestRate / 12;
    const numPayments = loanTerm * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const annualDebtService = monthlyPayment * 12;

    // Income calculations
    const grossRentalIncome = financialData.grossRentalIncome || 0;
    const vacancyRate = (financialData.vacancyRate || 0) / 100;
    const effectiveGrossIncome = grossRentalIncome * (1 - vacancyRate) + (financialData.otherIncome || 0);

    // Expense calculations
    const propertyTaxes = financialData.propertyTaxes || 0;
    const insurance = financialData.insurance || 0;
    const maintenance = financialData.maintenance || 0;
    const managementFee = effectiveGrossIncome * ((financialData.management || 0) / 100);
    const capEx = financialData.capEx || 0;
    const totalOperatingExpenses = propertyTaxes + insurance + maintenance + managementFee + capEx;

    // Key metrics
    const noi = effectiveGrossIncome - totalOperatingExpenses;
    const capRate = (noi / purchasePrice) * 100;
    const cashFlow = noi - annualDebtService;
    const totalCashInvested = purchasePrice * downPayment + (financialData.closingCosts || 0) + (financialData.renovationBudget || 0);
    const cashOnCashReturn = (cashFlow / totalCashInvested) * 100;
    const dscr = noi / annualDebtService;

    return {
      purchasePrice,
      loanAmount,
      annualDebtService,
      effectiveGrossIncome,
      totalOperatingExpenses,
      noi,
      capRate,
      cashFlow,
      totalCashInvested,
      cashOnCashReturn,
      dscr,
      monthlyPayment
    };
  }, [financialData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const cashFlowData = [
    { year: 'Year 1', income: calculations.effectiveGrossIncome, expenses: calculations.totalOperatingExpenses, cashFlow: calculations.cashFlow },
    { year: 'Year 2', income: calculations.effectiveGrossIncome * 1.03, expenses: calculations.totalOperatingExpenses * 1.02, cashFlow: calculations.cashFlow * 1.05 },
    { year: 'Year 3', income: calculations.effectiveGrossIncome * 1.06, expenses: calculations.totalOperatingExpenses * 1.04, cashFlow: calculations.cashFlow * 1.10 },
    { year: 'Year 4', income: calculations.effectiveGrossIncome * 1.09, expenses: calculations.totalOperatingExpenses * 1.06, cashFlow: calculations.cashFlow * 1.15 },
    { year: 'Year 5', income: calculations.effectiveGrossIncome * 1.12, expenses: calculations.totalOperatingExpenses * 1.08, cashFlow: calculations.cashFlow * 1.20 }
  ];

  const sensitivityData = [
    { scenario: 'Base Case', capRate: calculations.capRate, cashOnCash: calculations.cashOnCashReturn, dscr: calculations.dscr },
    { scenario: 'Optimistic', capRate: calculations.capRate + 0.5, cashOnCash: calculations.cashOnCashReturn + 2, dscr: calculations.dscr + 0.2 },
    { scenario: 'Pessimistic', capRate: calculations.capRate - 0.5, cashOnCash: calculations.cashOnCashReturn - 2, dscr: calculations.dscr - 0.2 }
  ];

  const expenseBreakdown = [
    { name: 'Property Taxes', value: financialData.propertyTaxes || 0, color: '#1E3A5F' },
    { name: 'Insurance', value: financialData.insurance || 0, color: '#4A90A4' },
    { name: 'Maintenance', value: financialData.maintenance || 0, color: '#E67E22' },
    { name: 'Management', value: calculations.effectiveGrossIncome * ((financialData.management || 0) / 100), color: '#27AE60' },
    { name: 'CapEx', value: financialData.capEx || 0, color: '#F39C12' }
  ];

  const renderSummaryTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm">Cap Rate</p>
            <Icon name="TrendingUp" size={16} className="text-success" />
          </div>
          <p className="text-2xl font-heading-semibold text-text-primary">
            {formatPercentage(calculations.capRate)}
          </p>
          <p className="text-text-secondary text-xs mt-1">
            {calculations.capRate > 6 ? 'Above Market' : 'Below Market'}
          </p>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm">Cash-on-Cash</p>
            <Icon name="DollarSign" size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-heading-semibold text-text-primary">
            {formatPercentage(calculations.cashOnCashReturn)}
          </p>
          <p className="text-text-secondary text-xs mt-1">
            {calculations.cashOnCashReturn > 8 ? 'Strong Return' : 'Moderate Return'}
          </p>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm">DSCR</p>
            <Icon name="Shield" size={16} className="text-accent" />
          </div>
          <p className="text-2xl font-heading-semibold text-text-primary">
            {calculations.dscr.toFixed(2)}
          </p>
          <p className="text-text-secondary text-xs mt-1">
            {calculations.dscr > 1.25 ? 'Low Risk' : 'High Risk'}
          </p>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary text-sm">Annual Cash Flow</p>
            <Icon name="Banknote" size={16} className="text-success" />
          </div>
          <p className="text-2xl font-heading-semibold text-text-primary">
            {formatCurrency(calculations.cashFlow)}
          </p>
          <p className="text-text-secondary text-xs mt-1">
            {calculations.cashFlow > 0 ? 'Positive' : 'Negative'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg p-4">
          <h4 className="font-heading-medium text-text-primary mb-4">Income vs Expenses</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Effective Gross Income</span>
              <span className="font-heading-medium text-success">
                {formatCurrency(calculations.effectiveGrossIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Operating Expenses</span>
              <span className="font-heading-medium text-error">
                -{formatCurrency(calculations.totalOperatingExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Debt Service</span>
              <span className="font-heading-medium text-error">
                -{formatCurrency(calculations.annualDebtService)}
              </span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between items-center">
                <span className="font-heading-medium text-text-primary">Net Cash Flow</span>
                <span className={`font-heading-semibold text-lg ${calculations.cashFlow > 0 ? 'text-success' : 'text-error'}`}>
                  {formatCurrency(calculations.cashFlow)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg p-4">
          <h4 className="font-heading-medium text-text-primary mb-4">Expense Breakdown</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCashFlowTab = () => (
    <div className="space-y-6">
      <div className="bg-background rounded-lg p-4">
        <h4 className="font-heading-medium text-text-primary mb-4">5-Year Cash Flow Projection</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="income" fill="#27AE60" name="Income" />
              <Bar dataKey="expenses" fill="#E74C3C" name="Expenses" />
              <Bar dataKey="cashFlow" fill="#1E3A5F" name="Cash Flow" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg p-4">
          <h4 className="font-heading-medium text-text-primary mb-4">Key Assumptions</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Income Growth Rate</span>
              <span className="font-heading-medium">3.0% annually</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Expense Growth Rate</span>
              <span className="font-heading-medium">2.0% annually</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Vacancy Rate</span>
              <span className="font-heading-medium">{formatPercentage(financialData.vacancyRate || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Management Fee</span>
              <span className="font-heading-medium">{formatPercentage(financialData.management || 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg p-4">
          <h4 className="font-heading-medium text-text-primary mb-4">Investment Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Investment</span>
              <span className="font-heading-medium">{formatCurrency(calculations.totalCashInvested)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Loan Amount</span>
              <span className="font-heading-medium">{formatCurrency(calculations.loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Monthly Payment</span>
              <span className="font-heading-medium">{formatCurrency(calculations.monthlyPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Break-even Occupancy</span>
              <span className="font-heading-medium">
                {((calculations.totalOperatingExpenses + calculations.annualDebtService) / financialData.grossRentalIncome * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSensitivityTab = () => (
    <div className="space-y-6">
      <div className="bg-background rounded-lg p-4">
        <h4 className="font-heading-medium text-text-primary mb-4">Scenario Analysis</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sensitivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="scenario" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              <Bar dataKey="capRate" fill="#1E3A5F" name="Cap Rate %" />
              <Bar dataKey="cashOnCash" fill="#4A90A4" name="Cash-on-Cash %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {sensitivityData.map((scenario, index) => (
          <div key={index} className="bg-background rounded-lg p-4">
            <h5 className="font-heading-medium text-text-primary mb-3">{scenario.scenario}</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">Cap Rate</span>
                <span className="font-heading-medium">{formatPercentage(scenario.capRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">Cash-on-Cash</span>
                <span className="font-heading-medium">{formatPercentage(scenario.cashOnCash)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">DSCR</span>
                <span className="font-heading-medium">{scenario.dscr.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComparisonTab = () => (
    <div className="space-y-6">
      <div className="bg-background rounded-lg p-4">
        <h4 className="font-heading-medium text-text-primary mb-4">Market Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-text-secondary">Metric</th>
                <th className="text-right py-2 text-text-secondary">Current Property</th>
                <th className="text-right py-2 text-text-secondary">Market Average</th>
                <th className="text-right py-2 text-text-secondary">Variance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 text-text-primary">Cap Rate</td>
                <td className="py-2 text-right font-heading-medium">{formatPercentage(calculations.capRate)}</td>
                <td className="py-2 text-right">6.5%</td>
                <td className={`py-2 text-right font-heading-medium ${calculations.capRate > 6.5 ? 'text-success' : 'text-error'}`}>
                  {calculations.capRate > 6.5 ? '+' : ''}{(calculations.capRate - 6.5).toFixed(2)}%
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-text-primary">Cash-on-Cash Return</td>
                <td className="py-2 text-right font-heading-medium">{formatPercentage(calculations.cashOnCashReturn)}</td>
                <td className="py-2 text-right">8.0%</td>
                <td className={`py-2 text-right font-heading-medium ${calculations.cashOnCashReturn > 8 ? 'text-success' : 'text-error'}`}>
                  {calculations.cashOnCashReturn > 8 ? '+' : ''}{(calculations.cashOnCashReturn - 8).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="py-2 text-text-primary">DSCR</td>
                <td className="py-2 text-right font-heading-medium">{calculations.dscr.toFixed(2)}</td>
                <td className="py-2 text-right">1.25</td>
                <td className={`py-2 text-right font-heading-medium ${calculations.dscr > 1.25 ? 'text-success' : 'text-error'}`}>
                  {calculations.dscr > 1.25 ? '+' : ''}{(calculations.dscr - 1.25).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary': return renderSummaryTab();
      case 'cashflow': return renderCashFlowTab();
      case 'sensitivity': return renderSensitivityTab();
      case 'comparison': return renderComparisonTab();
      default: return renderSummaryTab();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-base">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading-semibold text-text-primary">
            Analysis Results
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={onSaveAnalysis}
              iconName="Save"
              className="text-sm"
            >
              Save Analysis
            </Button>
            <Button
              variant="primary"
              onClick={onExportReport}
              iconName="Download"
              className="text-sm"
            >
              Export Report
            </Button>
          </div>
        </div>

        <div className="flex space-x-1 bg-background rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeTab === tab.id
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalysisResults;