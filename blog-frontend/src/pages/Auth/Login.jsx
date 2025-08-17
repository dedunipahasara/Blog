import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-6 gap-10">
      
      {/* Left side text */}
      <div className="md:w-1/2 p-12 flex flex-col justify-center">
        <h1 className="text-5xl font-extrabold text-green-800 mb-6 drop-shadow-lg">
          Welcome Back!
        </h1>
        <p className="text-lg text-green-700">
          Discover and share amazing pins, follow your favorite creators, 
          and save what inspires you. Login to continue exploring!
        </p>
      </div>

      {/* Right side login form */}
      <div className="md:w-1/3 p-8 bg-white rounded-3xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">Login</h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />

          <div className="text-right text-sm">
            <a href="/forgot-password" className="text-green-700 hover:underline font-medium">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold shadow-lg transition-all transform hover:scale-105"
          >
            Login
          </button>

          <p className="text-center text-gray-700 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="font-semibold underline text-green-700">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
