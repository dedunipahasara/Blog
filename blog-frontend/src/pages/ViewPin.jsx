import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ViewPin() {
  const { id } = useParams();
  const [pin, setPin] = useState(null);

  useEffect(() => {
    const fetchPin = async () => {
      try {
        const res = await api.get(`/pins/${id}`);
        setPin(res.data);
      } catch {
        toast.error("Failed to fetch pin.");
      }
    };
    fetchPin();
  }, [id]);

  if (!pin) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <img src={pin.imageUrl} alt={pin.title} className="rounded-xl w-full mb-4" />
      <h2 className="text-2xl font-bold">{pin.title}</h2>
      <p className="text-sm text-gray-500">Category: {pin.category}</p>
      <p className="mt-2">{pin.description}</p>

      {/* Add reactions, share links, and comment components here */}
    </div>
  );
}
