import React, { useState } from 'react';

const TransactionFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: ''
  });

  const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Other'];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      type: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: ''
    });
    onFilterChange({});
  };

  return (
    <div className="card p-3 mb-4">
      <h5>Transaction Filters</h5>
      
      <div className="row">
        <div className="col-md-3 mb-3">
          <label className="form-label">Category</label>
          <select 
            className="form-select"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2 mb-3">
          <label className="form-label">Type</label>
          <select 
            className="form-select"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">Amount Range (₹)</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              placeholder="Min"
            />
            <span className="input-group-text">-</span>
            <input
              type="number"
              className="form-control"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              placeholder="Max"
            />
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Date Range</label>
          <div className="input-group">
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <span className="input-group-text">→</span>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>


      <div className="d-flex gap-2">
        <button 
          className="btn btn-primary"
          onClick={handleApplyFilters}
        >
           Apply Filters
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </div>

   
      {Object.values(filters).some(value => value !== '') && (
        <div className="mt-3">
          <small className="text-muted">
            Active Filters: {Object.entries(filters)
              .filter(([key, value]) => value !== '')
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </small>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;