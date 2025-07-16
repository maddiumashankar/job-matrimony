import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const JobFilters = ({ filters, onFiltersChange, onSaveSearch, savedSearches }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const locations = [
    'Remote', 'New York, NY', 'San Francisco, CA', 'Seattle, WA', 
    'Austin, TX', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA'
  ];

  const experienceLevels = [
    'Entry Level (0-2 years)',
    'Mid Level (2-5 years)', 
    'Senior Level (5-8 years)',
    'Lead Level (8+ years)'
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSalaryChange = (type, value) => {
    onFiltersChange({
      ...filters,
      salary: {
        ...filters.salary,
        [type]: value ? parseInt(value) : null
      }
    });
  };

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      onSaveSearch(searchName.trim(), filters);
      setSearchName('');
      setShowSaveDialog(false);
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      location: '',
      experience: '',
      jobType: '',
      salary: { min: null, max: null },
      skills: []
    });
  };

  const hasActiveFilters = () => {
    return filters.location || filters.experience || filters.jobType || 
           filters.salary.min || filters.salary.max || filters.skills.length > 0;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Filter Jobs</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              className="text-text-secondary"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>

      {/* Basic Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Experience</label>
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Levels</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Job Type</label>
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border-light">
          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Salary Range (USD)</label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min salary"
                value={filters.salary.min || ''}
                onChange={(e) => handleSalaryChange('min', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max salary"
                value={filters.salary.max || ''}
                onChange={(e) => handleSalaryChange('max', e.target.value)}
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Skills</label>
            <Input
              type="text"
              placeholder="Enter skills separated by commas"
              value={filters.skills.join(', ')}
              onChange={(e) => handleFilterChange('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            />
          </div>
        </div>
      )}

      {/* Save Search */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
        <div className="flex items-center space-x-2">
          {savedSearches.length > 0 && (
            <select
              className="px-3 py-1 text-sm border border-border rounded bg-surface text-text-primary"
              onChange={(e) => {
                if (e.target.value) {
                  const savedSearch = savedSearches.find(s => s.id === e.target.value);
                  if (savedSearch) {
                    onFiltersChange(savedSearch.filters);
                  }
                }
              }}
            >
              <option value="">Load Saved Search</option>
              {savedSearches.map((search) => (
                <option key={search.id} value={search.id}>{search.name}</option>
              ))}
            </select>
          )}
        </div>

        {hasActiveFilters() && (
          <div className="flex items-center space-x-2">
            {showSaveDialog ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-32"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveSearch}
                  disabled={!searchName.trim()}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveDialog(false)}
                  iconName="X"
                >
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
                iconName="Bookmark"
              >
                Save Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFilters;