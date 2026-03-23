import React from 'react';

const BudgetAlert = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const exceededAlerts = alerts.filter(alert => alert.status === 'exceeded');
  const warningAlerts = alerts.filter(alert => alert.status === 'warning');

  return (
    <div className="card p-3 mb-4">
      <h5>🔔 Budget Alerts</h5>
      
      {exceededAlerts.length > 0 && (
        <div className="alert alert-danger mb-2">
          <h6>⚠️ Budgets Exceeded</h6>
          {exceededAlerts.map(alert => (
            <div key={alert.id} className="mb-1">
              <strong>{alert.category}:</strong> {alert.spent} / {alert.limit} ({alert.percentage.toFixed(1)}%)
            </div>
          ))}
        </div>
      )}

      {warningAlerts.length > 0 && (
        <div className="alert alert-warning mb-2">
          <h6>⚡ Budgets at Risk</h6>
          {warningAlerts.map(alert => (
            <div key={alert.id} className="mb-1">
              <strong>{alert.category}:</strong> {alert.spent} / {alert.limit} ({alert.percentage.toFixed(1)}%)
            </div>
          ))}
        </div>
      )}

      {exceededAlerts.length === 0 && warningAlerts.length === 0 && (
        <div className="alert alert-success">
           All budgets are on track!
        </div>
      )}
    </div>
  );
};

export default BudgetAlert;