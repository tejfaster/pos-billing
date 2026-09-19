const AUTH_ERROR_MESSAGES = {
  EMAIL_ALREADY_EXISTS:
    "This email address is already registered.",

  PHONE_ALREADY_EXISTS:
    "This phone number is already registered.",

  INVALID_CREDENTIALS:
    "Invalid email or password.",

  ACCOUNT_DISABLED:
    "Your account has been disabled. Please contact an administrator.",

  NETWORK_ERROR:
    "Unable to connect to the server. Please try again.",

  UNKNOWN_ERROR:
    "Something went wrong. Please try again.",
};

export function getAuthErrorMessage(error) {
  const code = error?.code;

  return (
    AUTH_ERROR_MESSAGES[code] ||
    AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
  );
}