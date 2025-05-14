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

type Role = "ADMIN" | "MODERATOR" | "USER";

const role: Role = userObj.role === "ADMIN" || userObj.role === "MODERATOR" || userObj.role === "USER" ? userObj.role : "USER";

const NAV_ITEMS = {
  ADMIN: [
    { to: "/dashboard", icon: "bi-house-door", label: "Dashboard" },
    { to: "/products/add", icon: "bi-plus-circle", label: "Add Products" },
    { to: "/products/list", icon: "bi-box-seam", label: "Product List" },
    { to: "/orders", icon: "bi-receipt", label: "Orders" },
  ],
  MODERATOR: [
    { to: "/products/list", icon: "bi-box-seam", label: "Product List" },
    { to: "/orders", icon: "bi-receipt", label: "Orders" },
  ],
  USER: [
    { to: "/products/list", icon: "bi-box-seam", label: "Product List" },
    { to: "/orders", icon: "bi-receipt", label: "Orders" },
    { to: "/chat", icon: "bi-receipt", label: "Chat" },
  ],
};


  return (
    <div className={"dashboard-layout" + (sidebarOpen ? " sidebar-open" : "")}>
      {/* Sidebar */}
      <aside
        className="dashboard-sidebar"
        style={{ background: accentGradient }}
      >
        <div className="sidebar-header d-flex align-items-center justify-content-between">
          <span className="fw-bold" style={{ letterSpacing: 1 }}>
            {role} Panel
          </span>
          <button
            className="btn btn-link text-white d-lg-none"
            onClick={handleSidebarToggle}
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      {NAV_ITEMS[role]?.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          <i className={`bi ${item.icon}`}></i>
          <span>{item.label}</span>
        </NavLink>
      ))}
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
              {role} Dashboard
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
