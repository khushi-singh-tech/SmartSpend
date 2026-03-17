import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authentication';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Reports from './pages/Reports';
import AdminPanel from './pages/AdminPanel';
import TransactionList from './components/TransactionList';
import BudgetsPage from './pages/BudgetsPage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  return user && user.role === 'ADMIN' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            {authService.isAuthenticated() && <Sidebar />}
            <div className="col-md-9 p-4 main-content"  style={{ marginLeft: '250px', marginTop: '56px' }}>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    !authService.isAuthenticated() ? <Login /> : <Navigate to="/" />
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    !authService.isAuthenticated() ? <Register /> : <Navigate to="/" />
                  } 
                />
                <Route 
                  path="/budgets" 
                  element={
                    <ProtectedRoute>
                      <BudgetsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } 
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <TransactionList />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;