import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Food',
    limitAmount: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [recalculating, setRecalculating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Other'];

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      const [budgetsRes, summaryRes, alertsRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/budgets/summary'),
        api.get('/budgets/alerts')
      ]);
      setBudgets(budgetsRes.data);
      setSummary(summaryRes.data);
      setAlerts(alertsRes.data);
      setError('');
    } catch (error) {
      console.error('Error fetching budget data:', error);
      setError('Failed to load budget data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.limitAmount || parseFloat(formData.limitAmount) <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    try {
      const budgetData = {
        category: formData.category,
        limitAmount: parseFloat(formData.limitAmount)
      };
      
      await api.post('/budgets', budgetData);
      setSuccess('Budget created successfully!');
      setShowForm(false);
      setFormData({ category: 'Food', limitAmount: '' });
      fetchBudgetData();
    } catch (error) {
      console.error('Error creating budget:', error);
      setError(error.response?.data?.message || 'Failed to create budget. Please try again.');
    }
  };

  const handleUpdateBudget = async (id) => {
    try {
       await api.put(`/budgets/${id}/limit`, { 
        limitAmount: parseFloat(formData.limitAmount) 
      });
      setSuccess('Budget updated successfully!');
      setEditingId(null);
      setShowForm(false);
      setFormData({ category: 'Food', limitAmount: '' });
      fetchBudgetData();
    } catch (error) {
      console.error('Error updating budget:', error);
      setError(error.response?.data?.message || 'Failed to update budget.');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        setSuccess('Budget deleted successfully!');
        fetchBudgetData();
      } catch (error) {
        console.error('Error deleting budget:', error);
        setError('Failed to delete budget.');
      }
    }
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await api.post('/budgets/recalculate');
      setSuccess('Budget recalculated successfully!');
      fetchBudgetData();
    } catch (error) {
      console.error('Error recalculating budget:', error);
      setError('Failed to recalculate budget.');
    } finally {
      setRecalculating(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-danger';
    if (percentage >= 80) return 'bg-warning';
    if (percentage >= 50) return 'bg-info';
    return 'bg-success';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'exceeded': { text: 'Exceeded', class: 'badge bg-danger' },
      'warning': { text: 'Warning', class: 'badge bg-warning text-dark' },
      'moderate': { text: 'Moderate', class: 'badge bg-info' },
      'good': { text: 'Good', class: 'badge bg-success' }
    };
    return statusMap[status] || statusMap['good'];
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading budget data...</p>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Budget Management</h4>
        <div>
          <button 
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={handleRecalculate}
            disabled={recalculating}
          >
            {recalculating ? 'Recalculating...' : 'Recalculate'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => { setShowForm(true); setEditingId(null); }}
          >
            + Add Budget
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Budget Summary */}
      {summary.totalLimit && (
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white p-3">
              <h5>Total Budget</h5>
              <h3>{formatCurrency(summary.totalLimit)}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-danger text-white p-3">
              <h5>Total Spent</h5>
              <h3>{formatCurrency(summary.totalSpent)}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white p-3">
              <h5>Remaining</h5>
              <h3>{formatCurrency(summary.totalRemaining)}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Smart Budget Alerts */}
      {alerts.length > 0 && (
        <div className="mb-4">
          {alerts.filter(alert => alert.status === 'exceeded' || alert.status === 'warning').length > 0 && (
            <div className="alert alert-warning">
              <h5>⚠️ Smart Budget Alerts</h5>
              {alerts.filter(alert => alert.status === 'exceeded' || alert.status === 'warning').map(alert => (
                <div key={alert.id} className="mb-2">
                  <strong>{alert.category}:</strong> {alert.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Budget Form */}
      {(showForm || editingId) && (
        <div className="card p-3 mb-4">
          <h5>{editingId ? 'Edit Budget' : 'Add New Budget'}</h5>
          <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdateBudget(editingId); } : handleCreateBudget}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Budget Limit (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.limitAmount}
                  onChange={(e) => setFormData({ ...formData, limitAmount: e.target.value })}
                  required
                  step="0.01"
                  min="0"
                  placeholder="Enter budget limit"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Budget' : 'Create Budget'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn btn-secondary ms-2"
                onClick={() => { setEditingId(null); setShowForm(false); }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {/* Budget List Table */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Category</th>
              <th>Limit</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  <p className="text-muted">No budgets found. Add your first budget!</p>
                </td>
              </tr>
            ) : (
              budgets.map(budget => (
                <tr key={budget.id}>
                  <td>
                    <strong>{budget.category}</strong>
                  </td>
                  <td>{formatCurrency(budget.limitAmount)}</td>
                  <td>{formatCurrency(budget.spentAmount)}</td>
                  <td>{formatCurrency(budget.remainingAmount)}</td>
                  <td>
                    <div className="progress" style={{ height: '20px' }}>
                      <div 
                        className={`progress-bar ${getProgressColor(budget.percentageUsed)}`}
                        role="progressbar"
                        style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                        aria-valuenow={budget.percentageUsed}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {budget.percentageUsed.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td>
                    {(() => {
                      const status = getStatusBadge(budget.status);
                      return <span className={status.class}>{status.text}</span>;
                    })()}
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setEditingId(budget.id);
                        setShowForm(true);
                        setFormData({ category: budget.category, limitAmount: budget.limitAmount.toString() });
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteBudget(budget.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Budget;