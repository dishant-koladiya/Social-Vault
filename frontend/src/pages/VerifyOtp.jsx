
import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const { verifyOtp, forgotPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const newOtp = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(email, otpString);
      toast.success("Code verified successfully");
      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${data.resetToken}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid verification code");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!canResend) return;
    try {
      await forgotPassword(email);
      toast.success("New verification code sent");
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend code");
    }
  }, [canResend, email, forgotPassword]);

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <Link to="/forgot-password" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verification code</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter the 6-digit code sent to <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-300 disabled:to-purple-300 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Didn&apos;t receive the code?{" "}
          {canResend ? (
            <button onClick={handleResend} className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer">
              Resend code
            </button>
          ) : (
            <span className="text-gray-400">Resend in {resendTimer}s</span>
          )}
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
