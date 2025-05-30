import axios from 'axios';

const API = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL_API_DEVELOPMENT || 'http://localhost:3000',
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
