import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuthStore } from "../store/useAuthStore";

export default function FollowButton({ userId }) {
  const { user: authUser } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!authUser || authUser.id === userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`/profile/${userId}/followers`);
        setIsFollowing(res.data.some(f => f.id === authUser.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkFollowStatus();
  }, [userId, authUser]);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await axios.post(`/profile/unfollow/${userId}`);
      } else {
        await axios.post(`/profile/follow/${userId}`);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!authUser || authUser.id === userId) return null;

  return (
    <button
      disabled={loading}
      onClick={toggleFollow}
      className={`
        px-4 py-1 rounded-full font-semibold text-white shadow-md transition-all duration-300
        ${isFollowing
          ? "bg-gray-500 hover:bg-gray-600"
          : "bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500"
        }
        ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
