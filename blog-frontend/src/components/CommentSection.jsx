import { useEffect, useState, useRef } from "react";
import { useCommentStore } from "../store/useCommentStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function CommentSection({ pinId }) {
  const { fetchComments, addComment, deleteComment, updateComment, comments } = useCommentStore();
  const { user: authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    fetchComments(pinId);
  }, [pinId, fetchComments]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = () => {
    if (text.trim()) {
      addComment(pinId, text);
      setText("");
    }
  };

  const handleDelete = (commentId) => {
    deleteComment(pinId, commentId);
    setOpenMenuId(null);
  };

  const handleEdit = (comment) => {
    let currentText = "";
    try {
      currentText = JSON.parse(comment.text)?.text || comment.text;
    } catch {
      currentText = comment.text || "";
    }
    setEditingId(comment.id);
    setEditingText(currentText);
    setOpenMenuId(null);
  };

  const handleUpdate = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      await updateComment(pinId, commentId, editingText);
      toast.success("Comment updated!");
      setEditingId(null);
      setEditingText("");
    } catch {
      toast.error("Failed to update comment");
    }
  };

  return (
    <div className="flex flex-col w-full h-full rounded-lg">
      {/* Comments list */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner max-h-[700px]">
        {(!comments[pinId] || comments[pinId].length === 0) && (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
            No comments yet
          </p>
        )}
        {comments[pinId]?.map((comment) => {
          let commentText = "";
          try {
            commentText = JSON.parse(comment.text)?.text || comment.text;
          } catch {
            commentText = comment.text || "";
          }

          const isOwner = authUser?.id === comment.user?.id;

          return (
            <div
              key={comment.id}
              className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition flex flex-col relative"
            >
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={comment.user?.profileImageUrl || "/default-avatar.png"}
                  alt={comment.user?.username || "Unknown"}
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-400 dark:border-green-500"
                />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {comment.user?.username || "Unknown"}
                </span>

                {/* Three-dots menu for owner */}
                {isOwner && editingId !== comment.id && (
                  <div className="ml-auto relative" ref={menuRef}>
                    <button
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                      onClick={() =>
                        setOpenMenuId(openMenuId === comment.id ? null : comment.id)
                      }
                    >
                      ⋮
                    </button>
                    {openMenuId === comment.id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 flex flex-col">
                        <button
                          className="px-4 py-2 text-left text-sm text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleEdit(comment)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleDelete(comment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="mt-2 px-10 flex gap-2">
                  <input
                    className="flex-grow px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700
                               bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none
                               focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300 transition"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button
                    className="px-3 py-2 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition"
                    onClick={() => handleUpdate(comment.id)}
                  >
                    Save
                  </button>
                  <button
                    className="px-3 py-2 bg-gray-300 text-gray-800 rounded-xl shadow-md hover:bg-gray-400 transition"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="ml-10 mt-1 text-gray-700 dark:text-gray-300">{commentText}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add comment */}
      <div className="mt-3 flex gap-2">
        <input
          className="flex-grow px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none
                     focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300 transition placeholder-gray-400"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="px-5 py-2 bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500
                     text-white font-semibold rounded-xl shadow-md transition"
          onClick={handleAdd}
        >
          Post
        </button>
      </div>
    </div>
  );
}
