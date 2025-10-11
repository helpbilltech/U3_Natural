// Token management
const TOKEN_KEY = 'admin_token';
const TOKEN_EXPIRY_KEY = 'admin_token_expiry';

export function setToken(token) {
  // Set token expiry to 24 hours from now
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toISOString());
}

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  // Check if token exists and hasn't expired
  if (!token || !expiry) {
    return null;
  }
  
  const expiryDate = new Date(expiry);
  if (expiryDate < new Date()) {
    // Token has expired, remove it
    removeToken();
    return null;
  }
  
  return token;
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

// Check if token is about to expire (within 1 hour)
export function isTokenExpiringSoon() {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  
  const expiryDate = new Date(expiry);
  const oneHourFromNow = new Date();
  oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
  
  return expiryDate < oneHourFromNow;
}