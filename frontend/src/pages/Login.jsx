import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import API from "../utils/axiosInstance";
import { toast } from "react-toastify";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!values.email.trim() || !values.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/login', values)
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        //  Success Toast
        toast.success("Login successful! Welcome back.");
        navigate("/home");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Please sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmit} className="space-y-5">
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
                value={values.email}
                placeholder="example@gmail.com"
                onChange={handleChange}
                autoComplete="email"
                className={`w-full bg-gray-50/50 border rounded-xl pl-11 pr-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
            </div>
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
                value={values.password}
                placeholder="Enter your password"
                onChange={handleChange}
                autoComplete="current-password"
                className={`w-full bg-gray-50/50 border rounded-xl pl-11 pr-12 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-emerald-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-end mt-3">
              <Link
                to="/forgot-password"
                className="text-emerald-600 hover:underline font-medium text-sm"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
