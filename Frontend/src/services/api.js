import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});
export const messageOf = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the AbroadMate server. Start the backend and check the API connection.';
  if (error?.response?.status === 404) return 'The account service was not found. Restart the backend and try again.';
  return 'We could not complete that request. Please try again.';
};
export default api;
