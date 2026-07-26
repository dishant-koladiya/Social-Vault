import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("Verification code sent to your email");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm mb-6">
            We&apos;ve sent a 6-digit verification code to <span className="font-medium text-gray-700">{email}</span>.
            The code expires in 10 minutes.
          </p>
          <button
            onClick={() => navigate(`/verify-otp?email=${encodeURIComponent(email)}`)}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition cursor-pointer"
          >
            Enter Verification Code
          </button>
          <button
            onClick={() => setSent(false)}
            className="w-full py-3 mt-3 text-gray-600 hover:text-gray-800 font-medium transition cursor-pointer"
          >
            Use a different email
          </button>
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
          <h2 className="text-2xl font-bold text-gray-900">Forgot password?</h2>
          <p className="text-gray-500 text-sm mt-1">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className={`w-full pl-11 pr-4 py-2.5 border ${error ? "border-red-400" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition`}
                placeholder="you@example.com"
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-300 disabled:to-purple-300 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Verification Code
              </>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
