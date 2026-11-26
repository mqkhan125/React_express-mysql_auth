import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import API from "../utils/axiosInstance";
import { toast } from "react-toastify";
import validatePassword from "../utils/PasswordValidation";

export default function ResetPassword() {
  const { userId, token } = useParams(); // 1. URL se id aur token nikalna
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match check
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!Object.values(validatePassword(password)).every(Boolean)) {
      setError(
        "Password must be at least 10 characters and include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 2. Backend ko ID, Token aur Naya Password bhejna
     const response = await API.post(
       `/auth/reset-password/${userId}/${token}`,
       {
         password,
       },
     );
      if (response.status === 200) {
        setMessage("Password reset successfully! Redirecting to login...");
       
        toast.success(
          "Password reset successfully! Please login with your new password.",
        );

        setTimeout(() => {
          navigate("/login"); // 3 seconds baad login page par bhej dena
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
      <p className="text-sm text-gray-500 mb-6">
        Please enter your new password below.
      </p>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle size={18} /> {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
