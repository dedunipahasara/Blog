import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { FaDownload } from 'react-icons/fa'; 

export default function PinCard({ pin }) {
  const { user } = useStore();
  const isVideo = pin.mediaType === 'video';

  return (
    <div className="relative group cursor-zoom-in rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link to={`/pins/${pin.id}`} className="block">
        {isVideo ? (
          <video src={pin.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
        ) : (
          <img src={pin.mediaUrl} alt={pin.title} className="w-full h-full object-cover" />
        )}
      </Link>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-between p-3">
        {/* Top right corner actions */}
        <div className="flex justify-end space-x-2">
          {/* Save button (or similar action) */}
          <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            Save
          </button>
          {/* Download button */}
          <a
            href={pin.mediaUrl}
            download
            onClick={(e) => e.stopPropagation()}
            className="p-2 bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaDownload className="w-4 h-4 text-gray-800" />
          </a>
        </div>
        {/* Bottom left corner user info */}
        <div className="flex items-center space-x-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <img src={pin.author.avatar || 'https://placehold.co/40x40/png'} alt="Author" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-semibold">{pin.author.username}</span>
        </div>
      </div>
    </div>
  );
}
