import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AuthenticatedHeader = ({ user, onLogout, notifications = [] }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Debug logging
  console.log('AuthenticatedHeader received user:', user);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    onLogout();
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'recruiter':
        return 'Recruiter';
      case 'candidate':
        return 'Candidate';
      case 'admin':
        return 'Administrator';
      default:
        return 'User';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-fixed">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Icon name="Briefcase" size={20} color="white" />
                </div>
                <span className="text-xl font-heading font-semibold text-text-primary">
                  Job Matrimony
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                onClick={handleNotificationClick}
                className="relative p-2"
                aria-label="Notifications"
              >
                <Icon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface rounded-lg shadow-elevation-3 border border-border z-dropdown">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-medium text-text-primary">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification, index) => (
                        <div
                          key={index}
                          className={`p-4 border-b border-border-light hover:bg-surface-hover transition-colors ${
                            !notification.read ? 'bg-primary-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              !notification.read ? 'bg-primary' : 'bg-border'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary">
                                {notification.title}
                              </p>
                              <p className="text-sm text-text-secondary mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-text-tertiary mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Icon name="Bell" size={32} className="mx-auto text-text-tertiary mb-2" />
                        <p className="text-sm text-text-secondary">No notifications</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <div className="p-3 border-t border-border">
                      <Button variant="ghost" className="w-full text-sm">
                        View all notifications
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <Button
                variant="ghost"
                onClick={handleProfileClick}
                className="flex items-center space-x-2 p-2"
              >
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-text-primary">{user?.name || 'User'}</p>
                  <p className="text-xs text-text-secondary">{getRoleDisplayName(user?.role)}</p>
                </div>
                <Icon name="ChevronDown" size={16} />
              </Button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-elevation-3 border border-border z-dropdown">
                  <div className="p-4 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">{user?.name || 'User'}</p>
                    <p className="text-xs text-text-secondary">{user?.email}</p>
                    <p className="text-xs text-text-tertiary mt-1">{getRoleDisplayName(user?.role)}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors flex items-center space-x-2">
                      <Icon name="User" size={16} />
                      <span>Profile Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors flex items-center space-x-2">
                      <Icon name="Settings" size={16} />
                      <span>Account Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors flex items-center space-x-2">
                      <Icon name="HelpCircle" size={16} />
                      <span>Help & Support</span>
                    </button>
                  </div>
                  <div className="border-t border-border py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error-50 transition-colors flex items-center space-x-2"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={handleMobileMenuToggle}
              className="p-2"
              aria-label="Open menu"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Info */}
              <div className="px-3 py-2 border-b border-border-light">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{user?.name || 'User'}</p>
                    <p className="text-xs text-text-secondary">{getRoleDisplayName(user?.role)}</p>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <button
                onClick={handleNotificationClick}
                className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Bell" size={16} />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Links */}
              <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors flex items-center space-x-2">
                <Icon name="User" size={16} />
                <span>Profile Settings</span>
              </button>
              <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors flex items-center space-x-2">
                <Icon name="Settings" size={16} />
                <span>Account Settings</span>
              </button>
              <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors flex items-center space-x-2">
                <Icon name="HelpCircle" size={16} />
                <span>Help & Support</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-left text-sm text-error hover:bg-error-50 transition-colors flex items-center space-x-2"
              >
                <Icon name="LogOut" size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AuthenticatedHeader;