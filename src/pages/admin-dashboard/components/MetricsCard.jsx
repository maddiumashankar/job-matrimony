import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, description }) => {
  const isIncrease = changeType === 'increase';
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isIncrease ? 'bg-success/10' : 'bg-error/10'}`}>
            <Icon name={icon} size={20} className={isIncrease ? 'text-success' : 'text-error'} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
            <p className="text-xs text-text-tertiary">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-text-primary mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {change && (
            <div className={`flex items-center text-sm ${
              isIncrease ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={isIncrease ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
                className="mr-1" 
              />
              {change}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
