import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './App.css'

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="container-fluid p-0 min-vh-100">
        <AppRoutes />
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
