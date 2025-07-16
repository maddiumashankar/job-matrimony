import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationBadge = ({ 
  notifications = [], 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onNotificationClick,
  maxDisplayCount = 5,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayNotifications = notifications.slice(0, maxDisplayCount);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationItemClick = (notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
        return 'FileText';
      case 'interview':
        return 'Calendar';
      case 'test':
        return 'Code';
      case 'message':
        return 'MessageSquare';
      case 'system':
        return 'Settings';
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type, isRead) => {
    if (isRead) return 'text-text-tertiary';
    
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'interview':
        return 'text-secondary';
      case 'test':
        return 'text-accent';
      default:
        return 'text-primary';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const getDropdownPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'left-0 mt-2';
      case 'bottom-right':
        return 'right-0 mt-2';
      case 'top-left':
        return 'left-0 bottom-full mb-2';
      case 'top-right':
        return 'right-0 bottom-full mb-2';
      default:
        return 'right-0 mt-2';
    }
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        onClick={handleToggle}
        className="relative p-2 hover:bg-surface-hover"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute ${getDropdownPositionClasses()} w-80 sm:w-96 bg-surface rounded-lg shadow-elevation-4 border border-border z-popover animate-fade-in`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-light">
            <h3 className="text-sm font-semibold text-text-primary">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs text-text-secondary">
                  ({unreadCount} unread)
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                onClick={handleMarkAllAsRead}
                className="text-xs px-2 py-1 text-primary hover:text-primary-600"
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {displayNotifications.length > 0 ? (
              displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationItemClick(notification)}
                  className={`
                    p-4 border-b border-border-light cursor-pointer transition-colors duration-200
                    hover:bg-surface-hover
                    ${!notification.read ? 'bg-primary-50 border-l-4 border-l-primary' : ''}
                  `}
                >
                  <div className="flex items-start space-x-3">
                    {/* Notification Icon */}
                    <div className={`flex-shrink-0 mt-0.5 ${getNotificationColor(notification.type, notification.read)}`}>
                      <Icon name={getNotificationIcon(notification.type)} size={16} />
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-text-secondary' : 'text-text-primary'
                          }`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm mt-1 ${
                            notification.read ? 'text-text-tertiary' : 'text-text-secondary'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-text-tertiary mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        
                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Icon name="Bell" size={32} className="mx-auto text-text-tertiary mb-3" />
                <p className="text-sm text-text-secondary">No notifications yet</p>
                <p className="text-xs text-text-tertiary mt-1">
                  You'll see updates about your applications and interviews here
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > maxDisplayCount && (
            <div className="p-3 border-t border-border-light">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary hover:text-primary-600"
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to full notifications page
                }}
              >
                View all {notifications.length} notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;