export const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PHONE_REGEX =
  /^\+?[0-9\s()-]{7,20}$/;

export const PASSWORD_RULES = {
  minLength: 8,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

export function validateEmail(email) {
  if (!email.trim()) {
    return "Email is required.";
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return "Enter a valid email address.";
  }

  return "";
}

export function validatePhone(phone) {
  if (!phone.trim()) {
    return "Phone number is required.";
  }

  if (!PHONE_REGEX.test(phone.trim())) {
    return "Enter a valid phone number.";
  }

  return "";
}

export function validatePassword(password) {
  if (!password) {
    return "Password is required.";
  }

  if (
    password.length <
    PASSWORD_RULES.minLength
  ) {
    return "Password must be at least 8 characters.";
  }

  if (!PASSWORD_RULES.uppercase.test(password)) {
    return "Password must contain an uppercase letter.";
  }

  if (!PASSWORD_RULES.lowercase.test(password)) {
    return "Password must contain a lowercase letter.";
  }

  if (!PASSWORD_RULES.number.test(password)) {
    return "Password must contain a number.";
  }

  if (!PASSWORD_RULES.special.test(password)) {
  return "Password must contain a special character.";
  }

  return "";
}

export function validateConfirmPassword(
  password,
  confirmPassword
) {
  if (!confirmPassword) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
}

export function validateName(name, fieldName) {
  if (!name.trim()) {
    return `${fieldName} is required.`;
  }

  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters.`;
  }

  return "";
}