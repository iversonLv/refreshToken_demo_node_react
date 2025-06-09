import axios from 'axios';
import { getToken, setToken, removeToken, TOKENS } from './utils';
const WHITE_LIST = [ '/auth/login', '/auth/refreshToken' ];
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
import { PATHS } from './paths';

const api = axios.create({
  baseUrl: BASE_URL,
});


api.interceptors.request.use((configs) => {
  const url = new URL(configs.url, BASE_URL);
  const path = url.pathname;

  if (!WHITE_LIST.includes(path)) {
    configs.headers.Authorization = `Bearer ${getToken(TOKENS.ACCESS_TOKEN)}`;
  }
  return configs;
});
api.interceptors.response.use(
  async (res) => {
    if (res.data?.accessToken) {
      setToken(TOKENS.ACCESS_TOKEN, res.data.accessToken);
    }
    if (res.data?.refreshToken) {
      setToken(TOKENS.REFRESH_TOKEN, res.data.refreshToken);
    }
    return res.data  // ** here we only response data of the response object

  },
  async (error) => {
    const config = error.config;

    // To avoid infinite loop, check if the request is for the refresh token endpoint with 401 status
    // _retry is further step for robusting the code to avoid infinite loop if current path is refresh endpoint with 401
    if (error.status === 401 && !config.url.includes(PATHS.REFRESH_TOKEN) && !config._retry) {
      config._retry = true
      // call refreshToken
      try {
        // TOOD: maybe move this to a util function
        await apiPost(PATHS.REFRESH_TOKEN, {}, {
          headers: {
            Authorization: `Bearer ${getToken(TOKENS.REFRESH_TOKEN)}`,
          },
        });
        // Retry the original request with the new access token
        // eg: /users, after intercepting with 401, and then we got new accessToken
        // we can retry the request with the new accessToken
        return api(config);
      } catch (err) {
        // If the refresh token has expired neither, remove all tokens
        // and redirect to login page
        removeToken(TOKENS.ACCESS_TOKEN);
        removeToken(TOKENS.REFRESH_TOKEN);
        console.log('Redirect to login.');
      }
    }
    console.log('Error in response interceptor:', error);
    // If the error is not handled, we can reject the promise with the error
    // The error will propagate to the caller
    // example:
    /**
     * ```js
     * const handleGetuser = async () => {
        try {
          const {users} = await apiGet(PATHS.USERS);
          console.log(users);
        } catch (err) {
          
          console.error('Catch in caller:', err);
          console.log('Status:', err.response?.status);
          console.log('Message:', err.response?.data?.message);
        }
      };
  ```
     * 
     */
    return Promise.reject(error);
  }

);

export default api;

// CRUD
// Because we have a interceptor, so the return obj will be res.data thought intercpetor
/**
 * @description Sends a GET request to the given endpoint.
 *
 * @param {string} url - The relative API endpoint (e.g., '/users').
 * @param {AxiosRequestConfig} [config={}] - Optional Axios config object.
 * @returns {Promise<any>} - The Axios response data.
 *
 * @example
 * ```js
 * const { users } = await apiGet('/users');
 * ```
 */
export const apiGet = async (url, config = {}) => {
  const endPoint = `${BASE_URL}${url}`
  return await api.get(endPoint, config);
}

/**
 * @description Sends a POST request to the given endpoint with data.
 * 
 * @param {string} url - The relative API endpoint (e.g., '/users').
 * @param {Object} [data={}] - The data to send in the request body.
 * @param {AxiosRequestConfig} [config={}] - Optional Axios config object.
 * @return {Promise<any>} - The Axios response data.
 * @example
 * ```js
 * const response = await apiPost('/auth/refreshToken', {}, {});
 * ```
 */
export const apiPost = async (url, data = {}, config = {}) => {
  const endPoint = `${BASE_URL}${url}`
  return await api.post(endPoint, data, config);
}