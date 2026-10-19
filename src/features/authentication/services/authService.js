const API_URL = import.meta.env.VITE_API_URL || "/api";
const DEFAULT_TIMEOUT_MS = 30000;

function createError(message, code, status) {
  const error = new Error(message);
  error.code = code;

  if (status) {
    error.status = status;
  }

  return error;
}

function codeFromStatus(status) {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN_ERROR";
}

async function request(endpoint, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      signal: controller.signal,
      credentials: "include",
      headers: {
        ...(fetchOptions.body ? { "Content-Type": "application/json" } : {}),
        ...(fetchOptions.headers || {}),
      },
    });
  } catch {
    throw createError("Unable to connect to the server.", "NETWORK_ERROR");
  } finally {
    clearTimeout(timer);
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw createError(
      data?.message || "Something went wrong. Please try again.",
      data?.code || codeFromStatus(response.status),
      response.status
    );
  }

  return data;
}

const authService = {
  async login(credentials) {
    const response = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Confirm the browser actually kept the session cookie.
    try {
      await request("/auth/me", { timeoutMs: 8000 });
    } catch (error) {
      if (error.code === "UNAUTHORIZED") {
        throw createError(
          "Login succeeded but the browser blocked the session cookie.",
          "COOKIE_BLOCKED",
          401
        );
      }
      // Network error or 5xx: don't fail the login because of the check.
    }

    return response?.user;
  },

  async signup(userData) {
    const response = await request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return response?.user;
  },

  async logout() {
    await request("/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser() {
    const response = await request("/auth/me", { timeoutMs: 5000 });

    return response?.user ?? null;
  },

  async changePassword(passwordData) {
    return request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    });
  },

  async requestPasswordReset(emailData) {
    return request("/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify(emailData),
    });
  },

  async verifyPasswordResetOtp(otpData) {
    return request("/auth/password-reset/verify", {
      method: "POST",
      body: JSON.stringify(otpData),
    });
  },

  async confirmPasswordReset(resetData) {
    return request("/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify(resetData),
    });
  },
};

export default authService;