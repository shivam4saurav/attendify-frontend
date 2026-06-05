const validateSignin = (signCredentials) => {
  const newErrors = {};

  if (!signCredentials.name) {
    newErrors.name = 'Name is required';
  }

  if (!signCredentials.email) {
    newErrors.email = 'Email is required';
  }

  if (!signCredentials.password) {
    newErrors.password = 'Password is required';
  } else if (signCredentials.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }

  if (signCredentials.password !== signCredentials.cpassword) {
    newErrors.cpassword = 'Passwords do not match';
  }

  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};

export default validateSignin;