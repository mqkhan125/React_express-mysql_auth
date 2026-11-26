const validatePassword = (password) => {


  return {
    minLength: password.length >= 10,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number : /[0-9]/.test(password),
    symbol: /[\W_]/.test(password),
  };
};

export default validatePassword;
