import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    try {
      await api.post("/auth/forgot-password/send-otp", null, { params: { email } });
      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch (e) {
      toast.error(e.response?.data || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await api.post("/auth/forgot-password/verify-otp", { email, otp, newPassword });
      toast.success("Password reset successful");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setOtpSent(false);
    } catch (e) {
      toast.error(e.response?.data || "Invalid OTP or error resetting password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card p-6 shadow-md bg-base-100 w-96 space-y-3">
        {!otpSent ? (
          <>
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={sendOtp} className="btn btn-primary w-full">
              Send OTP
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <input
              type="text"
              placeholder="Enter OTP"
              className="input input-bordered w-full"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="input input-bordered w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button onClick={verifyOtp} className="btn btn-primary w-full">
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
