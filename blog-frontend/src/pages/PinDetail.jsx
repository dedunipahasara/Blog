// src/pages/PinDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaHeart, FaShareAlt, FaLink, FaDownload } from 'react-icons/fa';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function PinDetail() {
  const { id } = useParams();
  const [pin, setPin] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [shareLinks, setShareLinks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPinDetails = async () => {
      try {
        const [pinRes, commentsRes] = await Promise.all([
          axios.get(`/api/pins/${id}`),
          axios.get(`/api/pins/${id}/comments`),
        ]);
        setPin(pinRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        toast.error('Failed to load pin details.');
        console.error("Error fetching pin details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPinDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const response = await axios.post(`/api/pins/${id}/comments`, { text: newCommentText });
      setComments([...comments, response.data]);
      setNewCommentText('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment.');
      console.error("Error adding comment:", error);
    }
  };

  const handleReact = async () => {
    try {
      await axios.post(`/api/pins/${id}/react`, { type: 'LIKE' });
      toast.success('Pin liked and saved to favourites!');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to react to pin.');
      console.error("Error reacting to pin:", error);
    }
  };

  const handleShare = async () => {
    try {
      const res = await axios.get(`/api/pins/${id}/share`);
      setShareLinks(res.data);
    } catch (error) {
      toast.error('Failed to get share links.');
      console.error("Error getting share links:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!pin) {
    return <div className="flex items-center justify-center min-h-screen">Pin not found.</div>;
  }

  const isVideo = pin.mediaType === 'video';

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden">
            {/* Media section */}
            <div className="md:w-1/2 flex-shrink-0">
              {isVideo ? (
                <video src={pin.mediaUrl} className="w-full h-full object-cover" controls autoPlay loop muted />
              ) : (
                <img src={pin.mediaUrl} alt={pin.title} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Details and comments section */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-end space-x-2 mb-4">
                  <a href={pin.mediaUrl} download className="p-3 bg-gray-200 rounded-full hover:bg-gray-300">
                    <FaDownload className="w-5 h-5 text-gray-800" />
                  </a>
                  <button onClick={handleShare} className="p-3 bg-gray-200 rounded-full hover:bg-gray-300">
                    <FaShareAlt className="w-5 h-5 text-gray-800" />
                  </button>
                </div>

                {shareLinks && (
                  <div className="mb-6 p-4 bg-gray-100 rounded-xl space-y-2">
                    <h4 className="font-semibold text-gray-700">Share this Pin</h4>
                    <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <FaLink className="mr-2" /> WhatsApp Link
                    </a>
                    <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <FaLink className="mr-2" /> Facebook Link
                    </a>
                    <p className="text-sm text-gray-500">Direct link: {shareLinks.link}</p>
                  </div>
                )}
                
                <h1 className="text-4xl font-bold text-gray-800">{pin.title}</h1>
                <p className="text-gray-600 mt-4">{pin.description}</p>

                <div className="flex items-center mt-6 space-x-4">
                  <Link to={`/profile/${pin.author.username}`} className="flex items-center space-x-2">
                    <img src={pin.author.avatar || 'https://placehold.co/40x40/png'} alt="Author" className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-semibold text-gray-700 hover:underline">{pin.author.username}</span>
                  </Link>
                  <button onClick={handleReact} className="flex items-center p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                    <FaHeart className="w-5 h-5" />
                    <span className="ml-2 font-semibold">React</span>
                  </button>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Comments</h3>
                  <div className="h-48 overflow-y-auto pr-2 space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="p-4 bg-gray-50 rounded-xl">
                          <p className="font-semibold text-gray-700">{comment.username}</p>
                          <p className="text-gray-600 mt-1">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No comments yet. Be the first!</p>
                    )}
                  </div>
                  <form onSubmit={handleAddComment} className="mt-6 flex">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 p-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 text-white font-semibold px-6 rounded-r-full hover:bg-red-700 transition-colors"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
