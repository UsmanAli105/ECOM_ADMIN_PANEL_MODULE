import axios from 'axios';

const PRODUCT_API_BASE_URL = import.meta.env.VITE_PRODUCT_API_BASE_URL;
const deviceType = navigator.userAgent;
const deviceId =  Math.floor(Math.random() * 9000) + 1000;

export interface Product {
  brandId: number;
  categoryId: number;
  productName: string;
  productDescription: string;
  imagePath: string;
  basePrice: number;
  gst: number;
}

// Function to create products
export const createProducts = async (products: Product[], token: string, userId: number) => {
  const payload = {
    channel: 1,
    deviceId: deviceId,
    deviceType: deviceType,
    userId,
    token,
    createProductRequests: products,
  };
  return axios.post(`${PRODUCT_API_BASE_URL}product/create`, payload);
};

export const getProductCount = async (token: string, userId: number) => {
  const payload = {
    channel: 1,
    deviceId: deviceId,
    deviceType: deviceType,
    userId,
    token,
  };

  return await axios.post(`${PRODUCT_API_BASE_URL}product/count`, payload);
};


export const getBrandDropDown = async (token: string, userId: number) => {
  const payload = {
    channel: 1,
    deviceId: deviceId,
    deviceType: deviceType,
    userId,
    token,
  };
  return await axios.post(`${PRODUCT_API_BASE_URL}brand/getDropdown`, payload);
};


export const getCategoryDropDown = async (token: string, userId: number) => {
  const payload = {
    channel: 1,
    deviceId: deviceId,
    deviceType: deviceType,
    userId,
    token,
  };
  return await axios.post(`${PRODUCT_API_BASE_URL}category/getDropDown`, payload);
};

export const getProducts = async (token: string, userId: number) => {
  const payload = {
    channel: 1,
    deviceId: deviceId,
    deviceType: deviceType,
    userId,
    token,
    productsRequestBean: {}
  };
  return await axios.post(`${PRODUCT_API_BASE_URL}product/get`, payload);
};
