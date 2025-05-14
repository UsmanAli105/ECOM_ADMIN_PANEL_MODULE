import axios from 'axios';

const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL;
const deviceType = navigator.userAgent;
const deviceId =  Math.floor(Math.random() * 9000) + 1000;


export const sendMessage = async (message:string, token: string, userId: number) => {
const payload = {
    channel: 1,
    deviceId: deviceId,
    deviceType: deviceType,
    userId,
    token,
    message
};
  return axios.post(`${CHAT_API_BASE_URL}chat`, payload);
};
