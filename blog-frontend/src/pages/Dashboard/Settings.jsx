import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New password and confirm password do not match");
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success(res.data || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-12 p-8 rounded-3xl shadow-2xl
                    bg-white dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center mb-8
                     text-green-700 dark:text-green-400 transition-colors duration-300">
        Change Password
      </h2>

      <form onSubmit={handleChangePassword} className="space-y-5">
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 p-4 rounded-2xl
                     focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg shadow-sm
                     transition-colors duration-300"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 p-4 rounded-2xl
                     focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg shadow-sm
                     transition-colors duration-300"
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 p-4 rounded-2xl
                     focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg shadow-sm
                     transition-colors duration-300"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500
                     dark:from-green-600 dark:to-green-500 dark:hover:from-green-700 dark:hover:to-lime-600
                     text-white py-4 rounded-3xl font-bold text-lg shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
