import { useEffect } from "react";
import { useReactionStore } from "../store/useReactionStore";
import { useAuthStore } from "../store/useAuthStore";

// Map reaction types to emojis
const reactionEmojis = {
  LIKE: "👍",
  HEART: "❤️",
  CARE: "🤗",
  SAD: "😢",
  HAHA: "😂",
};

export default function ReactionBar({ pinId }) {
  const { reactToPin, fetchUserReaction, userReactions } = useReactionStore();
  const { user } = useAuthStore();

  // Fetch user reaction on mount
  useEffect(() => {
    if (user) fetchUserReaction(pinId);
  }, [user, pinId, fetchUserReaction]);

  const myReaction = userReactions[pinId];

  return (
    <div className="flex gap-2 mt-2">
      {Object.entries(reactionEmojis).map(([type, emoji]) => {
        const isActive = myReaction === type;

        return (
          <button
            key={type}
            onClick={() => reactToPin(pinId, type)}
            className={`
              flex items-center justify-center gap-1
              px-3 py-2 rounded-full
              border ${isActive ? "border-green-600" : "border-gray-300"} 
              ${isActive ? "bg-green-100 dark:bg-green-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
              transition-all duration-200
              shadow-sm
              text-lg
            `}
          >
            <span>{emoji}</span>
          </button>
        );
      })}
    </div>
  );
}
