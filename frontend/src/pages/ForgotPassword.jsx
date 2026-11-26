import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import API from "../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // Backend API call (Yeh route hum abhi backend mein banayenge)
      const response = await API.post('/auth/forgot-password',
        {email}
      )

      if (response.status === 200) {
        setMessage(
          "If an account exists for this email, a reset link will be sent.",
        );
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium text-center">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;