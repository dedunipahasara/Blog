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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-extrabold text-center text-purple-700 dark:text-purple-400 mb-4">
          ✉️ Verify Your Account
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Enter the verification code sent to your email.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-gray-100 transition"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold shadow-lg transition-all"
          >
            ✅ Verify
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          Didn't receive the code?{" "}
          <a href="/resend-verification" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
            Resend
          </a>
        </p>
      </div>
    </div>
  );
}
