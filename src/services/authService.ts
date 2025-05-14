import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const deviceType = navigator.userAgent;
const deviceId =  Math.floor(Math.random() * 9000) + 1000;

const COMMON_PAYLOAD = {
  channel: 1,
  deviceId: 'abcd1234xyz',
  deviceType: 'ANDROID',
  userId: 1001,
};

export const login = async (username: string, password: string) => {
  const { userId, ...payloadWithoutUserId } = COMMON_PAYLOAD; // eslint-disable-line @typescript-eslint/no-unused-vars
  const payload = {
    ...payloadWithoutUserId,
    userLoginRequestBean: {
      username,
      password,
    },
  };
  return axios.post(`${API_BASE_URL}login`, payload);
};

export const register = async (
  username: string,
  password: string,
  email: string,
  phone: string,
  displayName: string
) => {
  const payload = {
    ...COMMON_PAYLOAD,
    userRegistrationBean: {
      username,
      password,
      email,
      phone,
      displayName,
    },
  };
  return axios.post(`${API_BASE_URL}user/register`, payload);
};

// Check session and refresh token if needed
export const checkSession = async (token: string, userId: number) => {
  const payload = {
    channel: 1,
    deviceId: 'abcd1234xyz',
    deviceType: 'ANDROID',
    userId,
    checkSessionRequestBean: {
      token,
    },
  };
  return axios.post(
    `${API_BASE_URL}session/check`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}; 


export const getUserCount = async (token: string, userId: number) => {
  const payload = {
    channel: 1,
    deviceId: deviceId,
    deviceType: deviceType,
    userId,
    token,
  };
  return await axios.post(`${API_BASE_URL}user/count`, payload);
};
