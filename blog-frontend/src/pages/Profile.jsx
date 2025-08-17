import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import PinCard from "../components/PinCard";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get(`/users/${username}`);
      setProfile(res.data);
    };

    const fetchPins = async () => {
      const res = await api.get(`/pins/user/${username}`);
      setPins(res.data);
    };

    fetchUser();
    fetchPins();
  }, [username]);

  if (!profile) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-6">
        <img src={profile.avatarUrl} className="w-20 h-20 rounded-full" alt="avatar" />
        <div>
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-gray-600">{profile.bio}</p>
          <Link to="/edit-profile" className="text-blue-500 underline text-sm">
            Edit Profile
          </Link>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Pins</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </div>
    </div>
  );
}
