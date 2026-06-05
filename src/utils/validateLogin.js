const validateLogin = (logCredentials) => {
  const newErrors = {};

  if (!logCredentials.email) {
    newErrors.email = 'Email is required';
  }

  if (!logCredentials.password) {
    newErrors.password = 'Password is required';
  }

  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};

export default validateLogin;
