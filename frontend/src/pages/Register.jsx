import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import validatePassword from "../utils/PasswordValidation";
import API from "../utils/axiosInstance";

const Register = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validation for username
    if (name === "username") {
      if (value.includes(" ") || value.trim() === "" || value.length < 3) {
        setUsernameError(
          "Username must be at least 3 characters with no spaces.",
        );
      } else {
        setUsernameError("");
      }
    }

    // Validation for email
    
if (name === "email") {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (value.includes(" ") || value.trim() === "" || !emailRegex.test(value)) {
    setEmailError("Please enter a valid email address.");
  } else {
    setEmailError("");
  }
}


    // Validation for password
    if (name === "password") {
      const rules = validatePassword(value);
      setPasswordRules(rules);
      const isPassword = Object.values(rules).every(Boolean);

      if (isPassword) {
        setPasswordError("");
      } else {
        setPasswordError("Password does not meet all requirements");
      }
    }

    if (name === "confirmPassword") {
      setPasswordConfirmError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rules = validatePassword(values.password);
    const isPassword = Object.values(rules).every(Boolean);

    if (!isPassword) {
      setPasswordError("Please enter a valid password");
      return;
    }
    setPasswordError("");

    if (values.password !== values.confirmPassword) {
      setPasswordConfirmError("Passwords do not match!");
      return;
    }
    setPasswordConfirmError("");

    try {
      const registerData = {
        username: values.username,
        email: values.email,
        password: values.password,
      };

      const response = await API.post("auth/register", registerData);

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      // FIX: Extracting error message string safely instead of passing object
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      setEmailError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign up to get started with your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Username
            </label>

            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                <User size={18} />
              </span>

              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your username"
                value={values.username}
                onChange={handleChange}
                className={`w-full bg-gray-50/50 border rounded-xl pl-11 pr-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  usernameError
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
            </div>

            {usernameError && (
              <p className="text-rose-500 text-xs mt-1 font-medium">
                {usernameError}
              </p>
            )}
          </div>

          {/* Email Field */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Email Address
            </label>

            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                <Mail size={18} />
              </span>

              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@gmail.com"
                value={values.email}
                onChange={handleChange}
                className={`w-full bg-gray-50/50 border rounded-xl pl-11 pr-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  emailError
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
            </div>

            {emailError && (
              <p className="text-rose-500 text-xs mt-1 font-medium">
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Password
            </label>

            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                <Lock size={18} />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Create a strong password"
                value={values.password}
                onChange={handleChange}
                className={`w-full bg-gray-50/50 border rounded-xl pl-11 pr-12 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  passwordError
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-indigo-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {passwordError && (
              <p className="text-rose-500 text-xs mt-1 font-medium">
                {passwordError}
              </p>
            )}
          </div>

          {/* Password Strength Checklist */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1.5 text-xs">
            <p className="font-semibold text-gray-700 mb-1">
              Password Requirements:
            </p>
            <p
              className={`flex items-center gap-1.5 font-medium ${passwordRules.minLength ? "text-emerald-600" : "text-gray-400"}`}
            >
              {passwordRules.minLength ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}{" "}
              At least 10 characters
            </p>
            <p
              className={`flex items-center gap-1.5 font-medium ${passwordRules.uppercase ? "text-emerald-600" : "text-gray-400"}`}
            >
              {passwordRules.uppercase ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}{" "}
              One uppercase letter
            </p>
            <p
              className={`flex items-center gap-1.5 font-medium ${passwordRules.lowercase ? "text-emerald-600" : "text-gray-400"}`}
            >
              {passwordRules.lowercase ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}{" "}
              One lowercase letter
            </p>
            <p
              className={`flex items-center gap-1.5 font-medium ${passwordRules.number ? "text-emerald-600" : "text-gray-400"}`}
            >
              {passwordRules.number ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}{" "}
              One number
            </p>
            <p
              className={`flex items-center gap-1.5 font-medium ${passwordRules.symbol ? "text-emerald-600" : "text-gray-400"}`}
            >
              {passwordRules.symbol ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}{" "}
              One special character
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={values.confirmPassword}
              id="confirmPassword"
              onChange={handleChange}
              className="w-full bg-gray-50/50 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {passwordConfirmError && (
              <p className="text-rose-500 text-xs mt-1 font-medium">
                {passwordConfirmError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 mt-2"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
