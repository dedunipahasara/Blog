import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

// Import videos from your local assets folder
import video1 from "../assets/videos/pinterestdownloader.com-1755051552.062116.mp4";
import video2 from "../assets/videos/pinterestdownloader.com-1755051589.756101.mp4";
import video3 from "../assets/videos/pinterestdownloader.com-1755051624.14241.mp4";
import video4 from "../assets/videos/pinterestdownloader.com-1755051644.019476.mp4";
import video5 from "../assets/videos/pinterestdownloader.com-1755051658.882918.mp4";
import video6 from "../assets/videos/pinterestdownloader.com-1755051683.414774.mp4";
import video7 from "../assets/videos/pinterestdownloader.com-1755051733.259744.mp4";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    bio: "",
    profileImageUrl: "",
  });
  const navigate = useNavigate();

  const videos = [
    video1,
    video2,
    video3,
    video4,
    video5,
    video6,
    video7,
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videoRefs = useRef([]);

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentVideoIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentVideoIndex]);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful! Please verify your email.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Left - Signup Form with dark background only */}
      <div className="w-1/2 flex justify-center p-8">
        <div
          className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-black"
          
        >
          <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-md">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              type="text"
              placeholder="Username"
              className="input input-bordered w-full bg-white text-black placeholder-gray-400 rounded-lg"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input input-bordered w-full bg-white text-black placeholder-gray-400 rounded-lg"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input input-bordered w-full bg-white text-black placeholder-gray-400 rounded-lg"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full bg-white text-black placeholder-gray-400 rounded-lg"
              value={form.fullName}
              onChange={handleChange}
            />
            <input
              name="bio"
              type="text"
              placeholder="Bio"
              className="input input-bordered w-full bg-white text-black placeholder-gray-400 rounded-lg"
              value={form.bio}
              onChange={handleChange}
            />
            <input
              name="profileImageUrl"
              type="text"
              placeholder="Profile Image URL"
              className="input input-bordered w-full bg-white text-black placeholder-gray-400 rounded-lg"
              value={form.profileImageUrl}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="btn  bg-green-400 w-full font-semibold rounded-lg"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Horizontal video carousel and text with no background */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 text-gray-900">
        <div
          className="flex items-center justify-center space-x-4 overflow-visible"
          style={{ maxWidth: "720px", backgroundColor: "transparent" }}
        >
          {videos.map((src, idx) => {
            const isActive = idx === currentVideoIndex;
            const isPrev = idx === (currentVideoIndex - 1 + videos.length) % videos.length;
            const isNext = idx === (currentVideoIndex + 1) % videos.length;

            let width, height, scale, opacity, zIndex;

            if (isActive) {
              width = "400px";
              height = "225px";
              scale = 1.25;
              opacity = 1;
              zIndex = 20;
            } else if (isPrev || isNext) {
              width = "300px";
              height = "170px";
              scale = 1;
              opacity = 0.75;
              zIndex = 15;
            } else {
              width = "220px";
              height = "120px";
              scale = 0.75;
              opacity = 0.5;
              zIndex = 10;
            }

            return (
              <video
                key={idx}
                ref={(el) => (videoRefs.current[idx] = el)}
                src={src}
                muted
                playsInline
                onEnded={isActive ? handleVideoEnded : undefined}
                className="rounded-lg cursor-pointer transition-transform duration-700 ease-in-out"
                style={{
                  width,
                  height,
                  objectFit: "cover",
                  backgroundColor: "transparent",
                  opacity,
                  zIndex,
                  transform: `scale(${scale})`,
                }}
              />
            );
          })}
        </div>

        {/* Text below videos */}
        <div className="mt-6 text-center max-w-md">
          <h2 className="text-4xl font-bold mb-3">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-800">
            Sign up today and start sharing your thoughts, ideas, and creativity
            with the world. Create your profile, connect with others, and enjoy
            a personalized experience.
          </p>
        </div>
      </div>
    </div>
  );
}
