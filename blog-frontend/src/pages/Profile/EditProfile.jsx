import { useEffect, useState } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    profileImageUrl: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user profile
    axios.get("/api/profile").then((res) => {
      setForm({
        fullName: res.data.fullName,
        bio: res.data.bio || "",
        profileImageUrl: res.data.profileImageUrl || ""
      });
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/profile", form);
      toast.success("Profile updated successfully");
      navigate(`/profile/${form.username || ""}`);
    } catch (err) {
      toast.error(err?.response?.data || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-blue-200 p-6">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-4xl shadow-2xl p-10 transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-8">

          <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white">
            Edit Profile
          </h2>

          {/* Profile Image Preview */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 shadow-lg">
              <img
                src={form.profileImageUrl || "/default-avatar.png"}
                alt="Profile Preview"
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Full Name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell something about yourself..."
                rows={4}
                className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm resize-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Profile Image URL
              </label>
              <input
                name="profileImageUrl"
                value={form.profileImageUrl}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-extrabold text-lg rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
