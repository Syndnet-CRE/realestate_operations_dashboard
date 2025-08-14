import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PropertyDetailModal = ({ 
  property, 
  isOpen, 
  onClose, 
  onSave, 
  onStatusChange,
  mode = 'view' // 'view' or 'edit'
}) => {
  const [editMode, setEditMode] = useState(mode === 'edit');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState(property || {});

  if (!isOpen || !property) return null;

  const tabs = [
    { id: 'details', label: 'Property Details', icon: 'Home' },
    { id: 'marketing', label: 'Marketing Assets', icon: 'Camera' },
    { id: 'inquiries', label: 'Buyer Inquiries', icon: 'MessageCircle' },
    { id: 'showings', label: 'Showings', icon: 'Calendar' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'analytics', label: 'Performance', icon: 'BarChart3' }
  ];

  const mockInquiries = [
    {
      id: 1,
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@email.com',
      phone: '(555) 123-4567',
      message: 'I\'m interested in scheduling a showing for this property. Are weekends available?',
      source: 'Website',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'new',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Robert Chen',
      email: 'robert.chen@email.com',
      phone: '(555) 987-6543',
      message: 'What is the HOA fee for this property? Also, are pets allowed?',
      source: 'Zillow',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'responded',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Sarah Thompson',
      email: 'sarah.thompson@email.com',
      phone: '(555) 456-7890',
      message: 'I would like to make an offer on this property. Please contact me ASAP.',
      source: 'Realtor.com',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'follow-up',
      priority: 'high'
    }
  ];

  const mockShowings = [
    {
      id: 1,
      date: '2024-01-20',
      time: '2:00 PM',
      client: 'Jennifer Martinez',
      agent: 'Sarah Johnson',
      status: 'scheduled',
      type: 'private'
    },
    {
      id: 2,
      date: '2024-01-21',
      time: '10:00 AM',
      client: 'Open House',
      agent: 'Sarah Johnson',
      status: 'scheduled',
      type: 'open-house'
    },
    {
      id: 3,
      date: '2024-01-18',
      time: '4:00 PM',
      client: 'Robert Chen',
      agent: 'Sarah Johnson',
      status: 'completed',
      type: 'private'
    }
  ];

  const mockDocuments = [
    {
      id: 1,
      name: 'Listing Agreement',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      category: 'legal'
    },
    {
      id: 2,
      name: 'Property Disclosure',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-15',
      category: 'legal'
    },
    {
      id: 3,
      name: 'Marketing Flyer',
      type: 'PDF',
      size: '5.2 MB',
      uploadDate: '2024-01-16',
      category: 'marketing'
    },
    {
      id: 4,
      name: 'Virtual Tour Link',
      type: 'URL',
      size: '-',
      uploadDate: '2024-01-17',
      category: 'marketing'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return formatDate(timestamp);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-success text-success-foreground';
      case 'responded': return 'bg-primary text-primary-foreground';
      case 'follow-up': return 'bg-warning text-warning-foreground';
      case 'scheduled': return 'bg-accent text-accent-foreground';
      case 'completed': return 'bg-text-secondary text-surface';
      default: return 'bg-text-secondary text-surface';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(property);
    setEditMode(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h4 className="font-heading-medium text-text-primary mb-4">Basic Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Property Title
            </label>
            {editMode ? (
              <Input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            ) : (
              <p className="text-text-primary">{property.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Price
            </label>
            {editMode ? (
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            ) : (
              <p className="text-text-primary font-data text-lg">{formatPrice(property.price)}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Address
            </label>
            {editMode ? (
              <Input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            ) : (
              <p className="text-text-primary">{property.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Property Features */}
      <div>
        <h4 className="font-heading-medium text-text-primary mb-4">Property Features</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Bedrooms
            </label>
            {editMode ? (
              <Input
                type="number"
                value={formData.bedrooms || ''}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              />
            ) : (
              <p className="text-text-primary">{property.bedrooms}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Bathrooms
            </label>
            {editMode ? (
              <Input
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              />
            ) : (
              <p className="text-text-primary">{property.bathrooms}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Square Feet
            </label>
            {editMode ? (
              <Input
                type="number"
                value={formData.sqft || ''}
                onChange={(e) => handleInputChange('sqft', e.target.value)}
              />
            ) : (
              <p className="text-text-primary">{property.sqft?.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-heading-medium text-text-primary mb-4">Description</h4>
        {editMode ? (
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        ) : (
          <p className="text-text-primary">{property.description}</p>
        )}
      </div>
    </div>
  );

  const renderMarketingTab = () => (
    <div className="space-y-6">
      {/* Photo Gallery */}
      <div>
        <h4 className="font-heading-medium text-text-primary mb-4">Photo Gallery</h4>
        <div className="grid grid-cols-4 gap-4">
          {property.images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-background rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-2">
                  <Button variant="ghost" iconName="Eye" className="text-white" />
                  <Button variant="ghost" iconName="Edit" className="text-white" />
                  <Button variant="ghost" iconName="Trash2" className="text-white" />
                </div>
              </div>
            </div>
          ))}
          <div className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <div className="text-center">
              <Icon name="Plus" size={24} className="text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary text-sm">Add Photo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Copy */}
      <div>
        <h4 className="font-heading-medium text-text-primary mb-4">Marketing Copy</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Headline
            </label>
            <Input
              type="text"
              value="Stunning Modern Home with Harbor Views"
              placeholder="Enter marketing headline..."
            />
          </div>
          <div>
            <label className="block text-sm font-body-medium text-text-primary mb-2">
              Marketing Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              placeholder="Enter marketing description..."
              defaultValue="Experience luxury living in this beautifully designed modern home featuring panoramic harbor views, premium finishes, and an open-concept layout perfect for entertaining."
            />
          </div>
        </div>
      </div>

      {/* Virtual Tour */}
      <div>
        <h4 className="font-heading-medium text-text-primary mb-4">Virtual Tour</h4>
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Play" size={20} className="text-primary" />
              <div>
                <p className="font-body-medium text-text-primary">Virtual Tour Available</p>
                <p className="text-text-secondary text-sm">3D Walkthrough • 360° Views</p>
              </div>
            </div>
            <Button variant="outline" iconName="ExternalLink">
              View Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInquiriesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-heading-medium text-text-primary">Buyer Inquiries</h4>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">{mockInquiries.length} total inquiries</span>
          <Button variant="primary" iconName="Plus" className="text-sm">
            Add Inquiry
          </Button>
        </div>
      </div>

      {mockInquiries.map((inquiry) => (
        <div key={inquiry.id} className="bg-background rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-body-medium">
                {inquiry.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h5 className="font-body-medium text-text-primary">{inquiry.name}</h5>
                <p className="text-text-secondary text-sm">{inquiry.email}</p>
                <p className="text-text-secondary text-sm">{inquiry.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`deal-status-indicator ${getStatusColor(inquiry.status)} text-xs`}>
                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
              </span>
              <Icon 
                name="AlertTriangle" 
                size={14} 
                className={getPriorityColor(inquiry.priority)} 
              />
            </div>
          </div>

          <p className="text-text-primary mb-3">{inquiry.message}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <span>Source: {inquiry.source}</span>
              <span>{formatTime(inquiry.timestamp)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" iconName="Phone" className="text-xs">
                Call
              </Button>
              <Button variant="ghost" iconName="Mail" className="text-xs">
                Email
              </Button>
              <Button variant="outline" iconName="Calendar" className="text-xs">
                Schedule
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderShowingsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-heading-medium text-text-primary">Showings</h4>
        <Button variant="primary" iconName="Plus" className="text-sm">
          Schedule Showing
        </Button>
      </div>

      {mockShowings.map((showing) => (
        <div key={showing.id} className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="font-data text-lg text-text-primary">{new Date(showing.date).getDate()}</p>
                <p className="text-text-secondary text-xs">
                  {new Date(showing.date).toLocaleDateString('en-US', { month: 'short' })}
                </p>
              </div>
              <div>
                <h5 className="font-body-medium text-text-primary">{showing.client}</h5>
                <p className="text-text-secondary text-sm">{showing.time} • {showing.agent}</p>
                <p className="text-text-secondary text-sm capitalize">{showing.type.replace('-', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`deal-status-indicator ${getStatusColor(showing.status)} text-xs`}>
                {showing.status.charAt(0).toUpperCase() + showing.status.slice(1)}
              </span>
              <Button variant="ghost" iconName="MoreHorizontal" className="text-xs" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-heading-medium text-text-primary">Documents</h4>
        <Button variant="primary" iconName="Upload" className="text-sm">
          Upload Document
        </Button>
      </div>

      {mockDocuments.map((doc) => (
        <div key={doc.id} className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-primary" />
              </div>
              <div>
                <h5 className="font-body-medium text-text-primary">{doc.name}</h5>
                <p className="text-text-secondary text-sm">
                  {doc.type} • {doc.size} • Uploaded {formatDate(doc.uploadDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" iconName="Download" className="text-xs" />
              <Button variant="ghost" iconName="Eye" className="text-xs" />
              <Button variant="ghost" iconName="MoreHorizontal" className="text-xs" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h4 className="font-heading-medium text-text-primary">Performance Analytics</h4>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-4 text-center">
          <p className="text-2xl font-data text-primary">{property.views}</p>
          <p className="text-text-secondary text-sm">Total Views</p>
        </div>
        <div className="bg-background rounded-lg p-4 text-center">
          <p className="text-2xl font-data text-success">{property.inquiries}</p>
          <p className="text-text-secondary text-sm">Inquiries</p>
        </div>
        <div className="bg-background rounded-lg p-4 text-center">
          <p className="text-2xl font-data text-warning">12</p>
          <p className="text-text-secondary text-sm">Showings</p>
        </div>
        <div className="bg-background rounded-lg p-4 text-center">
          <p className="text-2xl font-data text-accent">3.2%</p>
          <p className="text-text-secondary text-sm">Conversion Rate</p>
        </div>
      </div>

      <div className="bg-background rounded-lg p-4">
        <h5 className="font-body-medium text-text-primary mb-4">View Trends</h5>
        <div className="h-32 bg-surface rounded flex items-center justify-center">
          <p className="text-text-secondary">Chart visualization would go here</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
      <div className="bg-surface border border-border rounded-lg w-full max-w-6xl h-full max-h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <h2 className="font-heading-semibold text-text-primary text-xl">
              {property.title}
            </h2>
            <span className={`deal-status-indicator ${getStatusColor(property.status)}`}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {editMode ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setEditMode(true)} iconName="Edit">
                Edit Property
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-lg transition-smooth"
            >
              <Icon name="X" size={20} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Image Gallery */}
          <div className="w-1/2 p-6 border-r border-border">
            <div className="relative h-full bg-background rounded-lg overflow-hidden">
              <Image
                src={property.images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <Icon name="ChevronLeft" size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <Icon name="ChevronRight" size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-1/2 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-body-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'details' && renderDetailsTab()}
              {activeTab === 'marketing' && renderMarketingTab()}
              {activeTab === 'inquiries' && renderInquiriesTab()}
              {activeTab === 'showings' && renderShowingsTab()}
              {activeTab === 'documents' && renderDocumentsTab()}
              {activeTab === 'analytics' && renderAnalyticsTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal;