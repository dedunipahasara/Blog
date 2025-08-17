import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import toast from "react-hot-toast";

export default function Verify() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code) return toast.error("Please enter the verification code");

    try {
      await axios.get(`/auth/verify?code=${code}`);
      toast.success("✅ Account verified! You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data || "❌ Verification failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-6">
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">
        <h2 className="text-2xl font-extrabold text-center text-green-800 mb-4 drop-shadow-md">
          ✉️ Verify Your Account
        </h2>
        <p className="text-center text-green-700 mb-6">
          Enter the verification code sent to your email.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-4 rounded-2xl border-2 border-white/40 bg-white/20 text-green-900 placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold shadow-lg transition-all transform hover:scale-105"
          >
            ✅ Verify
          </button>
        </form>

        <p className="text-center text-green-800 mt-4 text-sm">
          Didn't receive the code?{" "}
          <a
            href="/resend-verification"
            className="font-medium underline hover:text-green-900"
          >
            Resend
          </a>
        </p>
      </div>
    </div>
  );
}
