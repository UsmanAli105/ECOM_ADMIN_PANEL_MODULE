import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ProductsAdd from '../pages/ProductsAdd';
import ProductsList from '../pages/ProductsList';
import Orders from '../pages/Orders';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/products/add"
      element={
        <ProtectedRoute>
          <ProductsAdd />
        </ProtectedRoute>
      }
    />
    <Route
      path="/products/list"
      element={
        <ProtectedRoute>
          <ProductsList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      }
    />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes; 