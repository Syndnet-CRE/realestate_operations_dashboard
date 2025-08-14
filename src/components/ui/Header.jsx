import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'approval',
      title: 'Deal Approval Required',
      message: 'Sunset Plaza acquisition needs your approval',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Due Diligence Deadline',
      message: 'Marina Bay project due diligence expires in 2 days',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'update',
      title: 'Property Status Update',
      message: 'Downtown Office Complex moved to underwriting',
      time: '3 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    setShowNotifications(false);
  };

  const handleUserMenuClick = (action) => {
    console.log('User menu action:', action);
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 right-0 left-60 h-16 bg-surface border-b border-border z-navigation">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Interface */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
              <input
                type="text"
                placeholder="Search properties, deals, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-smooth"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-lg shadow-interactive z-dropdown">
                <div className="p-4 border-b border-border">
                  <h3 className="font-heading-medium text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 text-left hover:bg-background transition-smooth border-b border-border last:border-b-0 ${
                        notification.unread ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-body-medium text-text-primary text-sm">
                              {notification.title}
                            </h4>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-text-secondary text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-text-secondary text-xs mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" className="w-full text-sm">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Context Panel */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-background rounded-lg transition-smooth"
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading-medium text-sm">
                JD
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-body-medium text-text-primary text-sm">John Doe</p>
                <p className="text-text-secondary text-xs">Senior Analyst</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-text-secondary" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-lg shadow-interactive z-dropdown">
                <div className="p-3 border-b border-border">
                  <p className="font-body-medium text-text-primary">John Doe</p>
                  <p className="text-text-secondary text-sm">Senior Analyst</p>
                  <p className="text-text-secondary text-xs mt-1">john.doe@realestate.com</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => handleUserMenuClick('profile')}
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-background transition-smooth flex items-center space-x-2"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => handleUserMenuClick('preferences')}
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-background transition-smooth flex items-center space-x-2"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <button
                    onClick={() => handleUserMenuClick('help')}
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-background transition-smooth flex items-center space-x-2"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                </div>
                <div className="py-2 border-t border-border">
                  <button
                    onClick={() => handleUserMenuClick('logout')}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 transition-smooth flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;