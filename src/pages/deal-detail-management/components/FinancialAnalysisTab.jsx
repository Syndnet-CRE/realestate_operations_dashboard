import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const FinancialAnalysisTab = ({ property, onAnalysisUpdate }) => {
  const [analysisData, setAnalysisData] = useState({
    purchasePrice: property.purchasePrice || 0,
    rehabCosts: property.rehabBudget || 0,
    holdingCosts: property.holdingCosts || 0,
    sellingCosts: 0,
    arv: property.arv || 0,
    downPayment: 0,
    loanAmount: 0,
    interestRate: 0,
    loanTerm: 0
  });

  const [calculations, setCalculations] = useState({
    totalInvestment: 0,
    grossProfit: 0,
    netProfit: 0,
    roi: 0,
    cashOnCash: 0,
    monthlyPayment: 0,
    totalInterest: 0
  });

  const cashFlowData = [
    { month: 'Month 1', income: 2500, expenses: 1800, cashFlow: 700 },
    { month: 'Month 2', income: 2500, expenses: 1750, cashFlow: 750 },
    { month: 'Month 3', income: 2500, expenses: 1900, cashFlow: 600 },
    { month: 'Month 4', income: 2500, expenses: 1800, cashFlow: 700 },
    { month: 'Month 5', income: 2500, expenses: 1850, cashFlow: 650 },
    { month: 'Month 6', income: 2500, expenses: 1800, cashFlow: 700 }
  ];

  const expenseBreakdown = [
    { name: 'Purchase Price', value: analysisData.purchasePrice, color: '#1E3A5F' },
    { name: 'Rehab Costs', value: analysisData.rehabCosts, color: '#4A90A4' },
    { name: 'Holding Costs', value: analysisData.holdingCosts, color: '#E67E22' },
    { name: 'Selling Costs', value: analysisData.sellingCosts, color: '#27AE60' }
  ];

  const roiComparison = [
    { property: 'Current Deal', roi: calculations.roi, cashOnCash: calculations.cashOnCash },
    { property: 'Market Average', roi: 15, cashOnCash: 8 },
    { property: 'Portfolio Average', roi: 18, cashOnCash: 12 },
    { property: 'Target Goal', roi: 25, cashOnCash: 15 }
  ];

  useEffect(() => {
    calculateFinancials();
  }, [analysisData]);

  const calculateFinancials = () => {
    const totalInvestment = analysisData.purchasePrice + analysisData.rehabCosts + analysisData.holdingCosts;
    const sellingCosts = analysisData.arv * 0.08; // 8% selling costs
    const grossProfit = analysisData.arv - totalInvestment;
    const netProfit = grossProfit - sellingCosts;
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
    
    // Loan calculations
    const monthlyRate = analysisData.interestRate / 100 / 12;
    const numPayments = analysisData.loanTerm * 12;
    const monthlyPayment = analysisData.loanAmount > 0 && monthlyRate > 0 
      ? (analysisData.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;
    
    const totalInterest = (monthlyPayment * numPayments) - analysisData.loanAmount;
    const cashInvested = analysisData.downPayment + analysisData.rehabCosts + analysisData.holdingCosts;
    const cashOnCash = cashInvested > 0 ? (netProfit / cashInvested) * 100 : 0;

    setCalculations({
      totalInvestment,
      grossProfit,
      netProfit,
      roi: Math.round(roi * 100) / 100,
      cashOnCash: Math.round(cashOnCash * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100
    });

    setAnalysisData(prev => ({ ...prev, sellingCosts }));
  };

  const handleInputChange = (field, value) => {
    setAnalysisData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportAnalysis = () => {
    const analysisReport = {
      property: property.name,
      analysis: analysisData,
      calculations: calculations,
      timestamp: new Date().toISOString()
    };
    console.log('Exporting analysis:', analysisReport);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading-semibold text-text-primary text-lg">Financial Analysis</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportAnalysis} iconName="Download">
            Export Analysis
          </Button>
          <Button variant="primary" iconName="Calculator">
            Run Scenarios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Parameters */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="font-body-medium text-text-primary mb-4">Deal Parameters</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Purchase Price
                </label>
                <Input
                  type="number"
                  value={analysisData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Rehab Costs
                </label>
                <Input
                  type="number"
                  value={analysisData.rehabCosts}
                  onChange={(e) => handleInputChange('rehabCosts', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Holding Costs
                </label>
                <Input
                  type="number"
                  value={analysisData.holdingCosts}
                  onChange={(e) => handleInputChange('holdingCosts', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  After Repair Value (ARV)
                </label>
                <Input
                  type="number"
                  value={analysisData.arv}
                  onChange={(e) => handleInputChange('arv', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="font-body-medium text-text-primary mb-4">Financing Details</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Down Payment
                </label>
                <Input
                  type="number"
                  value={analysisData.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Loan Amount
                </label>
                <Input
                  type="number"
                  value={analysisData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Interest Rate (%)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={analysisData.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Loan Term (Years)
                </label>
                <Input
                  type="number"
                  value={analysisData.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="xl:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name="TrendingUp" size={20} className="text-success" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  calculations.roi >= 20 ? 'bg-success/10 text-success' : 
                  calculations.roi >= 15 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                }`}>
                  {calculations.roi >= 20 ? 'Excellent' : calculations.roi >= 15 ? 'Good' : 'Poor'}
                </span>
              </div>
              <p className="text-text-secondary text-xs mb-1">ROI</p>
              <p className="font-heading-semibold text-text-primary text-xl">
                {calculations.roi}%
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name="DollarSign" size={20} className="text-primary" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  calculations.netProfit >= 50000 ? 'bg-success/10 text-success' : 
                  calculations.netProfit >= 25000 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                }`}>
                  {calculations.netProfit >= 50000 ? 'High' : calculations.netProfit >= 25000 ? 'Medium' : 'Low'}
                </span>
              </div>
              <p className="text-text-secondary text-xs mb-1">Net Profit</p>
              <p className="font-heading-semibold text-text-primary text-xl">
                {formatCurrency(calculations.netProfit)}
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Percent" size={20} className="text-accent" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  calculations.cashOnCash >= 15 ? 'bg-success/10 text-success' : 
                  calculations.cashOnCash >= 10 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                }`}>
                  {calculations.cashOnCash >= 15 ? 'Strong' : calculations.cashOnCash >= 10 ? 'Fair' : 'Weak'}
                </span>
              </div>
              <p className="text-text-secondary text-xs mb-1">Cash-on-Cash</p>
              <p className="font-heading-semibold text-text-primary text-xl">
                {calculations.cashOnCash}%
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Calculator" size={20} className="text-text-secondary" />
                <Icon name="Info" size={14} className="text-text-secondary" />
              </div>
              <p className="text-text-secondary text-xs mb-1">Monthly Payment</p>
              <p className="font-heading-semibold text-text-primary text-xl">
                {formatCurrency(calculations.monthlyPayment)}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cash Flow Projection */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h4 className="font-body-medium text-text-primary mb-4">Cash Flow Projection</h4>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), '']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cashFlow" 
                      stroke="#1E3A5F" 
                      strokeWidth={2}
                      dot={{ fill: '#1E3A5F', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h4 className="font-body-medium text-text-primary mb-4">Investment Breakdown</h4>
              <div className="w-full h-64">
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
              <div className="mt-4 space-y-2">
                {expenseBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-text-secondary">{item.name}</span>
                    </div>
                    <span className="font-body-medium text-text-primary">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROI Comparison */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="font-body-medium text-text-primary mb-4">Performance Comparison</h4>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="property" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar dataKey="roi" fill="#1E3A5F" name="ROI" />
                  <Bar dataKey="cashOnCash" fill="#4A90A4" name="Cash-on-Cash" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysisTab;