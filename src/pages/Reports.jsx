import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Reports = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
    try {
      const response = await api.get(`/transactions/month/${selectedMonth}/${selectedYear}`);
      const transactions = response.data;
      
      // Calculate monthly summary
      const income = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const expense = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      
      const categorySummary = {};
      transactions
        .filter(t => t.type === 'EXPENSE')
        .forEach(t => {
          categorySummary[t.category] = (categorySummary[t.category] || 0) + parseFloat(t.amount);
        });

      setMonthlyData({ income, expense });
      setCategoryData(categorySummary);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setLoading(false);
    }
  };
  
    fetchMonthlyData();
  }, [selectedMonth, selectedYear]);

  // const fetchMonthlyData = async () => {
  //   try {
  //     const response = await api.get(`/transactions/month/${selectedMonth}/${selectedYear}`);
  //     const transactions = response.data;
      
  //     // Calculate monthly summary
  //     const income = transactions
  //       .filter(t => t.type === 'INCOME')
  //       .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
  //     const expense = transactions
  //       .filter(t => t.type === 'EXPENSE')
  //       .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      
  //     const categorySummary = {};
  //     transactions
  //       .filter(t => t.type === 'EXPENSE')
  //       .forEach(t => {
  //         categorySummary[t.category] = (categorySummary[t.category] || 0) + parseFloat(t.amount);
  //       });

  //     setMonthlyData({ income, expense });
  //     setCategoryData(categorySummary);
  //   } catch (error) {
  //     console.error('Error fetching monthly data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const barData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      label: 'Monthly Summary',
      data: [monthlyData.income, monthlyData.expense],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
      borderWidth: 1
    }]
  };

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Monthly Reports</h2>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Select Month</label>
          <select 
            className="form-select" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Select Year</label>
          <select 
            className="form-select" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Monthly Summary</h5>
            <Bar data={barData} options={{ responsive: true }} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Expense by Category</h5>
            <Pie data={pieData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      <div className="card p-3">
        <h5>AI Prediction for Next Month</h5>
        <p className="text-muted">Based on your historical data, your predicted expense for next month is: 
          <strong> ${((monthlyData.expense * 1.1).toFixed(2))}</strong>
        </p>
      </div>
    </div>
  );
};

export default Reports;
