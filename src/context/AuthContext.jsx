
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../features/authentication/services/authService";

const AuthContext = createContext(null);

const CACHED_USER_KEY = "pos-auth-user";

function getCachedUser() {
  try {
    const cachedUser = localStorage.getItem(CACHED_USER_KEY);

    if (!cachedUser) {
      return null;
    }

    return JSON.parse(cachedUser);
  } catch (error) {
    console.error("Failed to read cached user:", error);
    return null;
  }
}

function cacheUser(userData) {
  try {
    if (userData) {
      localStorage.setItem(
        CACHED_USER_KEY,
        JSON.stringify(userData)
      );
    }
  } catch (error) {
    console.error("Failed to cache user:", error);
  }
}

function clearCachedUser() {
  try {
    localStorage.removeItem(CACHED_USER_KEY);
  } catch (error) {
    console.error("Failed to clear cached user:", error);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const currentUser = await authService.getCurrentUser();

        if (isMounted) {
          setUser(currentUser);

          if (currentUser) {
            cacheUser(currentUser);
          } else {
            clearCachedUser();
          }
        }
      } catch (error) {
        if (error?.code === "NETWORK_ERROR") {
          // Use the cached profile only when the server
          // cannot be reached due to a network failure.
          const cachedUser = getCachedUser();

          if (isMounted) {
            setUser(cachedUser);
          }
        } else {
          if (error?.code !== "UNAUTHORIZED") {
            console.error(
              "Failed to restore authentication:",
              error
            );
          }

          // A server rejection must not restore an old profile.
          clearCachedUser();

          if (isMounted) {
            setUser(null);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    cacheUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearCachedUser();
      setUser(null);
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      isAdmin,
      isUser,
      hasRole,
      login,
      logout,
    }),
    [user, isLoading, isAdmin, isUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
