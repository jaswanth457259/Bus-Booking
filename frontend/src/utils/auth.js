export const USER_STORAGE_KEY = "user";

export function getStoredUser() {
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!rawUser) {
      return null;
    }

    const parsedUser = JSON.parse(rawUser);
    return parsedUser && parsedUser.id ? parsedUser : null;
  } catch (error) {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function isAuthenticated() {
  return Boolean(getStoredUser());
}

export function isAdmin() {
  return getStoredUser()?.role === "ADMIN";
}
