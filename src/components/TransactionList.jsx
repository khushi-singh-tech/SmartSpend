import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransactionFilters from './TransactionFilter';

const TransactionList = ({ onRefresh }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (filterParams = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filterParams).toString();
      const response = await api.get(`/transactions?${params}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchTransactions(newFilters);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = transactions.filter(t =>
      t.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
      t.category.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setTransactions(filtered);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      'INCOME': { text: 'Income', class: 'badge bg-success' },
      'EXPENSE': { text: 'Expense', class: 'badge bg-danger' }
    };
    return typeMap[type] || typeMap['EXPENSE'];
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4" >
        <h4>Transaction List</h4>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: '250px' }}
          />
          <button 
            className="btn btn-primary"
            onClick={() => onRefresh && onRefresh()}
          >
             Refresh
          </button>
        </div>
      </div>

      <TransactionFilters onFilterChange={handleFilterChange} />

      {Object.keys(filters).length > 0 && (
        <div className="alert alert-info mb-3">
          <strong>Active Filters:</strong> {Object.entries(filters)
            .filter(([key, value]) => value !== '')
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}
          <button 
            className="btn btn-sm btn-link ms-2"
            onClick={() => handleFilterChange({})}
          >
            Clear All
          </button>
        </div>
      )}

      <div className="mb-3">
        <span className="badge bg-primary">
          {transactions.length} Transaction(s) Found
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <p className="text-muted">No transactions found.</p>
                  <p className="text-muted">Try adjusting your filters or add new transactions.</p>
                </td>
              </tr>
            ) : (
              transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>
                    <strong>{transaction.title}</strong>
                  </td>
                  <td>
                    <span className="badge bg-secondary">
                      {transaction.category}
                    </span>
                  </td>
                  <td>
                    {(() => {
                      const badge = getTypeBadge(transaction.type);
                      return <span className={badge.class}>{badge.text}</span>;
                    })()}
                  </td>
                  <td>
                    <strong>{formatCurrency(transaction.amount)}</strong>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {transactions.length > 10 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
  <button className="page-link">Previous</button>
</li>
<li className="page-item active">
  <button className="page-link">1</button>
</li>
<li className="page-item">
  <button className="page-link">2</button>
</li>
<li className="page-item">
  <button className="page-link">Next</button>
</li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TransactionList;