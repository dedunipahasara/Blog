import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useStore } from "../store";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      setUser({ username }, res.data.token);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data || "Login failed");
    }
  };

  return (
    <div
      className="relative flex min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/9d/cc/d8/9dccd87fc552bda9db5eca34dbaf8a61.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Left side: text centered vertically and horizontally inside left half */}
      <div className="relative z-10 w-1/2 flex flex-col justify-center items-center text-center text-white px-20">
        <h2 className="text-5xl font-extrabold mb-8 drop-shadow-lg leading-tight">
          Discover your next inspiration
        </h2>
        <p className="text-4xl drop-shadow-md max-w-lg">
          Explore ideas, recipes, style, and more on Sweaty.
        </p>
      </div>

      {/* Right side: smaller login form */}
      <form
        onSubmit={handleLogin}
        className="relative z-20 w-full h-[500px] max-w-sm p-6 backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 rounded-3xl shadow-lg mr-96 ml-auto flex flex-col justify-center self-center"
      >
        <div className="flex justify-center mb-4">
          <img
            src="/sweaty-logo.svg"
            alt="Sweaty Logo"
            className="h-10"
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Welcome to Sweaty
        </h1>
        <p className="text-center text-sm text-white opacity-70 mb-6">
          Find new ideas to try
        </p>

        <input
          type="text"
          placeholder="username"
          className="w-full mb-4 rounded-md px-4 py-3 bg-white bg-opacity-80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 rounded-md px-4 py-3 bg-white bg-opacity-80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link
          to="/forgot-password"
          className="text-right text-xs text-white opacity-70 hover:underline mb-6 block"
        >
          Forgot your password?
        </Link>

        <button
          type="submit"
          className="w-full mb-4 bg-red-500 text-white font-bold py-3 px-4 rounded-full hover:bg-red-600 transition-colors"
        >
          Log in
        </button>

        <p className="text-center text-sm text-gray-300 opacity-70">
          Not on Sweaty yet?{" "}
          <Link to="/signup" className="link  text-purple-700 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
