import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthConfig = {
    0: { label: "", color: "", width: "0%" },
    1: { label: "Weak", color: "bg-red-500", width: "20%" },
    2: { label: "Fair", color: "bg-orange-500", width: "40%" },
    3: { label: "Good", color: "bg-yellow-500", width: "60%" },
    4: { label: "Strong", color: "bg-lime-500", width: "80%" },
    5: { label: "Very Strong", color: "bg-green-500", width: "100%" },
  };

  const strength = getPasswordStrength(password);
  const config = strengthConfig[strength];

  const validate = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword(resetToken, password);
      setSuccess(true);
      toast.success("Password reset successful");
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password reset successful</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your password has been updated. Redirecting to sign in...
          </p>
          <Link
            to="/sign-in"
            className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition text-center"
          >
            Go to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <Link to="/sign-in" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Reset password</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                className={`w-full pl-11 pr-11 py-2.5 border ${errors.password ? "border-red-400" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

            {password && (
              <div className="mt-2">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${strength >= i ? config.color : "bg-gray-200"}`}
                    />
                  ))}
                </div>
                <p className={`text-xs mt-1 ${strength <= 2 ? "text-red-500" : strength <= 3 ? "text-yellow-600" : "text-green-600"}`}>
                  {config.label}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                className={`w-full pl-11 pr-11 py-2.5 border ${errors.confirmPassword ? "border-red-400" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-300 disabled:to-purple-300 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
