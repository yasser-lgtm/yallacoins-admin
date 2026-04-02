import React from 'react';
import { Router, Route } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminLayout } from './components/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Requests } from './pages/Requests';
import { RequestDetails } from './pages/RequestDetails';
import { Rates } from './pages/Rates';
import { Countries } from './pages/Countries';
import { Apps } from './pages/Apps';
import { Content } from './pages/Content';
import { Users } from './pages/Users';
import { AuditLogPage } from './pages/AuditLog';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

const NotFound: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600">Page not found</p>
    </div>
  </div>
);

const Placeholder: React.FC<{ name: string }> = ({ name }) => (
  <div className="p-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">{name}</h2>
    <div className="card-admin">
      <p className="text-gray-600">This page is under development.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/login" component={Login} />
        
        <Route path="/dashboard">
          {() => (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/requests">
          {() => (
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/requests/:id">
          {() => (
            <ProtectedRoute>
              <RequestDetails />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/rates">
          {() => (
            <ProtectedRoute>
              <Rates />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/countries">
          {() => (
            <ProtectedRoute>
              <Countries />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/apps">
          {() => (
            <ProtectedRoute>
              <Apps />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/content">
          {() => (
            <ProtectedRoute>
              <Content />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/users">
          {() => (
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/audit">
          {() => (
            <ProtectedRoute>
              <AuditLogPage />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/reports">
          {() => (
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/settings">
          {() => (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/">
          {() => <Login />}
        </Route>

        <Route component={NotFound} />
      </Router>
    </AuthProvider>
  );
}

export default App;
