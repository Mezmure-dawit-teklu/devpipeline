// auth.js

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const getRoles = () => {
  try {
    const roles = localStorage.getItem("roles");
    if (!roles || roles === "undefined") return [];
    return JSON.parse(roles);
  } catch {
    return [];
  }
};

export const isLoggedIn = () => {
  return getUser() !== null;
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("roles");
};