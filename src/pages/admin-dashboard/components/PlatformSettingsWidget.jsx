import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlatformSettingsWidget = () => {
  const [settings, setSettings] = useState({
    userRegistration: true,
    emailNotifications: true,
    maintenanceMode: false,
    autoApproveJobs: false
  });

  const handleSettingChange = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingsConfig = [
    {
      key: 'userRegistration',
      label: 'User Registration',
      description: 'Allow new users to register',
      icon: 'UserPlus'
    },
    {
      key: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Send system notifications via email',
      icon: 'Mail'
    },
    {
      key: 'maintenanceMode',
      label: 'Maintenance Mode',
      description: 'Put the platform in maintenance mode',
      icon: 'Settings'
    },
    {
      key: 'autoApproveJobs',
      label: 'Auto-approve Jobs',
      description: 'Automatically approve new job postings',
      icon: 'CheckCircle'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">Platform Settings</h2>
      </div>

      <div className="p-6 space-y-4">
        {settingsConfig.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <Icon name={setting.icon} size={20} className="text-text-secondary" />
              <div>
                <div className="text-sm font-medium text-text-primary">{setting.label}</div>
                <div className="text-xs text-text-secondary">{setting.description}</div>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange(setting.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[setting.key] ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-center">
              <Icon name="Download" size={16} className="mr-2" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full justify-center">
              <Icon name="Database" size={16} className="mr-2" />
              Backup Database
            </Button>
            <Button variant="outline" className="w-full justify-center text-error border-error hover:bg-error hover:text-white">
              <Icon name="AlertTriangle" size={16} className="mr-2" />
              System Maintenance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettingsWidget;
