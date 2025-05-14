import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { getNewOrders, updateOrderStatus } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  order_id: number;
  customer_id: number;
  status: string;
}

interface Order {
  order_details: OrderDetails;
  order_items: OrderItem[];
}

const statusOptions = [
  { id: 1, label: 'PENDING' },
  { id: 51, label: 'CONFIRMED' },
  { id: 101, label: 'PROCESSING' },
  { id: 151, label: 'SHIPPED' },
  { id: 201, label: 'DELIVERED' },
  { id: 251, label: 'CANCELLED' },
  { id: 301, label: 'RETURNED' },
  { id: 351, label: 'REFUNDED' },
  { id: 401, label: 'FAILED' },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        if (!user) {
          setError('User not found. Please login again.');
          setLoading(false);
          return;
        }
        const response = await getNewOrders(token, user.userId);
        if (response?.data?.data?.new_orders != null) {
          setOrders(response?.data?.data?.new_orders || []);
        } else {
            setError(response.data.status.message);
        }
      } catch {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, authLoading]);

  const handleStatusChange = async (orderId: number, newStatusId: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      if (!user) {
        setFeedback((prev) => ({ ...prev, [orderId]: 'User not found.' }));
        setToastType('error');
        setToastMessage('User not found. Please login again.');
        setShowToast(true);
        return;
      }
      const statusId = Number(newStatusId);
      const response = await updateOrderStatus(orderId, statusId, token, user.userId);
      if (response.data?.data?.success) {
        const newStatusLabel = statusOptions.find(opt => opt.id === statusId)?.label || '';
        setFeedback((prev) => ({ ...prev, [orderId]: 'Status updated successfully!' }));
        setToastType('success');
        setToastMessage('Status updated successfully!');
        setShowToast(true);
        setOrders((prev) =>
          prev.map((order) =>
            order.order_details.order_id === orderId
              ? {
                  ...order,
                  order_details: {
                    ...order.order_details,
                    status: newStatusLabel,
                  },
                }
              : order
          )
        );
      } else {
        const msg = response.data?.data?.message || 'Failed to update status.';
        setFeedback((prev) => ({ ...prev, [orderId]: msg }));
        setToastType('error');
        setToastMessage(msg);
        setShowToast(true);
      }
    } catch {
      setFeedback((prev) => ({ ...prev, [orderId]: 'Failed to update status.' }));
      setToastType('error');
      setToastMessage('Failed to update status.');
      setShowToast(true);
    }
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, [orderId]: '' }));
    }, 2000);
  };

  return (
    <DashboardLayout>
      {/* Toast for success or error message */}
      <div
        className={`toast align-items-center text-bg-${toastType === 'success' ? 'success' : toastType === 'error' ? 'danger' : 'warning'} border-0 position-fixed top-0 end-0 m-4${showToast ? ' show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ zIndex: 9999, minWidth: 300 }}
      >
        <div className="d-flex">
          <div className="toast-body">{toastMessage}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
      </div>
      <div className="orders-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Order Management</h3>
        </div>
        {authLoading || loading ? (
          <div>Loading orders...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Status</th>
                  <th>Order Items</th>
                  <th>Change Status</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_details.order_id}>
                    <td>{order.order_details.order_id}</td>
                    <td>{order.order_details.customer_id}</td>
                    <td>{order.order_details.status}</td>
                    <td>
                      <table className="table table-sm mb-0">
                        <thead>
                          <tr>
                            <th>Product ID</th>
                            <th>Quantity</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_items.map((item, idx) => (
                            <tr key={item.product_id + idx}>
                              <td>{item.product_id}</td>
                              <td>{item.quantity}</td>
                              <td>{item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={
                          statusOptions.find(opt => opt.label === order.order_details.status)?.id || ''
                        }
                        onChange={(e) =>
                          handleStatusChange(order.order_details.order_id, e.target.value)
                        }
                      >
                        <option value="">Select Status</option>
                        {statusOptions.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {feedback[order.order_details.order_id] && (
                        <span
                          className={
                            feedback[order.order_details.order_id].includes('success')
                              ? 'text-success'
                              : 'text-danger'
                          }
                        >
                          {feedback[order.order_details.order_id]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders; 