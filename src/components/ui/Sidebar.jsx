import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    {
      section: 'Deal Pipeline',
      items: [
        {
          label: 'Pipeline Dashboard',
          path: '/deal-pipeline-dashboard',
          icon: 'BarChart3',
          tooltip: 'Comprehensive deal visibility and workflow management'
        }
      ]
    },
    {
      section: 'Deal Management',
      items: [
        {
          label: 'Deal Details',
          path: '/deal-detail-management',
          icon: 'FileText',
          tooltip: 'Individual deal workspace and transaction coordination'
        }
      ]
    },
    {
      section: 'Financial Analysis',
      items: [
        {
          label: 'Underwriting Center',
          path: '/underwriting-analysis-center',
          icon: 'Calculator',
          tooltip: 'Comprehensive financial modeling and compliance verification'
        },
        {
          label: 'Analytics Dashboard',
          path: '/financial-analytics-dashboard',
          icon: 'TrendingUp',
          tooltip: 'Performance metrics and data-driven insights'
        }
      ]
    },
    {
      section: 'Property Operations',
      items: [
        {
          label: 'Acquisition Workflow',
          path: '/property-acquisition-workflow',
          icon: 'Building',
          tooltip: 'Property acquisition processes and due diligence'
        },
        {
          label: 'Listing Management',
          path: '/listing-management-hub',
          icon: 'Home',
          tooltip: 'Property listings and marketing coordination'
        }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const getDealStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'review':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-text-secondary text-surface';
    }
  };

  const activeDealCount = 12;
  const pendingApprovals = 3;

  return (
    <aside className={`sidebar-fixed transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      <div className="flex flex-col h-full">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Building2" size={20} color="white" />
              </div>
              <div>
                <h1 className="font-heading-semibold text-text-primary text-lg">RealEstate</h1>
                <p className="text-text-secondary text-xs">Operations Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-background rounded transition-smooth"
          >
            <Icon 
              name={collapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
              className="text-text-secondary" 
            />
          </button>
        </div>

        {/* Deal Status Indicators */}
        {!collapsed && (
          <div className="p-4 border-b border-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Active Deals</span>
                <span className="deal-status-indicator bg-success text-success-foreground animate-pulse-subtle">
                  {activeDealCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Pending Approvals</span>
                <span className="deal-status-indicator bg-warning text-warning-foreground">
                  {pendingApprovals}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!collapsed && (
                <h3 className="px-4 mb-2 text-xs font-heading-medium text-text-secondary uppercase tracking-wider">
                  {section.section}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = isActiveRoute(item.path);
                  return (
                    <li key={itemIndex}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className={`navigation-item w-full group relative ${
                          isActive ? 'navigation-item-active' : ''
                        }`}
                        title={collapsed ? item.tooltip : ''}
                      >
                        <Icon 
                          name={item.icon} 
                          size={20} 
                          className={`${collapsed ? 'mx-auto' : 'mr-3'} ${
                            isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'
                          }`}
                        />
                        {!collapsed && (
                          <span className="flex-1 text-left">{item.label}</span>
                        )}
                        
                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-text-primary text-surface text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-dropdown">
                            {item.label}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Quick Actions */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-smooth">
                <Icon name="Plus" size={16} />
                <span>New Deal</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-smooth">
                <Icon name="Upload" size={16} />
                <span>Import Data</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-smooth">
                <Icon name="Download" size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;