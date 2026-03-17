import React from 'react';

const BudgetProgress = ({ budget }) => {
  const percentage = budget.percentageUsed || 0;
  const isExceeded = percentage >= 100;
  const isWarning = percentage >= 80 && percentage < 100;
  const isModerate = percentage >= 50 && percentage < 80;

  const getProgressColor = () => {
    if (isExceeded) return 'bg-danger';
    if (isWarning) return 'bg-warning';
    if (isModerate) return 'bg-info';
    return 'bg-success';
  };

  const getStatusText = () => {
    if (isExceeded) return 'Exceeded';
    if (isWarning) return 'Warning';
    if (isModerate) return 'Moderate';
    return 'On Track';
  };

  return (
    <div className="card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">{budget.category}</h6>
        <span className={`badge ${isExceeded ? 'bg-danger' : isWarning ? 'bg-warning text-dark' : 'bg-success'}`}>
          {getStatusText()}
        </span>
      </div>
      <div className="progress" style={{ height: '25px' }}>
        <div 
          className={`progress-bar ${getProgressColor()}`}
          role="progressbar"
          style={{ width: `${Math.min(percentage, 100)}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <small className="text-white">{percentage.toFixed(1)}%</small>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-2">
        <small className="text-muted">
          {budget.spentAmount} / {budget.limitAmount}
        </small>
        <small className="text-muted">
          Remaining: {budget.remainingAmount}
        </small>
      </div>
    </div>
  );
};

export default BudgetProgress;