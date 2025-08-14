import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentViewer = ({ documents, onDocumentUpload, onDocumentDelete, onDocumentView }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const documentCategories = [
    { id: 'all', label: 'All Documents', count: documents.length },
    { id: 'financial', label: 'Financial', count: documents.filter(d => d.category === 'financial').length },
    { id: 'legal', label: 'Legal', count: documents.filter(d => d.category === 'legal').length },
    { id: 'inspection', label: 'Inspection', count: documents.filter(d => d.category === 'inspection').length },
    { id: 'appraisal', label: 'Appraisal', count: documents.filter(d => d.category === 'appraisal').length },
    { id: 'environmental', label: 'Environmental', count: documents.filter(d => d.category === 'environmental').length }
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'pdf': return 'FileText';
      case 'doc': case'docx': return 'FileText';
      case 'xls': case'xlsx': return 'FileSpreadsheet';
      case 'jpg': case'jpeg': case'png': return 'Image';
      default: return 'File';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'rejected': return 'text-error bg-error/10';
      case 'review': return 'text-primary bg-primary/10';
      default: return 'text-text-secondary bg-background';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (onDocumentUpload) {
      onDocumentUpload(files);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (onDocumentUpload) {
      onDocumentUpload(files);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading-medium text-text-primary">Document Management</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              iconName="Scan"
              className="text-xs px-3 py-1"
            >
              OCR Scan
            </Button>
            <Button
              variant="primary"
              iconName="Upload"
              onClick={() => setUploadModalOpen(true)}
              className="text-xs px-3 py-1"
            >
              Upload
            </Button>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {documentCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-smooth ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-text-secondary hover:text-text-primary hover:bg-border'
              }`}
            >
              <span>{category.label}</span>
              <span className="opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Upload Area */}
      {uploadModalOpen && (
        <div className="p-4 border-b border-border">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Icon name="Upload" size={24} className="text-text-secondary mx-auto mb-2" />
            <p className="text-text-primary text-sm mb-1">Drop files here or click to upload</p>
            <p className="text-text-secondary text-xs mb-3">Supports PDF, DOC, XLS, JPG, PNG up to 10MB</p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="text-xs px-4 py-2">
                Choose Files
              </Button>
            </label>
            <button
              onClick={() => setUploadModalOpen(false)}
              className="ml-2 text-xs text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredDocuments.length > 0 ? (
          <div className="space-y-3">
            {filteredDocuments.map(document => (
              <div
                key={document.id}
                className="bg-surface border border-border rounded-lg p-3 hover:shadow-base transition-smooth"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <Icon 
                      name={getDocumentIcon(document.type)} 
                      size={20} 
                      className="text-text-secondary" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-body-medium text-text-primary text-sm truncate">
                        {document.name}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(document.status)}`}>
                        {document.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-text-secondary mb-2">
                      <span>{formatFileSize(document.size)}</span>
                      <span>{document.uploadDate}</span>
                      <span>by {document.uploadedBy}</span>
                    </div>
                    
                    {document.description && (
                      <p className="text-xs text-text-secondary mb-2 line-clamp-2">
                        {document.description}
                      </p>
                    )}
                    
                    {/* Compliance Status */}
                    {document.compliance && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon 
                          name={document.compliance.status === 'compliant' ? 'CheckCircle' : 'AlertTriangle'} 
                          size={12} 
                          className={document.compliance.status === 'compliant' ? 'text-success' : 'text-warning'}
                        />
                        <span className="text-xs text-text-secondary">
                          {document.compliance.message}
                        </span>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          iconName="Eye"
                          onClick={() => onDocumentView && onDocumentView(document)}
                          className="text-xs px-2 py-1"
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          iconName="Download"
                          className="text-xs px-2 py-1"
                        >
                          Download
                        </Button>
                        {document.status === 'pending' && (
                          <Button
                            variant="ghost"
                            iconName="CheckCircle"
                            className="text-xs px-2 py-1 text-success"
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {document.version && (
                          <span className="text-xs text-text-secondary">
                            v{document.version}
                          </span>
                        )}
                        <button
                          onClick={() => onDocumentDelete && onDocumentDelete(document.id)}
                          className="p-1 text-text-secondary hover:text-error rounded transition-smooth"
                        >
                          <Icon name="Trash2" size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Icon name="FileText" size={24} className="text-text-secondary mb-2" />
            <p className="text-text-secondary text-sm">No documents found</p>
            <p className="text-text-secondary text-xs">Upload documents to get started</p>
          </div>
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-text-secondary">Total</p>
            <p className="font-data text-text-primary">{documents.length}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Pending</p>
            <p className="font-data text-warning">{documents.filter(d => d.status === 'pending').length}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Approved</p>
            <p className="font-data text-success">{documents.filter(d => d.status === 'approved').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;