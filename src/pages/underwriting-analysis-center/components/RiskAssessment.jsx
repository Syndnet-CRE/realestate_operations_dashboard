import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RiskAssessment = ({ propertyData, onUpdateRisk, onSaveAssessment }) => {
  const [riskFactors, setRiskFactors] = useState({
    market: { score: 7, weight: 25, factors: ['Strong job growth', 'Stable population', 'Limited new supply'] },
    location: { score: 8, weight: 20, factors: ['Prime location', 'Good transportation', 'Nearby amenities'] },
    property: { score: 6, weight: 20, factors: ['Good condition', 'Modern systems', 'Deferred maintenance'] },
    financial: { score: 7, weight: 15, factors: ['Stable cash flow', 'Conservative leverage', 'Market rents'] },
    tenant: { score: 8, weight: 10, factors: ['Credit tenants', 'Long-term leases', 'Low vacancy'] },
    environmental: { score: 9, weight: 10, factors: ['No known issues', 'Clean Phase I', 'Good drainage'] }
  });

  const [activeCategory, setActiveCategory] = useState('market');

  const categories = [
    { id: 'market', label: 'Market Risk', icon: 'TrendingUp', color: 'text-primary' },
    { id: 'location', label: 'Location Risk', icon: 'MapPin', color: 'text-accent' },
    { id: 'property', label: 'Property Risk', icon: 'Building', color: 'text-secondary' },
    { id: 'financial', label: 'Financial Risk', icon: 'DollarSign', color: 'text-success' },
    { id: 'tenant', label: 'Tenant Risk', icon: 'Users', color: 'text-warning' },
    { id: 'environmental', label: 'Environmental Risk', icon: 'Leaf', color: 'text-error' }
  ];

  const calculateOverallRisk = () => {
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.values(riskFactors).forEach(factor => {
      totalScore += factor.score * (factor.weight / 100);
      totalWeight += factor.weight;
    });
    
    return totalScore;
  };

  const getRiskLevel = (score) => {
    if (score >= 8) return { level: 'Low', color: 'text-success bg-success/10' };
    if (score >= 6) return { level: 'Medium', color: 'text-warning bg-warning/10' };
    return { level: 'High', color: 'text-error bg-error/10' };
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-error';
  };

  const handleScoreChange = (category, newScore) => {
    setRiskFactors(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        score: Math.max(1, Math.min(10, newScore))
      }
    }));
  };

  const overallRisk = calculateOverallRisk();
  const riskAssessment = getRiskLevel(overallRisk);

  const riskMitigationStrategies = {
    market: [
      'Monitor local economic indicators',
      'Diversify tenant base across industries',
      'Maintain competitive rental rates'
    ],
    location: [
      'Enhance property visibility and access',
      'Invest in local area improvements',
      'Monitor transportation developments'
    ],
    property: [
      'Implement preventive maintenance program',
      'Budget for capital improvements',
      'Regular property inspections'
    ],
    financial: [
      'Maintain adequate cash reserves',
      'Consider interest rate hedging',
      'Monitor debt service coverage'
    ],
    tenant: [
      'Diversify tenant mix',
      'Implement tenant retention programs',
      'Regular credit monitoring'
    ],
    environmental: [
      'Regular environmental assessments',
      'Maintain environmental insurance',
      'Monitor regulatory changes'
    ]
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-base">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading-semibold text-text-primary">
            Risk Assessment
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${riskAssessment.color}`}>
              Overall Risk: {riskAssessment.level}
            </div>
            <Button
              variant="primary"
              onClick={onSaveAssessment}
              iconName="Save"
              className="text-sm"
            >
              Save Assessment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-background rounded-lg p-3 text-center">
            <p className="text-text-secondary text-sm mb-1">Overall Score</p>
            <p className={`text-2xl font-heading-semibold ${getScoreColor(overallRisk)}`}>
              {overallRisk.toFixed(1)}/10
            </p>
          </div>
          <div className="bg-background rounded-lg p-3 text-center">
            <p className="text-text-secondary text-sm mb-1">Risk Level</p>
            <p className={`text-lg font-heading-semibold ${riskAssessment.color.split(' ')[0]}`}>
              {riskAssessment.level}
            </p>
          </div>
          <div className="bg-background rounded-lg p-3 text-center">
            <p className="text-text-secondary text-sm mb-1">Recommendation</p>
            <p className={`text-lg font-heading-semibold ${overallRisk >= 7 ? 'text-success' : overallRisk >= 5 ? 'text-warning' : 'text-error'}`}>
              {overallRisk >= 7 ? 'Proceed' : overallRisk >= 5 ? 'Caution' : 'Avoid'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-text-secondary hover:text-text-primary hover:bg-border'
              }`}
            >
              <Icon name={category.icon} size={16} />
              <span>{category.label}</span>
              <span className={`text-xs ${activeCategory === category.id ? 'text-primary-foreground' : getScoreColor(riskFactors[category.id].score)}`}>
                {riskFactors[category.id].score}/10
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-heading-medium text-text-primary">
              {categories.find(c => c.id === activeCategory)?.label} Details
            </h4>
            
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary">Risk Score</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleScoreChange(activeCategory, riskFactors[activeCategory].score - 1)}
                    className="w-8 h-8 rounded-full bg-border hover:bg-text-secondary/20 flex items-center justify-center transition-smooth"
                  >
                    <Icon name="Minus" size={14} />
                  </button>
                  <span className={`text-xl font-heading-semibold w-12 text-center ${getScoreColor(riskFactors[activeCategory].score)}`}>
                    {riskFactors[activeCategory].score}
                  </span>
                  <button
                    onClick={() => handleScoreChange(activeCategory, riskFactors[activeCategory].score + 1)}
                    className="w-8 h-8 rounded-full bg-border hover:bg-text-secondary/20 flex items-center justify-center transition-smooth"
                  >
                    <Icon name="Plus" size={14} />
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">Weight in Overall Score</span>
                  <span className="font-heading-medium">{riskFactors[activeCategory].weight}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${riskFactors[activeCategory].weight}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-text-secondary text-sm mb-2">Key Factors</p>
                <ul className="space-y-1">
                  {riskFactors[activeCategory].factors.map((factor, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Icon name="Check" size={14} className="text-success" />
                      <span className="text-text-primary">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading-medium text-text-primary">
              Risk Mitigation Strategies
            </h4>
            
            <div className="bg-background rounded-lg p-4">
              <ul className="space-y-3">
                {riskMitigationStrategies[activeCategory].map((strategy, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-heading-medium">{index + 1}</span>
                    </div>
                    <span className="text-text-primary text-sm">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background rounded-lg p-4">
              <h5 className="font-heading-medium text-text-primary mb-3">Risk Summary</h5>
              <div className="space-y-2">
                {Object.entries(riskFactors).map(([key, factor]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">
                      {categories.find(c => c.id === key)?.label}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-border rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            factor.score >= 8 ? 'bg-success' : factor.score >= 6 ? 'bg-warning' : 'bg-error'
                          }`}
                          style={{ width: `${factor.score * 10}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-heading-medium w-8 ${getScoreColor(factor.score)}`}>
                        {factor.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;