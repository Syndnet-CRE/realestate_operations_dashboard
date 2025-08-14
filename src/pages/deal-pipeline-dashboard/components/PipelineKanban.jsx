import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import DealCard from './DealCard';

const PipelineKanban = ({ deals, onDealMove, onDealClick, userRole }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const scrollContainerRef = useRef(null);

  const stages = [
    { id: 'pipeline', name: 'Pipeline', color: 'bg-text-secondary', icon: 'Clock' },
    { id: 'active', name: 'Active', color: 'bg-success', icon: 'Play' },
    { id: 'underwriting', name: 'Underwriting', color: 'bg-accent', icon: 'Calculator' },
    { id: 'pending', name: 'Pending Approval', color: 'bg-warning', icon: 'AlertCircle' },
    { id: 'approved', name: 'Approved', color: 'bg-success', icon: 'CheckCircle' },
    { id: 'closed', name: 'Closed', color: 'bg-primary', icon: 'Check' }
  ];

  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== stageId) {
      onDealMove(draggedDeal.id, stageId);
    }
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const getStageStats = (stageId) => {
    const stageDeals = getDealsByStage(stageId);
    const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    return {
      count: stageDeals.length,
      totalValue: totalValue
    };
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading-semibold text-text-primary">Deal Pipeline</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Activity" size={16} />
            <span>Live Updates</span>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </div>
          <Button variant="primary" iconName="Plus" onClick={() => console.log('Add new deal')}>
            New Deal
          </Button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto pb-4"
        style={{ minHeight: '600px' }}
      >
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          const stats = getStageStats(stage.id);
          const isDragOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`flex-shrink-0 w-80 bg-background border-2 rounded-lg transition-all duration-200 ${
                isDragOver ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <h3 className="font-heading-medium text-text-primary">{stage.name}</h3>
                    <span className="bg-text-secondary/10 text-text-secondary px-2 py-1 rounded-full text-xs font-medium">
                      {stats.count}
                    </span>
                  </div>
                  <Icon name={stage.icon} size={16} className="text-text-secondary" />
                </div>
                <div className="text-sm text-text-secondary">
                  Total: ${(stats.totalValue / 1000000).toFixed(1)}M
                </div>
              </div>

              {/* Stage Content */}
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {stageDeals.length > 0 ? (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className="cursor-move"
                    >
                      <DealCard
                        deal={deal}
                        onClick={() => onDealClick(deal)}
                        userRole={userRole}
                        showFinancials={userRole === 'acquisition_manager' || userRole === 'executive'}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No deals in this stage</p>
                  </div>
                )}
              </div>

              {/* Stage Footer */}
              {isDragOver && (
                <div className="p-4 border-t border-primary bg-primary/5">
                  <div className="flex items-center justify-center text-primary text-sm">
                    <Icon name="ArrowDown" size={16} className="mr-2" />
                    Drop deal here
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineKanban;