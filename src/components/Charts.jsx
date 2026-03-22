import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Charts = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await api.get('/transactions/dashboard');
      const data = response.data;
      
      // Prepare bar chart data
      const barData = {
        labels: ['Income', 'Expense'],
        datasets: [{
          label: 'Amount',
          data: [
            data.totalIncome ? parseFloat(data.totalIncome) : 0,
            data.totalExpense ? parseFloat(data.totalExpense) : 0
          ],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }]
      };

      // Prepare pie chart data (by category)
      const categoryData = {};
      data.recentTransactions?.forEach(t => {
        if (t.type === 'EXPENSE') {
          categoryData[t.category] = (categoryData[t.category] || 0) + parseFloat(t.amount);
        }
      });

      const pieData = {
        labels: Object.keys(categoryData),
        datasets: [{
          data: Object.values(categoryData),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ]
        }]
      };

      setChartData({ barData, pieData });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading charts...</div>;
  }

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card p-3">
          <h5>Income vs Expense</h5>
          {chartData.barData && (
  <Bar data={chartData.barData} options={{ responsive: true }} />
)}
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card p-3">
          <h5>Expense by Category</h5>
          {chartData.pieData && (
  <Pie data={chartData.pieData} options={{ responsive: true }} />
)}
        </div>
      </div>
    </div>
  );
};

export default Charts;
