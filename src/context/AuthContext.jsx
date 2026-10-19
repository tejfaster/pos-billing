import {
  createContext,
  useCallback,
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
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(userData));
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

  // Restore the session on startup.
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
        if (error?.code === "UNAUTHORIZED") {
          // Only an explicit server rejection ends the session.
          clearCachedUser();

          if (isMounted) {
            setUser(null);
          }
        } else {
          // Network error, timeout, cold start (5xx), or anything else:
          // keep working from the cached profile.
          console.error("Failed to restore authentication:", error);

          if (isMounted) {
            setUser(getCachedUser());
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

  // Re-validate the session when the connection returns.
  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let isMounted = true;

    async function revalidate() {
      try {
        const currentUser = await authService.getCurrentUser();

        if (isMounted && currentUser) {
          setUser(currentUser);
          cacheUser(currentUser);
        }
      } catch (error) {
        if (error?.code === "UNAUTHORIZED") {
          clearCachedUser();

          if (isMounted) {
            setUser(null);
          }
        }
        // Any other error: stay logged in on the cached profile.
      }
    }

    window.addEventListener("online", revalidate);

    return () => {
      isMounted = false;
      window.removeEventListener("online", revalidate);
    };
  }, [user]);

  const login = useCallback((userData) => {
    setUser(userData);
    cacheUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearCachedUser();
      setUser(null);
    }
  }, []);

  const hasRole = useCallback((role) => user?.role === role, [user]);

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
    [user, isLoading, isAdmin, isUser, hasRole, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}