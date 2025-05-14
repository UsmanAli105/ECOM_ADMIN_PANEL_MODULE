import axios from 'axios';


const ORDER_API_BASE_URL = import.meta.env.VITE_ORDER_API_BASE_URL;
const DEFAULT_CHANNEL = 1;
const deviceType = navigator.userAgent;
const deviceId =  Math.floor(Math.random() * 9000) + 1000;


export const getNewOrders = async (token: string, userId: number) => {
  const payload = {
    channel: DEFAULT_CHANNEL,
    deviceId: deviceId,
    deviceType: deviceType,
    userId: userId,
    token: token
    };

    console.log(payload);
    return axios.post(`${ORDER_API_BASE_URL}order/getNewOrders`, payload);
};

export const updateOrderStatus = async (
  orderId: number,
  statusId: number,
  token: string,
  userId: number
) => {
  const payload = {
    channel: DEFAULT_CHANNEL,
    deviceId: deviceId,
    deviceType: deviceType,
    userId: userId,
    token: token,
    update_order_request: {
      id: Number(orderId),
      order_id: Number(orderId),
      status_id: statusId,
    },
  };
  return axios.post(`${ORDER_API_BASE_URL}order/updateOrderStatus`, payload);
}; 

export const getOrderCount = async (
  token: string,
  userId: number
) => {
  const payload = {
    channel: DEFAULT_CHANNEL,
    deviceId: deviceId,
    deviceType: deviceType,
    userId: userId,
    token: token,
  };
  return axios.post(`${ORDER_API_BASE_URL}order/getOrdersCount`, payload);
}; 