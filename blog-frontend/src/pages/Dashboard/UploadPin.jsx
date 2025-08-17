import { useState } from "react";
import { usePinStore } from "../../store/usePinStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UploadPin() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const uploadPin = usePinStore((state) => state.uploadPin);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    try {
      await uploadPin(formData);
      toast.success("Pin uploaded successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to upload pin");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto mt-12 p-10 bg-white rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700">Upload New Pin</h2>

      {/* File Input */}
      <label className="block mb-6 cursor-pointer">
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 p-20 rounded-2xl hover:border-green-600 hover:bg-green-50 transition">
          {file ? (
            <span className="text-lg font-medium">{file.name}</span>
          ) : (
            <span className="text-gray-400 text-lg">Click to select an image or video</span>
          )}
        </div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          accept="image/*,video/*"
        />
      </label>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 p-4 rounded-2xl mb-5 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg"
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 p-4 rounded-2xl mb-5 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg resize-none"
        rows={4}
      />

      {/* Category */}
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-300 p-4 rounded-2xl mb-8 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg"
      />

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-white py-4 rounded-3xl font-bold text-lg transition-all shadow-lg"
      >
        Upload Pin
      </button>
    </div>
  );
}
