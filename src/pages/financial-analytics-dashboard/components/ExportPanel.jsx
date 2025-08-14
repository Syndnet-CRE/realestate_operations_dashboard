import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportPanel = ({ 
  onExport, 
  availableFormats = ['pdf', 'excel', 'csv', 'powerpoint'],
  isOpen = false,
  onToggle 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeRawData: false,
    includeSummary: true,
    dateRange: 'current',
    customFileName: ''
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { 
      id: 'pdf', 
      label: 'PDF Report', 
      icon: 'FileText', 
      description: 'Executive presentation format with charts and summaries',
      color: 'text-error'
    },
    { 
      id: 'excel', 
      label: 'Excel Workbook', 
      icon: 'FileSpreadsheet', 
      description: 'Detailed data with multiple sheets and pivot tables',
      color: 'text-success'
    },
    { 
      id: 'csv', 
      label: 'CSV Data', 
      icon: 'Database', 
      description: 'Raw data export for external analysis',
      color: 'text-text-secondary'
    },
    { 
      id: 'powerpoint', 
      label: 'PowerPoint', 
      icon: 'Presentation', 
      description: 'Board presentation with key insights and visuals',
      color: 'text-warning'
    }
  ];

  const exportTemplates = [
    { id: 'executive', name: 'Executive Dashboard', description: 'High-level KPIs and trends' },
    { id: 'detailed', name: 'Detailed Financial', description: 'Complete financial breakdown' },
    { id: 'compliance', name: 'Compliance Report', description: 'Regulatory and audit documentation' },
    { id: 'performance', name: 'Performance Analysis', description: 'Team and property performance metrics' }
  ];

  const handleExport = async (template = null) => {
    setIsExporting(true);
    
    const exportData = {
      format: selectedFormat,
      template: template?.id || 'custom',
      options: exportOptions,
      timestamp: new Date().toISOString(),
      fileName: exportOptions.customFileName || `financial-report-${Date.now()}`
    };

    try {
      if (onExport) {
        await onExport(exportData);
      }
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Export completed:', exportData);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleOptionChange = (key, value) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) {
    return (
      <Button
        variant="primary"
        onClick={onToggle}
        iconName="Download"
      >
        Export Report
      </Button>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading-medium text-text-primary text-lg">Export Report</h3>
        <Button
          variant="ghost"
          onClick={onToggle}
          iconName="X"
          size="sm"
        />
      </div>

      {/* Quick Export Templates */}
      <div>
        <h4 className="font-body-medium text-text-primary mb-3">Quick Export Templates</h4>
        <div className="grid grid-cols-2 gap-3">
          {exportTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleExport(template)}
              disabled={isExporting}
              className="p-4 text-left bg-background hover:bg-border rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-body-medium text-text-primary text-sm mb-1">
                    {template.name}
                  </h5>
                  <p className="text-text-secondary text-xs">
                    {template.description}
                  </p>
                </div>
                <Icon name="Download" size={16} className="text-text-secondary mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <h4 className="font-body-medium text-text-primary mb-3">Export Format</h4>
        <div className="space-y-2">
          {formatOptions.filter(format => availableFormats.includes(format.id)).map((format) => (
            <label
              key={format.id}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-smooth ${
                selectedFormat === format.id
                  ? 'border-primary bg-primary/5' :'border-border hover:bg-background'
              }`}
            >
              <input
                type="radio"
                name="exportFormat"
                value={format.id}
                checked={selectedFormat === format.id}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center space-x-3 flex-1">
                <Icon name={format.icon} size={20} className={format.color} />
                <div>
                  <div className="font-body-medium text-text-primary text-sm">
                    {format.label}
                  </div>
                  <div className="text-text-secondary text-xs">
                    {format.description}
                  </div>
                </div>
              </div>
              {selectedFormat === format.id && (
                <Icon name="Check" size={16} className="text-primary" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div>
        <h4 className="font-body-medium text-text-primary mb-3">Export Options</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={exportOptions.includeCharts}
              onChange={(e) => handleOptionChange('includeCharts', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
            />
            <span className="text-sm text-text-primary">Include charts and visualizations</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={exportOptions.includeRawData}
              onChange={(e) => handleOptionChange('includeRawData', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
            />
            <span className="text-sm text-text-primary">Include raw data tables</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={exportOptions.includeSummary}
              onChange={(e) => handleOptionChange('includeSummary', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
            />
            <span className="text-sm text-text-primary">Include executive summary</span>
          </label>
        </div>
      </div>

      {/* Custom File Name */}
      <div>
        <label className="block text-sm font-body-medium text-text-primary mb-2">
          Custom File Name (Optional)
        </label>
        <input
          type="text"
          placeholder="financial-report-2024"
          value={exportOptions.customFileName}
          onChange={(e) => handleOptionChange('customFileName', e.target.value)}
          className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
        />
      </div>

      {/* Export Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-text-secondary">
          Export as {formatOptions.find(f => f.id === selectedFormat)?.label}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onToggle}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleExport()}
            disabled={isExporting}
            iconName={isExporting ? "Loader2" : "Download"}
            className={isExporting ? "animate-spin" : ""}
          >
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={20} className="text-primary animate-spin" />
            <div>
              <p className="font-body-medium text-text-primary text-sm">
                Generating your report...
              </p>
              <p className="text-text-secondary text-xs">
                This may take a few moments depending on the data size
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;