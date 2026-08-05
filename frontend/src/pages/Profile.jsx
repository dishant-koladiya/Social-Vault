import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, X, Save, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, isLoaded, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/sign-in");
    }
  }, [isLoaded, user, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setOriginalEmail(user.email || "");
    }
  }, [user]);

  const handleSaveName = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (name.trim() === user.name) {
      toast("No changes to save");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const openEmailModal = () => {
    setNewEmail(email);
    setCurrentPassword("");
    setPasswordError("");
    setShowEmailModal(true);
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      setPasswordError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setPasswordError("Please enter a valid email");
      return;
    }
    if (newEmail.trim() === originalEmail) {
      setPasswordError("New email is same as current email");
      return;
    }
    if (!currentPassword) {
      setPasswordError("Password is required to change email");
      return;
    }
    setVerifying(true);
    setPasswordError("");
    try {
      const result = await updateProfile({ email: newEmail.trim(), currentPassword });
      setEmail(result.user.email);
      setOriginalEmail(result.user.email);
      setShowEmailModal(false);
      toast.success("Email updated successfully");
    } catch (error) {
      setPasswordError(error?.response?.data?.message || "Failed to update email");
    } finally {
      setVerifying(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=128`}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/60 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-indigo-100 text-sm mt-0.5">{user.email}</p>
                <p className="text-indigo-200 text-xs mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Profile Information</h2>
              <p className="text-sm text-gray-500">Update your personal details</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900"
                      placeholder="Your full name"
                    />
                  </div>
                  <button
                    onClick={handleSaveName}
                    disabled={saving || name.trim() === user.name}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-medium transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                    />
                  </div>
                  <button
                    onClick={openEmailModal}
                    className="px-5 py-2.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition cursor-pointer shrink-0"
                  >
                    Change
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Email change requires password verification</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Your information is securely stored and never shared with third parties.
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEmailModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">Change Email</h3>
              <p className="text-sm text-gray-500 mt-1">Enter your new email and current password to verify</p>
            </div>

            <form onSubmit={handleChangeEmail} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => { setNewEmail(e.target.value); setPasswordError(""); }}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900"
                    placeholder="new@example.com"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(""); }}
                    className={`w-full pl-11 pr-11 py-2.5 border ${passwordError ? "border-red-400" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-300 disabled:to-purple-300 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {verifying ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Update Email"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;