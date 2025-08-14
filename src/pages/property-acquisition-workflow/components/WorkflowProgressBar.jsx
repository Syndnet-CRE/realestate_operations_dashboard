import React from 'react';
import Icon from '../../../components/AppIcon';

const WorkflowProgressBar = ({ currentStage, stages, onStageClick }) => {
  const getStageStatus = (stageIndex) => {
    if (stageIndex < currentStage) return 'completed';
    if (stageIndex === currentStage) return 'current';
    return 'pending';
  };

  const getStageIcon = (stage, status) => {
    if (status === 'completed') return 'CheckCircle';
    if (status === 'current') return stage.icon;
    return 'Circle';
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10 border-success';
      case 'current': return 'text-primary bg-primary/10 border-primary';
      default: return 'text-text-secondary bg-background border-border';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading-semibold text-text-primary">Acquisition Workflow Progress</h2>
        <div className="text-sm text-text-secondary">
          Stage {currentStage + 1} of {stages.length}
        </div>
      </div>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
          />
        </div>
        
        {/* Stages */}
        <div className="flex justify-between relative">
          {stages.map((stage, index) => {
            const status = getStageStatus(index);
            return (
              <button
                key={stage.id}
                onClick={() => onStageClick && onStageClick(index)}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-base ${getStageColor(status)}`}
                disabled={status === 'pending'}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-surface border-2 border-current">
                  <Icon 
                    name={getStageIcon(stage, status)} 
                    size={20} 
                    className={status === 'completed' ? 'text-success' : 'text-current'}
                  />
                </div>
                <span className="text-sm font-body-medium text-center max-w-20">
                  {stage.name}
                </span>
                {stage.estimatedDays && status !== 'completed' && (
                  <span className="text-xs text-text-secondary mt-1">
                    ~{stage.estimatedDays} days
                  </span>
                )}
                {stage.completedDate && status === 'completed' && (
                  <span className="text-xs text-success mt-1">
                    {stage.completedDate}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgressBar;