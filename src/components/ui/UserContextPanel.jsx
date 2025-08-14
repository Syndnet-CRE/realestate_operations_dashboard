import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';


const UserContextPanel = ({ 
  user = {
    name: 'John Doe',
    role: 'Senior Analyst',
    email: 'john.doe@realestate.com',
    avatar: null,
    permissions: ['view_deals', 'edit_deals', 'approve_deals'],
    lastLogin: '2024-01-15T10:30:00Z'
  },
  onRoleSwitch,
  onProfileUpdate,
  onLogout,
  showRoleSwitcher = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(user.role);

  const availableRoles = [
    { id: 'analyst', name: 'Senior Analyst', permissions: ['view_deals', 'edit_deals'] },
    { id: 'underwriter', name: 'Underwriter', permissions: ['view_deals', 'edit_deals', 'underwrite'] },
    { id: 'manager', name: 'Deal Manager', permissions: ['view_deals', 'edit_deals', 'approve_deals'] },
    { id: 'executive', name: 'Executive', permissions: ['view_all', 'edit_all', 'approve_all'] }
  ];

  const quickActions = [
    { id: 'new_deal', label: 'New Deal', icon: 'Plus', shortcut: 'Ctrl+N' },
    { id: 'search', label: 'Global Search', icon: 'Search', shortcut: 'Ctrl+K' },
    { id: 'reports', label: 'Generate Report', icon: 'FileText', shortcut: 'Ctrl+R' },
    { id: 'calendar', label: 'Calendar View', icon: 'Calendar', shortcut: 'Ctrl+D' }
  ];

  const recentActivities = [
    { id: 1, action: 'Approved deal', target: 'Sunset Plaza', time: '5 min ago' },
    { id: 2, action: 'Updated underwriting', target: 'Marina Bay', time: '1 hour ago' },
    { id: 3, action: 'Created report', target: 'Q4 Analytics', time: '2 hours ago' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.user-context-panel')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole.name);
    if (onRoleSwitch) {
      onRoleSwitch(newRole);
    }
    setIsOpen(false);
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
    setIsOpen(false);
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case 'profile':
        if (onProfileUpdate) onProfileUpdate();
        break;
      case 'logout':
        if (onLogout) onLogout();
        break;
      default:
        console.log('Menu action:', action);
    }
    setIsOpen(false);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastLogin = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="user-context-panel relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 hover:bg-background rounded-lg transition-smooth"
      >
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading-medium text-sm">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="font-body-medium text-text-primary text-sm">{user.name}</p>
          <p className="text-text-secondary text-xs">{currentRole}</p>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-text-secondary" 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-lg shadow-interactive z-dropdown">
          {/* User Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading-medium">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-body-medium text-text-primary">{user.name}</h3>
                <p className="text-text-secondary text-sm">{currentRole}</p>
                <p className="text-text-secondary text-xs">{user.email}</p>
                <p className="text-text-secondary text-xs mt-1">
                  Last login: {formatLastLogin(user.lastLogin)}
                </p>
              </div>
            </div>
          </div>

          {/* Role Switcher */}
          {showRoleSwitcher && (
            <div className="p-4 border-b border-border">
              <h4 className="font-body-medium text-text-primary text-sm mb-2">Switch Role</h4>
              <div className="space-y-1">
                {availableRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-smooth ${
                      role.name === currentRole 
                        ? 'bg-primary/10 text-primary' :'text-text-primary hover:bg-background'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{role.name}</span>
                      {role.name === currentRole && (
                        <Icon name="Check" size={14} className="text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-b border-border">
            <h4 className="font-body-medium text-text-primary text-sm mb-2">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center space-x-2 p-2 text-sm text-text-primary hover:bg-background rounded-lg transition-smooth"
                  title={action.shortcut}
                >
                  <Icon name={action.icon} size={16} />
                  <span className="text-xs">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="p-4 border-b border-border">
            <h4 className="font-body-medium text-text-primary text-sm mb-2">Recent Activity</h4>
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="text-xs">
                  <p className="text-text-primary">
                    <span className="font-body-medium">{activity.action}</span> {activity.target}
                  </p>
                  <p className="text-text-secondary">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Actions */}
          <div className="py-2">
            <button
              onClick={() => handleMenuAction('profile')}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-background transition-smooth flex items-center space-x-2"
            >
              <Icon name="User" size={16} />
              <span>Profile Settings</span>
            </button>
            <button
              onClick={() => handleMenuAction('preferences')}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-background transition-smooth flex items-center space-x-2"
            >
              <Icon name="Settings" size={16} />
              <span>Preferences</span>
            </button>
            <button
              onClick={() => handleMenuAction('help')}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-background transition-smooth flex items-center space-x-2"
            >
              <Icon name="HelpCircle" size={16} />
              <span>Help & Support</span>
            </button>
          </div>

          <div className="py-2 border-t border-border">
            <button
              onClick={() => handleMenuAction('logout')}
              className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 transition-smooth flex items-center space-x-2"
            >
              <Icon name="LogOut" size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContextPanel;