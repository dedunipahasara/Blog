import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PinFeed from '../components/PinFeed';
import UploadPin from '../components/UploadPin'; // This is your original component

export default function Home() {
  // A simple state to toggle between the feed and the upload page
  const [view, setView] = useState('feed');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* The Sidebar component is rendered as a standalone left navigation bar */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* The Header component is the top navigation bar */}
        <Header />
        <main className="flex-1 p-4 overflow-y-auto">
          {/* Here you can conditionally render different views, for example, the PinFeed or UploadPin */}
          {view === 'feed' ? <PinFeed /> : <UploadPin />}
        </main>
      </div>
    </div>
  );
}
