import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { getProductCount } from "../services/productService";
import { getUserCount } from "../services/authService";
import { getOrderCount } from "../services/orderService"; 

const Dashboard: React.FC = () => {
const userObj = JSON.parse(localStorage.getItem("user") || "{}");
const token = localStorage.getItem('token') || '';

  const [productCount, setProductCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProductCount = async () => {
      setLoading(true);
      try {
        const response = await getProductCount(token, userObj.userId);
        const result = response.data;

        if (result?.data?.success) {
          setProductCount(result.data.count);
        } else {
          throw new Error("API did not return success");
        }
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as any).response === "object" &&
          (err as any).response?.data?.message
        ) {
          setError(
            (err as { response: { data: { message: string } } }).response.data.message
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch product count");
        }
      } finally {
        setLoading(false);
      }
    };



        const fetchUserCount = async () => {
      setLoading(true);
      try {
        const response = await getUserCount(token, userObj.userId);
        const result = response.data;

        if (result?.data?.success) {
          setUserCount(result.data.count);
        } else {
          throw new Error("API did not return success");
        }
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as any).response === "object" &&
          (err as any).response?.data?.message
        ) {
          setError(
            (err as { response: { data: { message: string } } }).response.data.message
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch user count");
        }
      } finally {
        setLoading(false);
      }
    };


    const fetchOrderCount = async () => {
    setLoading(true);
    try {
    const response = await getOrderCount(token, userObj.userId);
    const result = response.data;

    if (result?.data?.success) {
    setOrderCount(result.data.count);
    } else {
    throw new Error("API did not return success");
    }
    } catch (err: unknown) {
    if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as any).response === "object" &&
    (err as any).response?.data?.message
    ) {
    setError(
    (err as { response: { data: { message: string } } }).response.data.message
    );
    } else if (err instanceof Error) {
    setError(err.message);
    } else {
    setError("Failed to fetch o9rder count");
    }
    } finally {
    setLoading(false);
    }
    };

    fetchProductCount();
    fetchUserCount();
    fetchOrderCount();

  }, [userObj.token, userObj.userId]);

  const stats = [
    {
      label: "Total Products",
      value: productCount !== null ? productCount : "Loading...",
      icon: "bi-box-seam",
    },
    {
      label: "Total Orders",
      value: orderCount !== null ? orderCount : "Loading...",
      icon: "bi-receipt",
    },
    {
      label: "Total Users",
      value: userCount !== null ? userCount : "Loading...",
      icon: "bi-people",
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div className="dashboard-stat-card" key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <i className={`stat-icon bi ${stat.icon}`}></i>
          </div>
        ))}
      </div>

      <div
        className="card p-4 text-center"
        style={{ maxWidth: 500, margin: "0 auto", borderRadius: 24 }}
      >
        <h1 className="mb-3">Welcome</h1>
        <h4>{userObj.displayName}</h4>
      </div>

      {error && (
        <div className="alert alert-danger text-center mt-3">{error}</div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
