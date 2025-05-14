import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const accentGradient = "linear-gradient(90deg, #6f42c1 0%, #5bc0eb 100%)";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userObj = JSON.parse(localStorage.getItem('user') || '{}');

  // Sidebar toggle for mobile/desktop
  const handleSidebarToggle = () => setSidebarOpen((v) => !v);

  return (
    <div className={"dashboard-layout" + (sidebarOpen ? " sidebar-open" : "")}>
      {/* Sidebar */}
      <aside
        className="dashboard-sidebar"
        style={{ background: accentGradient }}
      >
        <div className="sidebar-header d-flex align-items-center justify-content-between">
          <span className="fw-bold" style={{ letterSpacing: 1 }}>
            {userObj.role} Panel
          </span>
          <button
            className="btn btn-link text-white d-lg-none"
            onClick={handleSidebarToggle}
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          end
        >
          <i className="bi bi-house-door"></i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/products/add"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          <i className="bi bi-plus-circle"></i>
          <span>Add Products</span>
        </NavLink>
        <NavLink
          to="/products/list"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          <i className="bi bi-box-seam"></i>
          <span>Product List</span>
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          <i className="bi bi-receipt"></i>
          <span>Orders</span>
        </NavLink>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <header
          className="dashboard-header shadow"
          style={{
            background: accentGradient,
            color: "#fff",
            boxShadow: "0 2px 12px 0 rgba(111,66,193,0.10)",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link text-white d-lg-none"
              onClick={handleSidebarToggle}
              aria-label="Open sidebar"
            >
              <i className="bi bi-list" style={{ fontSize: 24 }}></i>
            </button>
            <span className="fs-4 fw-bold" style={{ letterSpacing: 1 }}>
              {userObj.role} Dashboard
            </span>
          </div>
          <button
            className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </header>
        <main className="">{children}</main>
      </div>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={handleSidebarToggle}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
