import axios from 'axios';

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to every request automatically
apiClient.interceptors.request.use(
  (config) => {
    // Check localStorage for the user's authentication token
    const token = localStorage.getItem('token');
    
    // Attach authorization header if the token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors securely
    return Promise.reject(error);
  }
);

export default apiClient;
