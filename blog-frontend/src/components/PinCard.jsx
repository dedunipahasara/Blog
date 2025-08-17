import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function PinCard({ pin }) {
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  const isVideo = pin.fileType?.includes("video"); 
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      if (!authUser || !pin.author || authUser.id === pin.author.id) return;
      try {
        const res = await axios.get(`/profile/${pin.author.id}/followers`);
        setIsFollowing(res.data.some(f => f.id === authUser.id));
      } catch (err) {
        console.error(err);
      }
    };
    checkFollowing();
  }, [authUser, pin.author]);

  const handleFollow = async (e) => {
    e.stopPropagation(); 
    try {
      if (isFollowing) {
        await axios.post(`/profile/unfollow/${pin.author.id}`);
      } else {
        await axios.post(`/profile/follow/${pin.author.id}`);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer bg-white dark:bg-gray-900 transition-all duration-300"
      onClick={() => navigate(`/pin/${pin.id}`)}
    >
      {/* Media */}
      {isVideo ? (
        <video
          src={pin.fileUrl}
          className="w-full h-64 object-cover rounded-t-3xl"
          controls
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={pin.fileUrl}
          alt={pin.title}
          className="w-full h-64 object-cover rounded-t-3xl"
        />
      )}

      {/* Pin info */}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{pin.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{pin.category}</p>

        {/* Uploader info + follow */}
        {pin.author && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <img
                src={pin.author.profileImageUrl || "/default-avatar.png"}
                alt={pin.author.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                @{pin.author.username}
              </span>
            </div>
            {authUser && authUser.id !== pin.author.id && (
              <button
                onClick={handleFollow}
                className={`px-4 py-1 rounded-2xl font-semibold text-white transition-all duration-300 shadow ${
                  isFollowing 
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
