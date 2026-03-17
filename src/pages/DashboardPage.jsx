import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Charts from '../components/Charts';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import BudgetAlert from '../components/BudgetAlert';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchBudgetAlerts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/transactions/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetAlerts = async () => {
    try {
      const response = await api.get('/budgets/alerts');
      setBudgetAlerts(response.data);
    } catch (error) {
      console.error('Error fetching budget alerts:', error);
    }
  };

 
  const handleRefresh = async () => {
    await Promise.all([
      fetchDashboardData(),
      fetchBudgetAlerts()
    ]);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <TransactionForm onAdd={handleRefresh} />
          {/* <Budget /> */}
        </div>
        <div className="col-md-9">
          <BudgetAlert alerts={budgetAlerts} />
          
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-success text-white p-3">
                <h5>Total Income</h5>
                <h3>{dashboardData.totalIncome ? formatCurrency(dashboardData.totalIncome) : '₹0.00'}</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-danger text-white p-3">
                <h5>Total Expense</h5>
                <h3>{dashboardData.totalExpense ? formatCurrency(dashboardData.totalExpense) : '₹0.00'}</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-primary text-white p-3">
                <h5>Balance</h5>
                <h3>{dashboardData.balance ? formatCurrency(dashboardData.balance) : '₹0.00'}</h3>
              </div>
            </div>
          </div>
          
          <Charts />
          {/* <TransactionList onRefresh={handleRefresh} /> */}
        </div>
      </div>
      <TransactionList onRefresh={handleRefresh} />
    </div>
  );
};


const formatCurrency = (amount) => {
  if (!amount) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export default DashboardPage;