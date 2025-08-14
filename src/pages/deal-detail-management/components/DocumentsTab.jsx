import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DocumentsTab = ({ dealId, onDocumentAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const documentCategories = [
    { id: 'all', label: 'All Documents', count: 24 },
    { id: 'contracts', label: 'Contracts', count: 6 },
    { id: 'financial', label: 'Financial', count: 8 },
    { id: 'legal', label: 'Legal', count: 4 },
    { id: 'inspection', label: 'Inspection', count: 3 },
    { id: 'insurance', label: 'Insurance', count: 2 },
    { id: 'other', label: 'Other', count: 1 }
  ];

  const documents = [
    {
      id: 1,
      name: 'Purchase Agreement - Sunset Plaza.pdf',
      category: 'contracts',
      size: '2.4 MB',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-15T10:30:00Z',
      status: 'approved',
      version: '1.2',
      requiresSignature: true,
      signed: false,
      type: 'pdf'
    },
    {
      id: 2,
      name: 'Financial Analysis Report.xlsx',
      category: 'financial',
      size: '1.8 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-14T15:45:00Z',
      status: 'pending_review',
      version: '2.0',
      requiresSignature: false,
      signed: false,
      type: 'excel'
    },
    {
      id: 3,
      name: 'Property Inspection Report.pdf',
      category: 'inspection',
      size: '5.2 MB',
      uploadedBy: 'Mike Wilson',
      uploadedAt: '2024-01-13T09:15:00Z',
      status: 'approved',
      version: '1.0',
      requiresSignature: false,
      signed: false,
      type: 'pdf'
    },
    {
      id: 4,
      name: 'Title Insurance Policy.pdf',
      category: 'insurance',
      size: '3.1 MB',
      uploadedBy: 'Lisa Chen',
      uploadedAt: '2024-01-12T14:20:00Z',
      status: 'approved',
      version: '1.0',
      requiresSignature: true,
      signed: true,
      type: 'pdf'
    },
    {
      id: 5,
      name: 'Loan Pre-approval Letter.pdf',
      category: 'financial',
      size: '0.8 MB',
      uploadedBy: 'David Brown',
      uploadedAt: '2024-01-11T11:30:00Z',
      status: 'approved',
      version: '1.0',
      requiresSignature: false,
      signed: false,
      type: 'pdf'
    },
    {
      id: 6,
      name: 'Property Photos.zip',
      category: 'other',
      size: '15.6 MB',
      uploadedBy: 'Emma Davis',
      uploadedAt: '2024-01-10T16:45:00Z',
      status: 'approved',
      version: '1.0',
      requiresSignature: false,
      signed: false,
      type: 'archive'
    }
  ];

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'pdf': return 'FileText';
      case 'excel': return 'FileSpreadsheet';
      case 'word': return 'FileText';
      case 'image': return 'Image';
      case 'archive': return 'Archive';
      default: return 'File';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-success/10 text-success';
      case 'pending_review': return 'bg-warning/10 text-warning';
      case 'rejected': return 'bg-error/10 text-error';
      case 'draft': return 'bg-text-secondary/10 text-text-secondary';
      default: return 'bg-text-secondary/10 text-text-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDocumentSelect = (docId) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on documents:`, selectedDocuments);
    setSelectedDocuments([]);
  };

  const handleDocumentAction = (action, docId) => {
    console.log(`Document action: ${action} on document:`, docId);
    if (onDocumentAction) {
      onDocumentAction(action, docId);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    console.log('Uploading files:', files);
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading-semibold text-text-primary text-lg">Documents</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" iconName="Download">
            Bulk Download
          </Button>
          <Button variant="primary" onClick={() => setShowUploadModal(true)} iconName="Upload">
            Upload Documents
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <Input
              type="search"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {selectedDocuments.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {selectedDocuments.length} selected
              </span>
              <Button variant="ghost" onClick={() => handleBulkAction('approve')} className="text-sm">
                Approve
              </Button>
              <Button variant="ghost" onClick={() => handleBulkAction('delete')} className="text-sm text-error">
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-lg p-4">
            <h4 className="font-body-medium text-text-primary mb-4">Categories</h4>
            <div className="space-y-1">
              {documentCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-smooth ${
                    selectedCategory === category.id
                      ? 'bg-primary/10 text-primary' :'text-text-secondary hover:text-text-primary hover:bg-background'
                  }`}
                >
                  <span>{category.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-primary/20 text-primary' :'bg-background text-text-secondary'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-3">
          <div className="bg-surface border border-border rounded-lg">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
                    } else {
                      setSelectedDocuments([]);
                    }
                  }}
                  className="rounded border-border"
                />
                <div className="grid grid-cols-12 gap-4 w-full text-sm font-body-medium text-text-secondary">
                  <div className="col-span-5">Document Name</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Modified</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="divide-y divide-border">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="px-6 py-4 hover:bg-background transition-smooth">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(document.id)}
                      onChange={() => handleDocumentSelect(document.id)}
                      className="rounded border-border"
                    />
                    <div className="grid grid-cols-12 gap-4 w-full items-center">
                      {/* Document Name */}
                      <div className="col-span-5 flex items-center space-x-3">
                        <Icon 
                          name={getDocumentIcon(document.type)} 
                          size={20} 
                          className="text-text-secondary" 
                        />
                        <div className="min-w-0">
                          <p className="font-body-medium text-text-primary truncate">
                            {document.name}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-text-secondary">
                            <span>{document.size}</span>
                            <span>•</span>
                            <span>v{document.version}</span>
                            {document.requiresSignature && (
                              <>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Icon 
                                    name={document.signed ? "CheckCircle" : "Clock"} 
                                    size={12} 
                                    className={document.signed ? "text-success" : "text-warning"} 
                                  />
                                  <span>{document.signed ? "Signed" : "Pending Signature"}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-span-2">
                        <span className="text-sm text-text-secondary capitalize">
                          {document.category.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                          {document.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>

                      {/* Modified */}
                      <div className="col-span-2">
                        <div className="text-sm">
                          <p className="text-text-primary">{formatDate(document.uploadedAt)}</p>
                          <p className="text-text-secondary text-xs">by {document.uploadedBy}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleDocumentAction('view', document.id)}
                            className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
                            title="View Document"
                          >
                            <Icon name="Eye" size={16} />
                          </button>
                          <button
                            onClick={() => handleDocumentAction('download', document.id)}
                            className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
                            title="Download"
                          >
                            <Icon name="Download" size={16} />
                          </button>
                          <button
                            onClick={() => handleDocumentAction('share', document.id)}
                            className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
                            title="Share"
                          >
                            <Icon name="Share2" size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">No documents found</p>
                <p className="text-text-secondary text-sm mt-1">
                  {searchQuery ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-modal">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading-medium text-text-primary">Upload Documents</h4>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm">
                  <option value="contracts">Contracts</option>
                  <option value="financial">Financial</option>
                  <option value="legal">Legal</option>
                  <option value="inspection">Inspection</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Files
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Icon name="Upload" size={32} className="text-text-secondary mx-auto mb-2" />
                  <p className="text-text-secondary text-sm mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="text-sm">
                    Choose Files
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button variant="ghost" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;