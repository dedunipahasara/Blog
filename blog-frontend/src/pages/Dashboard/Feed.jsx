import { useEffect } from "react";
import { usePinStore } from "../../store/usePinStore";
import PinCard from "../../components/PinCard";

export default function Feed() {
  const { pins, fetchPins } = usePinStore();

  useEffect(() => {
    fetchPins(); // Fetch all pins for home feed
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pins.map((pin) => (
          <div 
            key={pin.id} 
            className="transform transition-transform duration-300 hover:scale-105"
          >
            <PinCard pin={pin} />
          </div>
        ))}
      </div>
    </div>
  );
}
