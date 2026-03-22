import React from 'react';
import Budget from '../components/Budget';

const BudgetsPage = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">💰 Budget Management</h2>
      <Budget />
    </div>
  );
};

export default BudgetsPage;