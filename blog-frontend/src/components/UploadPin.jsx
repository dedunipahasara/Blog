import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useStore } from "../store"; // Assuming you have a global store for user state

const categories = [
  "Nature",
  "Food",
  "Travel",
  "Art",
  "Technology",
  "Fashion",
  "Other",
];

export default function UploadPin() {
  const { user } = useStore(); // Get the user object from the store
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an image or video file to upload.");
      return;
    }
    
    // Ensure the user is authenticated before attempting to upload
    if (!user || !user.token) {
      toast.error("You must be logged in to upload a pin.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    try {
      setLoading(true);
      const response = await axios.post("/api/pins", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${user.token}` // Add the JWT to the Authorization header
        },
      });

      toast.success("Pin uploaded successfully!");
      // Reset form fields
      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("");
    } catch (error) {
      toast.error(
        error.response?.data || "Failed to upload pin. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.token) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500">
        <h2 className="text-2xl font-bold mb-4">Create Pin</h2>
        <p>Please log in to upload a pin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Pin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Upload Image or Video</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            placeholder="Add a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            placeholder="Add a detailed description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Choose a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Save Pin"}
        </button>
      </form>
    </div>
  );
}
