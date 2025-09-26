// Simple JWT auth helper
export function setToken(token) {
  localStorage.setItem('admin_token', token);
}

export function getToken() {
  return localStorage.getItem('admin_token');
}

export function removeToken() {
  localStorage.removeItem('admin_token');
}

export function isAuthenticated() {
  return !!getToken();
}