import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import DealStatusIndicator from '../../../components/ui/DealStatusIndicator';

const DealsDataTable = ({ deals, onDealClick, onBulkAction, userRole, selectedDeals, onDealSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [quickFilter, setQuickFilter] = useState('');

  const columns = [
    { key: 'select', label: '', width: '40px', sortable: false },
    { key: 'dealId', label: 'Deal ID', width: '120px', sortable: true },
    { key: 'propertyAddress', label: 'Property', width: '200px', sortable: true },
    { key: 'propertyType', label: 'Type', width: '100px', sortable: true },
    { key: 'stage', label: 'Stage', width: '140px', sortable: true },
    { key: 'value', label: 'Value', width: '120px', sortable: true },
    { key: 'assignedTo', label: 'Assigned To', width: '140px', sortable: true },
    { key: 'progress', label: 'Progress', width: '100px', sortable: true },
    { key: 'lastUpdated', label: 'Last Updated', width: '120px', sortable: true },
    { key: 'nextAction', label: 'Next Action', width: '160px', sortable: false },
    { key: 'actions', label: '', width: '80px', sortable: false }
  ];

  // Filter columns based on user role
  const visibleColumns = useMemo(() => {
    if (userRole === 'sales_agent') {
      return columns.filter(col => !['value'].includes(col.key));
    }
    return columns;
  }, [userRole]);

  const filteredDeals = useMemo(() => {
    if (!quickFilter) return deals;
    
    return deals.filter(deal => 
      deal.propertyAddress.toLowerCase().includes(quickFilter.toLowerCase()) ||
      deal.dealId.toLowerCase().includes(quickFilter.toLowerCase()) ||
      deal.assignedTo.toLowerCase().includes(quickFilter.toLowerCase()) ||
      deal.propertyType.toLowerCase().includes(quickFilter.toLowerCase())
    );
  }, [deals, quickFilter]);

  const sortedDeals = useMemo(() => {
    if (!sortConfig.key) return filteredDeals;

    return [...filteredDeals].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested properties
      if (sortConfig.key === 'nextAction') {
        aValue = a.nextAction?.dueDate || '';
        bValue = b.nextAction?.dueDate || '';
      }

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredDeals, sortConfig]);

  const paginatedDeals = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedDeals.slice(startIndex, startIndex + pageSize);
  }, [sortedDeals, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedDeals.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = paginatedDeals.map(deal => deal.id);
      onDealSelect(allIds);
    } else {
      onDealSelect([]);
    }
  };

  const handleSelectDeal = (dealId, checked) => {
    if (checked) {
      onDealSelect([...selectedDeals, dealId]);
    } else {
      onDealSelect(selectedDeals.filter(id => id !== dealId));
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const allSelected = paginatedDeals.length > 0 && paginatedDeals.every(deal => selectedDeals.includes(deal.id));
  const someSelected = paginatedDeals.some(deal => selectedDeals.includes(deal.id));

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Table Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading-medium text-text-primary">Deals Overview</h3>
          <div className="flex items-center space-x-3">
            <Input
              type="search"
              placeholder="Quick filter..."
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
              className="w-64"
            />
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
            >
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDeals.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <span className="text-sm text-primary font-medium">
              {selectedDeals.length} deal{selectedDeals.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => onBulkAction('assign')}>
                Assign
              </Button>
              <Button variant="outline" size="sm" onClick={() => onBulkAction('stage')}>
                Change Stage
              </Button>
              <Button variant="outline" size="sm" onClick={() => onBulkAction('export')}>
                Export
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-heading-medium text-text-secondary uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.key === 'select' ? (
                    <Input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                    />
                  ) : column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-text-primary transition-colors"
                    >
                      <span>{column.label}</span>
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedDeals.map((deal) => (
              <tr
                key={deal.id}
                className="hover:bg-background transition-colors cursor-pointer"
                onClick={() => onDealClick(deal)}
              >
                {visibleColumns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm">
                    {column.key === 'select' && (
                      <Input
                        type="checkbox"
                        checked={selectedDeals.includes(deal.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectDeal(deal.id, e.target.checked);
                        }}
                        className="w-4 h-4"
                      />
                    )}
                    {column.key === 'dealId' && (
                      <span className="font-data text-text-primary">{deal.dealId}</span>
                    )}
                    {column.key === 'propertyAddress' && (
                      <div>
                        <div className="font-medium text-text-primary truncate">{deal.propertyAddress}</div>
                        <div className="text-text-secondary text-xs">{deal.city}, {deal.state}</div>
                      </div>
                    )}
                    {column.key === 'propertyType' && (
                      <span className="text-text-secondary">{deal.propertyType}</span>
                    )}
                    {column.key === 'stage' && (
                      <DealStatusIndicator
                        status={deal.stage}
                        dealId={deal.dealId}
                        size="sm"
                      />
                    )}
                    {column.key === 'value' && userRole !== 'sales_agent' && (
                      <span className="font-data text-text-primary">{formatCurrency(deal.value)}</span>
                    )}
                    {column.key === 'assignedTo' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                          {deal.assignedTo.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-text-secondary truncate">{deal.assignedTo}</span>
                      </div>
                    )}
                    {column.key === 'progress' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-background rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${deal.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-text-secondary">{deal.progress}%</span>
                      </div>
                    )}
                    {column.key === 'lastUpdated' && (
                      <span className="text-text-secondary">{formatDate(deal.lastUpdated)}</span>
                    )}
                    {column.key === 'nextAction' && (
                      <div>
                        {deal.nextAction ? (
                          <>
                            <div className="font-medium text-text-primary text-xs truncate">
                              {deal.nextAction.title}
                            </div>
                            <div className="text-text-secondary text-xs">
                              Due: {formatDate(deal.nextAction.dueDate)}
                            </div>
                          </>
                        ) : (
                          <span className="text-text-secondary text-xs">No action</span>
                        )}
                      </div>
                    )}
                    {column.key === 'actions' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="ExternalLink"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDealClick(deal);
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <div className="text-sm text-text-secondary">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedDeals.length)} of {sortedDeals.length} deals
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          />
          <span className="text-sm text-text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          />
        </div>
      </div>
    </div>
  );
};

export default DealsDataTable;