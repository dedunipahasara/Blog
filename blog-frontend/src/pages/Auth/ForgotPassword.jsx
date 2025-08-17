import { useState } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    try {
      // Send email as query parameter to match backend
      await axios.post(`/auth/forgot-password/send-otp?email=${encodeURIComponent(email)}`);
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data || "Failed to send OTP");
    }
  };

  // Step 2: Verify OTP and reset password
  const handleVerifyOtp = async () => {
    try {
      await axios.post("/auth/forgot-password/verify-otp", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password updated successfully!");
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-200 to-blue-200 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl space-y-6 transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
          Reset Password
        </h2>

        {/* Step Indicator */}
        <div className="flex justify-center gap-3 mb-4">
          <span className={`w-4 h-4 rounded-full ${step >= 1 ? "bg-green-500" : "bg-gray-300"}`}></span>
          <span className={`w-4 h-4 rounded-full ${step >= 2 ? "bg-green-500" : "bg-gray-300"}`}></span>
          <span className={`w-4 h-4 rounded-full ${step >= 3 ? "bg-green-500" : "bg-gray-300"}`}></span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={handleSendOtp}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Verify & Update
            </button>
          </div>
        )}

        {step === 3 && (
          <p className="text-center text-green-600 text-lg font-semibold">
            Password reset successful! You can now login.
          </p>
        )}
      </div>
    </div>
  );
}
