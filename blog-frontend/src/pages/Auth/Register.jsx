import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    bio: "",
    profileImageUrl: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", form);
      toast.success("Verification link sent to your email ✨");
      navigate("/verify", { state: { email: form.email } });
    } catch (err) {
      toast.error(err?.response?.data || "Registration failed 😢");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-green-50 to-green-200 p-6 gap-12">

      {/* Left: Form */}
      <div className="md:w-1/3 p-10 bg-white rounded-3xl shadow-2xl border border-green-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-3xl font-extrabold text-black mb-4 text-center drop-shadow-sm">
            Create Account
          </h2>

          {["fullName","username","email","password","bio","profileImageUrl"].map((field) => (
            <input
              key={field}
              name={field}
              type={field === "email" ? "email" : field === "password" ? "password" : "text"}
              placeholder={field === "fullName" ? "Full Name" :
                          field === "username" ? "Username" :
                          field === "email" ? "Email" :
                          field === "password" ? "Password" :
                          field === "bio" ? "Short Bio (optional)" :
                          "Profile Image URL (optional)"}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm text-black"
              required={field !== "bio" && field !== "profileImageUrl"}
            />
          ))}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold shadow-lg transition-transform transform hover:scale-105"
          >
            Register
          </button>

          <p className="text-center text-black text-sm">
            Already have an account?{" "}
            <a href="/login" className="font-semibold underline text-black hover:text-gray-700">
              Login
            </a>
          </p>
        </form>
      </div>

      {/* Right: Welcome text */}
      <div className="md:w-1/2 p-12 flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6 drop-shadow-lg">
          Welcome to <span className="text-black">Sweety!</span>
        </h1>
        <p className="text-lg text-black leading-relaxed">
          Create your account to start sharing amazing pins, follow your favorite creators, 
          and explore inspiring content. <span className="font-semibold">It's free and fun!</span>
        </p>
      </div>
    </div>
  );
}
