import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePinStore } from "../../store/usePinStore";
import ReactionBar from "../../components/ReactionBar";
import CommentSection from "../../components/CommentSection";
import ShareButton from "../../components/ShareButton";
import FollowButton from "../../components/FollowButton";
import axios from "../../api/axios";

export default function PinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pins } = usePinStore();
  const [pin, setPin] = useState(null);
  const [reactionCounts, setReactionCounts] = useState({});
  const [commentCount, setCommentCount] = useState(0);

  const currentIndex = pins.findIndex(p => p.id === Number(id));

  useEffect(() => {
    const loadPin = async () => {
      let existingPin = pins.find(p => p.id === Number(id));
      if (!existingPin) {
        try {
          const res = await axios.get(`/pins/${id}`);
          existingPin = res.data;
        } catch (err) {
          console.error(err);
          return;
        }
      }

      if (!existingPin.user && existingPin.userId) {
        try {
          const userRes = await axios.get(`/profile/${existingPin.userId}`);
          existingPin.user = userRes.data;
        } catch (err) {
          console.error(err);
        }
      }

      existingPin = {
        ...existingPin,
        fileUrl: `http://localhost:8081${existingPin.mediaUrl}`,
        fileType: existingPin.mediaType,
      };

      setPin(existingPin);
    };

    loadPin();
  }, [id, pins]);

  useEffect(() => {
    if (!pin) return;

    const fetchCounts = async () => {
      try {
        const [reactionRes, commentRes] = await Promise.all([
          axios.get(`/reactions/count?pinId=${pin.id}`),
          axios.get(`/comments/count?pinId=${pin.id}`)
        ]);
        setReactionCounts(reactionRes.data);
        setCommentCount(commentRes.data || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounts();
  }, [pin]);

  const handleNextPin = () => {
    if (currentIndex < pins.length - 1) {
      navigate(`/pin/${pins[currentIndex + 1].id}`);
    }
  };

  const handlePreviousPin = () => {
    if (currentIndex > 0) {
      navigate(`/pin/${pins[currentIndex - 1].id}`);
    }
  };

  if (!pin) return <p className="text-center mt-10 text-gray-600 dark:text-gray-300">Loading pin...</p>;

  const isVideo = pin.fileType?.includes("video");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Pin + info */}
        <div className="flex-1 max-w-3xl mx-auto space-y-5">
          {/* Author Info */}
          {pin.user && (
            <div className="flex items-center justify-between mb-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={pin.user.profileImageUrl || "/default-avatar.png"}
                  alt={pin.user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                />
                <span className="font-semibold text-gray-800 dark:text-gray-100">@{pin.user.username}</span>
              </div>
              <FollowButton userId={pin.user.id} />
            </div>
          )}

          {/* Pin Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pin.title}</h2>

          {/* Media */}
          <div className="w-full rounded-2xl overflow-hidden shadow-lg">
            {isVideo ? (
              <video
                src={pin.fileUrl}
                controls
                className="w-full h-[600px] object-cover rounded-2xl"
              />
            ) : (
              <img
                src={pin.fileUrl}
                alt={pin.title}
                className="w-full h-[600px] object-cover rounded-2xl"
              />
            )}
          </div>

          {/* Description */}
          {pin.description && <p className="text-gray-700 dark:text-gray-300 mt-3">{pin.description}</p>}

          {/* Reactions + Share */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <ReactionBar pinId={pin.id} />
            <ShareButton pinId={pin.id} />
          </div>

          {/* Reaction Counts */}
          <div className="flex gap-6 mt-3 text-gray-600 dark:text-gray-300">
            {Object.entries(reactionCounts).map(([type, count]) => (
              <span key={type} className="capitalize">
                <strong>{count}</strong> {type}
              </span>
            ))}
            <span>
              <strong>{commentCount}</strong> Comments
            </span>
          </div>
        </div>

        {/* Middle: Navigation arrows */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-4">
          {currentIndex > 0 && (
            <button
              onClick={handlePreviousPin}
              className="p-4 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
            >
              &#8593;
            </button>
          )}
          {currentIndex < pins.length - 1 && (
            <button
              onClick={handleNextPin}
              className="p-4 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
            >
              &#8595;
            </button>
          )}
        </div>

        {/* Right: Comments */}
        <div className="w-full lg:w-1/3 max-h-[650px] overflow-y-auto">
          <CommentSection pinId={pin.id} />
        </div>
      </div>
    </div>
  );
}
