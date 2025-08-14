import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';


const GlobalSearchInterface = ({ 
  onSearch,
  onResultSelect,
  placeholder = "Search properties, deals, documents...",
  showAdvancedFilters = true,
  recentSearches = [],
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  const searchFilters = [
    { id: 'all', label: 'All', icon: 'Search' },
    { id: 'deals', label: 'Deals', icon: 'FileText' },
    { id: 'properties', label: 'Properties', icon: 'Building' },
    { id: 'documents', label: 'Documents', icon: 'File' },
    { id: 'contacts', label: 'Contacts', icon: 'Users' }
  ];

  const mockResults = [
    {
      id: 1,
      type: 'deal',
      title: 'Sunset Plaza Acquisition',
      subtitle: 'Deal #SP-2024-001 • Active',
      description: 'Mixed-use development in downtown area',
      status: 'active',
      path: '/deal-detail-management?id=SP-2024-001'
    },
    {
      id: 2,
      type: 'property',
      title: 'Marina Bay Office Complex',
      subtitle: '123 Harbor Drive • $2.5M',
      description: 'Class A office building with harbor views',
      status: 'available',
      path: '/listing-management-hub?id=MB-001'
    },
    {
      id: 3,
      type: 'document',
      title: 'Financial Analysis Report Q4',
      subtitle: 'PDF • 2.3MB • Updated 2 days ago',
      description: 'Comprehensive market analysis and projections',
      status: 'recent',
      path: '/financial-analytics-dashboard?doc=FA-Q4-2024'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        searchRef.current?.querySelector('input')?.focus();
        setIsOpen(true);
      }
      
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowFilters(false);
        searchRef.current?.querySelector('input')?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      const timer = setTimeout(() => {
        const filteredResults = mockResults.filter(result => {
          const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                              result.description.toLowerCase().includes(query.toLowerCase());
          const matchesFilter = activeFilter === 'all' || result.type === activeFilter.slice(0, -1);
          return matchesQuery && matchesFilter;
        });
        setResults(filteredResults);
        setLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, activeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query, activeFilter);
    }
  };

  const handleResultClick = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    setIsOpen(true);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'deal': return 'FileText';
      case 'property': return 'Building';
      case 'document': return 'File';
      case 'contact': return 'User';
      default: return 'Search';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'pending': return 'text-warning';
      case 'available': return 'text-primary';
      case 'recent': return 'text-accent';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
          />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full pl-10 pr-12 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {showAdvancedFilters && (
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1 rounded transition-smooth ${
                  showFilters ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name="Filter" size={16} />
              </button>
            )}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="text-text-secondary hover:text-text-primary"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-interactive z-dropdown p-3">
            <div className="flex flex-wrap gap-2">
              {searchFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-smooth ${
                    activeFilter === filter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-text-secondary hover:text-text-primary hover:bg-border'
                  }`}
                >
                  <Icon name={filter.icon} size={14} />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-interactive z-dropdown max-h-96 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center">
              <Icon name="Loader2" size={20} className="animate-spin text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary text-sm">Searching...</p>
            </div>
          ) : query.length > 2 && results.length > 0 ? (
            <div>
              <div className="p-3 border-b border-border">
                <p className="text-text-secondary text-sm">
                  {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-4 text-left hover:bg-background transition-smooth border-b border-border last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <Icon 
                        name={getResultIcon(result.type)} 
                        size={16} 
                        className="text-text-secondary" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-body-medium text-text-primary text-sm truncate">
                        {result.title}
                      </h4>
                      <p className={`text-xs mt-1 ${getStatusColor(result.status)}`}>
                        {result.subtitle}
                      </p>
                      <p className="text-text-secondary text-xs mt-1 line-clamp-2">
                        {result.description}
                      </p>
                    </div>
                    <Icon name="ArrowUpRight" size={14} className="text-text-secondary mt-1" />
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 2 ? (
            <div className="p-4 text-center">
              <Icon name="Search" size={24} className="text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary text-sm">No results found for "{query}"</p>
              <p className="text-text-secondary text-xs mt-1">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-body-medium text-text-primary text-sm mb-2">Recent Searches</h4>
                  <div className="space-y-1">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="w-full text-left px-2 py-1 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded transition-smooth flex items-center space-x-2"
                      >
                        <Icon name="Clock" size={14} />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-center">
                <p className="text-text-secondary text-sm">Start typing to search...</p>
                <p className="text-text-secondary text-xs mt-1">
                  Press <kbd className="px-1 py-0.5 bg-background border border-border rounded text-xs">Ctrl+K</kbd> to focus
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchInterface;