import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import your components here
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PinFeed from './components/PinFeed';
import PinDetail from './pages/PinDetail';
import UploadPin from './components/UploadPin';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      {/* The Toaster component for notifications */}
      <Toaster />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<PinFeed />} />
              <Route path="/create" element={<UploadPin />} />
              <Route path="/pins/:id" element={<PinDetail />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="*" element={
                <div className="p-4 text-center text-gray-500">
                  <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
