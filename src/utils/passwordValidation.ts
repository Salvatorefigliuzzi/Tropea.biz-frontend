export const validatePassword = (password: string) => {
  const minLength = 10;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors: string[] = [];
  if (password.length < minLength) errors.push("Almeno 10 caratteri");
  if (!hasUpperCase) errors.push("Almeno una lettera maiuscola");
  if (!hasNumber) errors.push("Almeno un numero");
  if (!hasSpecialChar) errors.push("Almeno un carattere speciale");

  return {
    isValid: errors.length === 0,
    errors,
    checks: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasNumber,
      hasSpecialChar
    }
  };
};
