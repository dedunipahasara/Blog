// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useStore } from "../store";
import toast from "react-hot-toast";
import { FaUser, FaPlusCircle } from 'react-icons/fa'; // Updated to use react-icons
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PinCard from '../components/PinCard';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [userPins, setUserPins] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  const isOwnProfile = user?.username === username;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Step 1: Fetch the profile data for the given username.
        // Assuming a backend endpoint like /api/users/username
        const profileRes = await axios.get(`/api/users/${username}`);
        const fetchedProfile = profileRes.data;
        setProfile(fetchedProfile);

        // Step 2: Fetch followers and following using the fetched profile's ID.
        const [followersRes, followingRes, pinsRes] = await Promise.all([
          axios.get(`/api/users/${fetchedProfile.id}/followers`),
          axios.get(`/api/users/${fetchedProfile.id}/following`),
          axios.get(`/api/users/${fetchedProfile.id}/pins`),
        ]);

        setFollowers(followersRes.data);
        setFollowing(followingRes.data);
        setUserPins(pinsRes.data);

      } catch (e) {
        toast.error("Failed to load profile data.");
        console.error("Error fetching profile data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]); // The effect now only depends on the username in the URL.

  const handleFollow = async () => {
    try {
      await axios.post(`/api/users/follow/${profile.id}`);
      toast.success(`You are now following ${profile.username}`);
      // Update local state to reflect the change
      setFollowers((prev) => [...prev, { id: user.id, username: user.username }]);
    } catch (e) {
      toast.error(e.response?.data || "Failed to follow.");
      console.error("Error following user:", e);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(`/api/users/unfollow/${profile.id}`);
      toast.success(`You have unfollowed ${profile.username}`);
      // Update local state by removing the current user from the followers array
      setFollowers((prev) => prev.filter((f) => f.id !== user.id));
    } catch (e) {
      toast.error(e.response?.data || "Failed to unfollow.");
      console.error("Error unfollowing user:", e);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Profile not found.</div>;
  }

  const isFollowing = followers.some((f) => f.id === user?.id);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl mb-8">
            <img
              src={profile.avatar || 'https://placehold.co/100x100/png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white shadow-md"
            />
            <h1 className="text-4xl font-bold text-gray-800">{profile.username}</h1>
            <p className="text-gray-600 mt-2">{profile.bio || 'No bio available.'}</p>
            <div className="mt-2 text-gray-500">
              <span className="font-semibold">{followers.length}</span> followers • <span className="font-semibold">{following.length}</span> following
            </div>
            {!isOwnProfile && user && (
              <div className="mt-4">
                {isFollowing ? (
                  <button onClick={handleUnfollow} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 transition-colors">
                    Unfollow
                  </button>
                ) : (
                  <button onClick={handleFollow} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 transition-colors">
                    Follow
                  </button>
                )}
              </div>
            )}
            {isOwnProfile && (
              <div className="mt-4 flex space-x-4">
                <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full hover:bg-gray-300">Edit profile</button>
                <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 flex items-center">
                  <FaPlusCircle className="w-5 h-5 mr-2" /> Create Pin
                </button>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pins ({userPins.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {userPins.length > 0 ? (
              userPins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))
            ) : (
              <div className="text-gray-500 col-span-full text-center">No pins found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
