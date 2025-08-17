import { useEffect, useState } from "react";
import { usePinStore } from "../../store/usePinStore";
import PinCard from "../../components/PinCard";

export default function Explore() {
  const { pins, categories, fetchPins } = usePinStore();
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch all pins initially
  useEffect(() => {
    fetchPins();
  }, []);

  // Refetch pins when category changes
  useEffect(() => {
    fetchPins(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Category buttons */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              flex-shrink-0 px-5 py-2 rounded-3xl font-semibold transition-all duration-300
              ${selectedCategory === cat 
                ? "bg-gradient-to-r from-green-500 to-lime-400 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pins grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pins.length > 0 ? (
          pins.map((pin) => <PinCard key={pin.id} pin={pin} />)
        ) : (
          <p className="text-gray-600 dark:text-gray-300 col-span-full text-center mt-10">
            No pins found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
