import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ 
  notifications = [],
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  maxDisplayCount = 5,
  showMarkAllRead = true,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);

  const defaultNotifications = [
    {
      id: 1,
      type: 'approval',
      title: 'Deal Approval Required',
      message: 'Sunset Plaza acquisition needs your approval',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      unread: true,
      priority: 'high',
      actionUrl: '/deal-detail-management?id=SP-2024-001',
      metadata: { dealId: 'SP-2024-001', amount: '$2.5M' }
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Due Diligence Deadline',
      message: 'Marina Bay project due diligence expires in 2 days',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      unread: true,
      priority: 'medium',
      actionUrl: '/property-acquisition-workflow?id=MB-001',
      metadata: { propertyId: 'MB-001', daysLeft: 2 }
    },
    {
      id: 3,
      type: 'update',
      title: 'Property Status Update',
      message: 'Downtown Office Complex moved to underwriting',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unread: false,
      priority: 'low',
      actionUrl: '/underwriting-analysis-center?id=DOC-001',
      metadata: { propertyId: 'DOC-001', newStatus: 'underwriting' }
    },
    {
      id: 4,
      type: 'system',
      title: 'Weekly Report Generated',
      message: 'Your weekly performance report is ready for review',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: false,
      priority: 'low',
      actionUrl: '/financial-analytics-dashboard?report=weekly',
      metadata: { reportType: 'weekly', period: 'W52-2024' }
    },
    {
      id: 5,
      type: 'mention',
      title: 'You were mentioned',
      message: 'Sarah mentioned you in a comment on Harbor View project',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      unread: false,
      priority: 'medium',
      actionUrl: '/deal-detail-management?id=HV-2024-003#comments',
      metadata: { mentionedBy: 'Sarah Johnson', projectId: 'HV-2024-003' }
    }
  ];

  useEffect(() => {
    setLocalNotifications(notifications.length > 0 ? notifications : defaultNotifications);
  }, [notifications]);

  const unreadCount = localNotifications.filter(n => n.unread).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approval': return 'CheckCircle';
      case 'deadline': return 'Clock';
      case 'update': return 'Info';
      case 'system': return 'Settings';
      case 'mention': return 'AtSign';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    
    switch (type) {
      case 'approval': return 'text-success';
      case 'deadline': return 'text-warning';
      case 'update': return 'text-primary';
      case 'system': return 'text-text-secondary';
      case 'mention': return 'text-accent';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    return timestamp.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleNotificationClick = (notification) => {
    if (!notification.unread) {
      handleMarkAsRead(notification.id);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    setIsOpen(false);
  };

  const handleMarkAsRead = (notificationId) => {
    setLocalNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
    );
    
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const handleMarkAllAsRead = () => {
    setLocalNotifications(prev => 
      prev.map(n => ({ ...n, unread: false }))
    );
    
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const handleClearAll = () => {
    setLocalNotifications([]);
    setIsOpen(false);
    
    if (onClearAll) {
      onClearAll();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.notification-center')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`notification-center relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-smooth"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-surface border border-border rounded-lg shadow-interactive z-dropdown">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-heading-medium text-text-primary">Notifications</h3>
            <div className="flex items-center space-x-2">
              {showMarkAllRead && unreadCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={handleMarkAllAsRead}
                  className="text-xs px-2 py-1"
                >
                  Mark all read
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {localNotifications.length > 0 ? (
              localNotifications.slice(0, maxDisplayCount).map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 text-left hover:bg-background transition-smooth border-b border-border last:border-b-0 ${
                    notification.unread ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <Icon 
                        name={getNotificationIcon(notification.type)} 
                        size={16} 
                        className={getNotificationColor(notification.type, notification.priority)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-body-medium text-text-primary text-sm truncate">
                          {notification.title}
                        </h4>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        )}
                        {notification.priority === 'high' && (
                          <Icon name="AlertTriangle" size={12} className="text-error flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-text-secondary text-xs">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                        {notification.metadata && (
                          <div className="flex items-center space-x-2">
                            {notification.metadata.amount && (
                              <span className="text-xs font-data text-text-secondary">
                                {notification.metadata.amount}
                              </span>
                            )}
                            {notification.metadata.daysLeft && (
                              <span className="text-xs text-warning">
                                {notification.metadata.daysLeft} days left
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Icon name="ArrowUpRight" size={14} className="text-text-secondary mt-1 flex-shrink-0" />
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <Icon name="Bell" size={32} className="text-text-secondary mx-auto mb-3" />
                <p className="text-text-secondary text-sm">No notifications</p>
                <p className="text-text-secondary text-xs mt-1">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {localNotifications.length > maxDisplayCount && (
            <div className="p-3 border-t border-border">
              <Button variant="ghost" className="w-full text-sm">
                View All Notifications ({localNotifications.length})
              </Button>
            </div>
          )}

          {localNotifications.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button 
                variant="ghost" 
                onClick={handleClearAll}
                className="w-full text-sm text-text-secondary hover:text-error"
              >
                Clear All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;