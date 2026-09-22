const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      }
    );
  } catch (error) {
    const networkError = new Error(
      "Unable to connect to the server."
    );

    networkError.code = "NETWORK_ERROR";

    throw networkError;
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        "Something went wrong. Please try again."
    );

    error.code =
      data?.code || "UNKNOWN_ERROR";

    error.status = response.status;

    throw error;
  }

  return data;
}

const authService = {
  async login(credentials) {
    const response = await request(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    return response.user;
  },

  async signup(userData) {
    const response = await request(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify(userData),
      }
    );

    return response.user;
  },

  async logout() {
    await request("/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser() {
    const response = await request(
      "/auth/me"
    );

    return response.user;
  },


  async changePassword(passwordData) {
  return request(
    "/auth/change-password",
    {
      method: "POST",
      body: JSON.stringify(passwordData),
      }
    );
  },

  async requestPasswordReset(emailData) {
  return request("/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify(emailData),
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