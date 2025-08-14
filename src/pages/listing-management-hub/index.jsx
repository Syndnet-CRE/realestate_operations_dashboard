import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import PropertyCard from './components/PropertyCard';
import FilterPanel from './components/FilterPanel';
import BulkActionsBar from './components/BulkActionsBar';
import PropertyDetailModal from './components/PropertyDetailModal';
import MarketingPerformancePanel from './components/MarketingPerformancePanel';

const ListingManagementHub = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('listing-date');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showPerformancePanel, setShowPerformancePanel] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const mockProperties = [
    {
      id: 'SP-2024-001',
      title: 'Sunset Plaza Penthouse',
      address: '123 Harbor Drive, Downtown',
      price: 2500000,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 2400,
      status: 'active',
      priority: 'high',
      agent: 'Sarah Johnson',
      listingDate: '2024-01-15',
      views: 1247,
      inquiries: 23,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
      ],
      description: 'Stunning penthouse with panoramic harbor views, premium finishes, and modern amenities. Perfect for luxury living in the heart of downtown.'
    },
    {
      id: 'MB-2024-002',
      title: 'Marina Bay Office Complex',
      address: '456 Business District, Marina Bay',
      price: 3200000,
      bedrooms: 0,
      bathrooms: 8,
      sqft: 5200,
      status: 'pending',
      priority: 'medium',
      agent: 'Mike Chen',
      listingDate: '2024-01-12',
      views: 987,
      inquiries: 19,
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
      ],
      description: 'Prime commercial office space with harbor views, modern infrastructure, and excellent connectivity.'
    },
    {
      id: 'DL-2024-003',
      title: 'Downtown Loft Collection',
      address: '789 Arts District, Downtown',
      price: 850000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1800,
      status: 'active',
      priority: 'medium',
      agent: 'Lisa Rodriguez',
      listingDate: '2024-01-10',
      views: 834,
      inquiries: 15,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop'
      ],
      description: 'Modern loft-style living with exposed brick, high ceilings, and industrial charm in the vibrant arts district.'
    },
    {
      id: 'HV-2024-004',
      title: 'Harbor View Townhomes',
      address: '321 Waterfront Way, Harbor District',
      price: 1250000,
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 2800,
      status: 'sold',
      priority: 'low',
      agent: 'David Kim',
      listingDate: '2024-01-08',
      views: 756,
      inquiries: 12,
      images: [
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&h=600&fit=crop'
      ],
      description: 'Luxury townhomes with private patios, harbor views, and premium finishes throughout.'
    },
    {
      id: 'EO-2024-005',
      title: 'Executive Office Tower',
      address: '654 Corporate Plaza, Business District',
      price: 4500000,
      bedrooms: 0,
      bathrooms: 12,
      sqft: 8500,
      status: 'active',
      priority: 'high',
      agent: 'Emma Wilson',
      listingDate: '2024-01-05',
      views: 623,
      inquiries: 8,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop'
      ],
      description: 'Premium office tower with state-of-the-art facilities, panoramic city views, and executive amenities.'
    },
    {
      id: 'GH-2024-006',
      title: 'Garden Heights Residence',
      address: '987 Garden Heights, Residential District',
      price: 675000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2100,
      status: 'withdrawn',
      priority: 'low',
      agent: 'Sarah Johnson',
      listingDate: '2024-01-03',
      views: 445,
      inquiries: 6,
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
      ],
      description: 'Charming family home with landscaped gardens, updated kitchen, and quiet neighborhood setting.'
    }
  ];

  const sortOptions = [
    { value: 'listing-date', label: 'Listing Date' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'inquiries', label: 'Most Inquiries' },
    { value: 'status', label: 'Status' },
    { value: 'agent', label: 'Agent' }
  ];

  const savedFilterPresets = [
    { name: 'Active High Priority', filters: { status: 'active', priority: 'high' } },
    { name: 'Luxury Properties', filters: { priceRange: { min: '1000000', max: '' } } },
    { name: 'Commercial Listings', filters: { propertyType: 'commercial' } },
    { name: 'My Listings', filters: { agent: 'sarah-johnson' } }
  ];

  const [filteredProperties, setFilteredProperties] = useState(mockProperties);

  useEffect(() => {
    let filtered = [...mockProperties];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.agent.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply other filters
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(property => property.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(property => property.priority === filters.priority);
    }

    if (filters.agent && filters.agent !== 'all') {
      const agentMap = {
        'sarah-johnson': 'Sarah Johnson',
        'mike-chen': 'Mike Chen',
        'lisa-rodriguez': 'Lisa Rodriguez',
        'david-kim': 'David Kim',
        'emma-wilson': 'Emma Wilson'
      };
      filtered = filtered.filter(property => property.agent === agentMap[filters.agent]);
    }

    if (filters.priceRange) {
      if (filters.priceRange.min) {
        filtered = filtered.filter(property => property.price >= parseInt(filters.priceRange.min));
      }
      if (filters.priceRange.max) {
        filtered = filtered.filter(property => property.price <= parseInt(filters.priceRange.max));
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'views':
          return b.views - a.views;
        case 'inquiries':
          return b.inquiries - a.inquiries;
        case 'listing-date':
          return new Date(b.listingDate) - new Date(a.listingDate);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'agent':
          return a.agent.localeCompare(b.agent);
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [searchQuery, filters, sortBy]);

  const handlePropertySelect = (propertyId, isSelected) => {
    setSelectedProperties(prev => 
      isSelected 
        ? [...prev, propertyId]
        : prev.filter(id => id !== propertyId)
    );
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(p => p.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedProperties([]);
  };

  const handleBulkAction = (actionId, optionValue, count) => {
    console.log('Bulk action:', { actionId, optionValue, count, selectedProperties });
    // Implement bulk action logic here
    setSelectedProperties([]);
  };

  const handlePropertyEdit = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handlePropertyView = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handlePropertySave = (updatedProperty) => {
    console.log('Save property:', updatedProperty);
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  const handleStatusChange = (propertyId, currentStatus) => {
    console.log('Change status for property:', propertyId, currentStatus);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSavePreset = (name, filters) => {
    console.log('Save filter preset:', name, filters);
  };

  const handleLoadPreset = (preset) => {
    console.log('Load filter preset:', preset);
  };

  const handleExportReport = (reportData) => {
    console.log('Export marketing report:', reportData);
  };

  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'new-listing': console.log('Create new listing');
        break;
      case 'import-mls': console.log('Import from MLS');
        break;
      case 'bulk-update': console.log('Bulk update properties');
        break;
      case 'export-data':
        console.log('Export property data');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <div className="main-content-offset">
        <div className="flex">
          {/* Filter Panel */}
          <FilterPanel
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
            onFiltersChange={handleFiltersChange}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            savedPresets={savedFilterPresets}
          />

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-heading-semibold text-text-primary">
                    Listing Management Hub
                  </h1>
                  <p className="text-text-secondary mt-1">
                    Manage property listings, marketing assets, and buyer inquiries
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPerformancePanel(!showPerformancePanel)}
                    iconName="BarChart3"
                  >
                    {showPerformancePanel ? 'Hide' : 'Show'} Analytics
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleQuickAction('new-listing')}
                    iconName="Plus"
                  >
                    New Listing
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-surface border border-border rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Home" size={20} className="text-primary" />
                    <span className="font-body-medium text-text-primary">
                      {filteredProperties.length} Properties
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border"></div>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span>{filteredProperties.filter(p => p.status === 'active').length} Active</span>
                    <span>{filteredProperties.filter(p => p.status === 'pending').length} Pending</span>
                    <span>{filteredProperties.filter(p => p.status === 'sold').length} Sold</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleQuickAction('import-mls')}
                    iconName="Download"
                    className="text-sm"
                  >
                    Import MLS
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleQuickAction('bulk-update')}
                    iconName="Edit"
                    className="text-sm"
                  >
                    Bulk Update
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleQuickAction('export-data')}
                    iconName="Upload"
                    className="text-sm"
                  >
                    Export Data
                  </Button>
                </div>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="bg-surface border border-border rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Icon 
                      name="Search" 
                      size={20} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                    />
                    <Input
                      type="search"
                      placeholder="Search properties, addresses, agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Button
                    variant={showFilters ? "primary" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    iconName="Filter"
                  >
                    Filters
                    {Object.keys(filters).filter(key => 
                      filters[key] && filters[key] !== 'all' && 
                      !(typeof filters[key] === 'object' && !filters[key].min && !filters[key].max)
                    ).length > 0 && (
                      <span className="ml-2 bg-primary-foreground text-primary text-xs px-2 py-1 rounded-full">
                        {Object.keys(filters).filter(key => 
                          filters[key] && filters[key] !== 'all' && 
                          !(typeof filters[key] === 'object' && !filters[key].min && !filters[key].max)
                        ).length}
                      </span>
                    )}
                  </Button>
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        Sort by {option.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center bg-background border border-border rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-l-lg transition-colors ${
                        viewMode === 'grid' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon name="Grid3X3" size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-r-lg transition-colors ${
                        viewMode === 'list' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon name="List" size={16} />
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={handleSelectAll}
                    iconName={selectedProperties.length === filteredProperties.length ? "CheckSquare" : "Square"}
                    className="text-sm"
                  >
                    {selectedProperties.length === filteredProperties.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Marketing Performance Panel */}
            {showPerformancePanel && (
              <div className="mb-6">
                <MarketingPerformancePanel
                  selectedProperties={selectedProperties}
                  onExportReport={handleExportReport}
                  onRefreshData={handleRefreshData}
                />
              </div>
            )}

            {/* Properties Grid/List */}
            <div className={`${
              viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :'space-y-4'
            }`}>
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
                    <div className="h-48 bg-background rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-background rounded w-3/4"></div>
                      <div className="h-4 bg-background rounded w-1/2"></div>
                      <div className="h-4 bg-background rounded w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    viewMode={viewMode}
                    isSelected={selectedProperties.includes(property.id)}
                    onSelect={handlePropertySelect}
                    onEdit={handlePropertyEdit}
                    onViewDetails={handlePropertyView}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Icon name="Home" size={48} className="text-text-secondary mx-auto mb-4" />
                  <h3 className="font-heading-medium text-text-primary text-lg mb-2">
                    No properties found
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => handleQuickAction('new-listing')}
                    iconName="Plus"
                  >
                    Create New Listing
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedProperties.length}
        isVisible={selectedProperties.length > 0}
        onClearSelection={handleClearSelection}
        onBulkAction={handleBulkAction}
      />

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={showPropertyModal}
        onClose={() => {
          setShowPropertyModal(false);
          setSelectedProperty(null);
        }}
        onSave={handlePropertySave}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ListingManagementHub;