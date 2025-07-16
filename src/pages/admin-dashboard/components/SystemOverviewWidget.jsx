import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemOverviewWidget = () => {
  const systemStats = [
    {
      label: 'Database Size',
      value: '2.4 GB',
      status: 'healthy',
      icon: 'Database'
    },
    {
      label: 'API Response Time',
      value: '120ms',
      status: 'healthy',
      icon: 'Zap'
    },
    {
      label: 'Server Uptime',
      value: '99.9%',
      status: 'healthy',
      icon: 'Server'
    },
    {
      label: 'Active Sessions',
      value: '234',
      status: 'warning',
      icon: 'Activity'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'healthy': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-error/10';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">System Overview</h2>
          <div className="flex items-center space-x-2 text-sm text-success">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50">
              <div className={`p-2 rounded-lg ${getStatusBg(stat.status)}`}>
                <Icon name={stat.icon} size={20} className={getStatusColor(stat.status)} />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{stat.value}</div>
                <div className="text-xs text-text-secondary">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent System Events */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">Recent System Events</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-success/5">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <div className="flex-1">
                <div className="text-sm text-text-primary">Database backup completed successfully</div>
                <div className="text-xs text-text-secondary">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-warning/5">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <div className="flex-1">
                <div className="text-sm text-text-primary">High memory usage detected on server-2</div>
                <div className="text-xs text-text-secondary">4 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-success/5">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <div className="flex-1">
                <div className="text-sm text-text-primary">Security scan completed - no issues found</div>
                <div className="text-xs text-text-secondary">6 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverviewWidget;
