import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PinCard from './PinCard';
import toast from 'react-hot-toast';

export default function PinFeed() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/pins');
        // Ensure the response data is an array before setting the state
        if (Array.isArray(response.data)) {
          setPins(response.data);
        } else {
          // Handle non-array response, e.g., set to empty array or log an error
          console.error('API response for pins was not an array:', response.data);
          setPins([]);
        }
      } catch (error) {
        toast.error('Failed to fetch pins.');
        console.error('Error fetching pins:', error);
        setPins([]); // Ensure pins is an array on error
      } finally {
        setLoading(false);
      }
    };
    fetchPins();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading pins...
      </div>
    );
  }

  // The code below is now safe because we ensure `pins` is always an array
  if (pins.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        No pins found.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </div>
    </div>
  );
}
