import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function EditPin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState(null);

  useEffect(() => {
    const fetchPin = async () => {
      try {
        const res = await api.get(`/pins/${id}`);
        setPin(res.data);
      } catch (err) {
        toast.error("Failed to load pin.");
      }
    };
    fetchPin();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/pins/${id}`, {
        title: pin.title,
        description: pin.description,
        category: pin.category,
      });
      toast.success("Pin updated!");
      navigate("/dashboard");
    } catch {
      toast.error("Update failed.");
    }
  };

  if (!pin) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <input
        type="text"
        value={pin.title}
        className="input input-bordered w-full my-2"
        onChange={(e) => setPin({ ...pin, title: e.target.value })}
      />
      <textarea
        className="textarea textarea-bordered w-full my-2"
        value={pin.description}
        onChange={(e) => setPin({ ...pin, description: e.target.value })}
      />
      <input
        type="text"
        className="input input-bordered w-full my-2"
        value={pin.category}
        onChange={(e) => setPin({ ...pin, category: e.target.value })}
      />
      <button onClick={handleUpdate} className="btn btn-primary w-full">
        Update Pin
      </button>
    </div>
  );
}
