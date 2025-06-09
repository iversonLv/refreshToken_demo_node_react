export const getToken = key => localStorage.getItem(key);
export const removeToken = key => localStorage.removeItem(key);
export const setToken = (key, value) => localStorage.setItem(key, value);

export const TOKENS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken'
}