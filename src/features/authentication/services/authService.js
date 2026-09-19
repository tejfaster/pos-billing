const authService = {
  async login(credentials) {
    /*
     * Backend API will be connected here later.
     *
     * Example future request:
     *
     * POST /auth/login
     *
     * {
     *   email,
     *   password
     * }
     */

    throw new Error(
      "Authentication backend is not connected yet."
    );
  },

  async signup(userData) {
    /*
     * Backend API will be connected here later.
     *
     * Important:
     * role and status are NOT accepted from
     * the signup form.
     *
     * The backend will create:
     *
     * role: "user"
     * status: "active"
     */

    throw new Error(
      "Authentication backend is not connected yet."
    );
  },

  async logout() {
    /*
     * Backend session logout will be connected here later.
     */

    throw new Error(
      "Authentication backend is not connected yet."
    );
  },

  async getCurrentUser() {
    /*
     * Backend session verification will be connected here later.
     */

    throw new Error(
      "Authentication backend is not connected yet."
    );
  },
};

export default authService;