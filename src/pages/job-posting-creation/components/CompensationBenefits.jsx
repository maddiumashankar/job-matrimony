import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CompensationBenefits = ({ formData, onChange, errors = {} }) => {
  const [showSalaryRange, setShowSalaryRange] = useState(true);
  const [customBenefit, setCustomBenefit] = useState('');

  const salaryTypes = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'annual', label: 'Annual' },
    { value: 'contract', label: 'Contract' },
    { value: 'negotiable', label: 'Negotiable' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' }
  ];

  const standardBenefits = [
    { id: 'health-insurance', label: 'Health Insurance', icon: 'Heart' },
    { id: 'dental-vision', label: 'Dental & Vision', icon: 'Eye' },
    { id: 'retirement-401k', label: '401(k) / Retirement Plan', icon: 'PiggyBank' },
    { id: 'paid-time-off', label: 'Paid Time Off', icon: 'Calendar' },
    { id: 'flexible-schedule', label: 'Flexible Schedule', icon: 'Clock' },
    { id: 'remote-work', label: 'Remote Work Options', icon: 'Home' },
    { id: 'professional-development', label: 'Professional Development', icon: 'BookOpen' },
    { id: 'gym-membership', label: 'Gym Membership', icon: 'Dumbbell' },
    { id: 'stock-options', label: 'Stock Options', icon: 'TrendingUp' },
    { id: 'commuter-benefits', label: 'Commuter Benefits', icon: 'Car' },
    { id: 'life-insurance', label: 'Life Insurance', icon: 'Shield' },
    { id: 'parental-leave', label: 'Parental Leave', icon: 'Baby' }
  ];

  const handleInputChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleBenefitToggle = (benefitId) => {
    const currentBenefits = formData.benefits || [];
    const isSelected = currentBenefits.includes(benefitId);
    
    if (isSelected) {
      handleInputChange('benefits', currentBenefits.filter(id => id !== benefitId));
    } else {
      handleInputChange('benefits', [...currentBenefits, benefitId]);
    }
  };

  const handleCustomBenefitAdd = () => {
    if (customBenefit.trim()) {
      const currentCustomBenefits = formData.customBenefits || [];
      handleInputChange('customBenefits', [...currentCustomBenefits, customBenefit.trim()]);
      setCustomBenefit('');
    }
  };

  const handleCustomBenefitRemove = (index) => {
    const currentCustomBenefits = formData.customBenefits || [];
    handleInputChange('customBenefits', currentCustomBenefits.filter((_, i) => i !== index));
  };

  const getSalaryRangeSuggestion = () => {
    // Mock AI-powered salary suggestions based on role and location
    const suggestions = {
      'software engineer': { min: 80000, max: 120000 },
      'senior software engineer': { min: 120000, max: 180000 },
      'product manager': { min: 100000, max: 150000 },
      'data scientist': { min: 90000, max: 140000 }
    };
    
    const title = (formData.title || '').toLowerCase();
    for (const [role, range] of Object.entries(suggestions)) {
      if (title.includes(role)) {
        return range;
      }
    }
    return null;
  };

  const salaryRangeSuggestion = getSalaryRangeSuggestion();

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="DollarSign" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Compensation & Benefits</h3>
      </div>

      <div className="space-y-6">
        {/* Salary Information */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-text-primary">
              Salary Information *
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showSalaryRange"
                checked={showSalaryRange}
                onChange={(e) => setShowSalaryRange(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="showSalaryRange" className="text-sm text-text-secondary">
                Show salary range
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Salary Type
              </label>
              <select
                value={formData.salaryType || 'annual'}
                onChange={(e) => handleInputChange('salaryType', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {salaryTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Currency
              </label>
              <select
                value={formData.currency || 'USD'}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showSalaryRange && formData.salaryType !== 'negotiable' && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Minimum Salary
                  </label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={formData.minSalary || ''}
                    onChange={(e) => handleInputChange('minSalary', e.target.value)}
                    className={errors.minSalary ? 'border-error' : ''}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Maximum Salary
                  </label>
                  <Input
                    type="number"
                    placeholder="80000"
                    value={formData.maxSalary || ''}
                    onChange={(e) => handleInputChange('maxSalary', e.target.value)}
                    className={errors.maxSalary ? 'border-error' : ''}
                  />
                </div>
              </div>
              
              {/* AI Salary Suggestion */}
              {salaryRangeSuggestion && (
                <div className="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-primary-700">AI Salary Suggestion</p>
                      <p className="text-xs text-primary-600 mt-1">
                        Based on market data: ${salaryRangeSuggestion.min.toLocaleString()} - ${salaryRangeSuggestion.max.toLocaleString()}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          handleInputChange('minSalary', salaryRangeSuggestion.min.toString());
                          handleInputChange('maxSalary', salaryRangeSuggestion.max.toString());
                        }}
                        className="mt-1 text-primary hover:text-primary-600 p-0 h-auto"
                      >
                        Apply suggestion
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {errors.minSalary && (
            <p className="text-sm text-error mt-1">{errors.minSalary}</p>
          )}
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-4">
            Benefits & Perks
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {standardBenefits.map(benefit => (
              <div
                key={benefit.id}
                onClick={() => handleBenefitToggle(benefit.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  (formData.benefits || []).includes(benefit.id)
                    ? 'border-primary bg-primary-50 text-primary-700' :'border-border hover:border-primary-300 hover:bg-primary-25'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={benefit.icon} 
                    size={16} 
                    className={(formData.benefits || []).includes(benefit.id) ? 'text-primary' : 'text-text-tertiary'}
                  />
                  <span className="text-sm font-medium">{benefit.label}</span>
                  {(formData.benefits || []).includes(benefit.id) && (
                    <Icon name="Check" size={14} className="text-primary ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Benefits */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Additional Benefits
          </label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Add custom benefit..."
              value={customBenefit}
              onChange={(e) => setCustomBenefit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomBenefitAdd()}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleCustomBenefitAdd}
              iconName="Plus"
              disabled={!customBenefit.trim()}
            >
              Add
            </Button>
          </div>
          
          {formData.customBenefits && formData.customBenefits.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.customBenefits.map((benefit, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-700"
                >
                  {benefit}
                  <button
                    onClick={() => handleCustomBenefitRemove(index)}
                    className="ml-2 hover:text-secondary-900"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Equity/Stock Options */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Equity Information
          </label>
          <textarea
            placeholder="Details about stock options, equity grants, or profit sharing..."
            value={formData.equityInfo || ''}
            onChange={(e) => handleInputChange('equityInfo', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Work-Life Balance */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Work-Life Balance
          </label>
          <textarea
            placeholder="Information about work hours, flexibility, vacation policy, etc."
            value={formData.workLifeBalance || ''}
            onChange={(e) => handleInputChange('workLifeBalance', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default CompensationBenefits;