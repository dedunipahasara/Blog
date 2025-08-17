import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuthStore } from "../../store/useAuthStore";
import { useReactionStore } from "../../store/useReactionStore";
import PinCard from "../../components/PinCard";

export default function ViewProfile() {
  const { username } = useParams();
  const { user: authUser } = useAuthStore();
  const { favourites, fetchFavourites } = useReactionStore();
  const [user, setUser] = useState(null);
  const [userPins, setUserPins] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("pins");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let profileData = null;

        if (authUser && authUser.username === username) {
          profileData = authUser;
          const pinsRes = await axios.get("/pins/my-pins");
          const mappedPins = pinsRes.data.map(p => ({
            ...p,
            fileUrl: `http://localhost:8081${p.mediaUrl}`,
            fileType: p.mediaType,
          }));
          setUserPins(mappedPins);
          await fetchFavourites();
        } else {
          const profileRes = await axios.get(`/profile/search?username=${username}`);
          profileData = Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data;

          if (!profileData) {
            setUser(null);
            setUserPins([]);
            return;
          }

          const pinsRes = await axios.get(`/pins/user/${profileData.username}`);
          const mappedPins = pinsRes.data.map(p => ({
            ...p,
            fileUrl: `http://localhost:8081${p.mediaUrl}`,
            fileType: p.mediaType,
          }));
          setUserPins(mappedPins);
        }

        setUser(profileData);

        const countsRes = await Promise.all([
          axios.get(`/profile/${profileData.id}/followers/count`),
          axios.get(`/profile/${profileData.id}/following/count`)
        ]);

        setFollowersCount(countsRes[0].data.followersCount || 0);
        setFollowingCount(countsRes[1].data.followingCount || 0);

      } catch (err) {
        console.error(err);
        setUser(null);
        setUserPins([]);
      }
    };

    fetchProfile();
  }, [username, authUser, fetchFavourites]);

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Profile Header Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <img
          src={user.profileImageUrl || "/default-avatar.png"}
          alt={user.username}
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-extrabold">{user.fullName}</h2>
          <p className="text-white/80 mt-1">@{user.username}</p>
          <p className="mt-2 text-white/90">{user.bio}</p>

          <div className="flex justify-center md:justify-start gap-6 mt-4 text-white/90 font-medium">
            <span><strong>{followersCount}</strong> Followers</span>
            <span><strong>{followingCount}</strong> Following</span>
          </div>

          {authUser?.username === username && (
            <button
              onClick={() => navigate(`/profile/${user.username}/edit`)}
              className="mt-4 px-6 py-2 bg-white text-green-600 font-semibold rounded-full shadow hover:scale-105 transition-transform"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 justify-center md:justify-start">
        <button
          className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${activeTab === "pins" ? "bg-white text-green-600 shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("pins")}
        >
          Pins
        </button>
        {authUser?.username === username && (
          <button
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${activeTab === "favourites" ? "bg-white text-green-600 shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            onClick={() => setActiveTab("favourites")}
          >
            Favourites
          </button>
        )}
      </div>

      {/* Content */}
      <div>
        {activeTab === "pins" ? (
          <>
            {userPins.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">No pins yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {userPins.map((pin) => (
                  <PinCard key={pin.id} pin={pin} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {favourites.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">No favourite pins</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {favourites.map((pin) => (
                  <PinCard key={pin.id} pin={pin} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
