import React from 'react';
import { useStore } from '../store';
import { NavLink } from 'react-router-dom';
import { FaBell, FaSearch, FaHome, FaPlus } from 'react-icons/fa'; // Updated to use react-icons

export default function Header() {
  const { user } = useStore();

  return (
    <header className="sticky top-0 bg-white shadow-sm z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Search */}
        <div className="flex items-center space-x-4">
          <NavLink to="/" className="text-red-600 font-extrabold text-2xl">
            <span className="hidden sm:inline">Sweety</span>
            <span className="sm:hidden">P</span>
          </NavLink>
          <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search for pins..."
              className="ml-2 bg-transparent w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Navigation and User Actions */}
        <nav className="flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `p-3 rounded-full ${isActive ? 'bg-black text-white' : 'hover:bg-gray-200'}`
            }
            title="Home"
          >
            <FaHome className="w-6 h-6" />
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `p-3 rounded-full ${isActive ? 'bg-black text-white' : 'hover:bg-gray-200'}`
            }
            title="Create"
          >
            <FaPlus className="w-6 h-6" />
          </NavLink>
          <button className="p-3 rounded-full hover:bg-gray-200" title="Notifications">
            <FaBell className="w-6 h-6" />
          </button>
          <NavLink to={`/profile/${user?.username}`} className="p-1 rounded-full hover:bg-gray-200">
            <img
              src={user?.avatar || 'https://placehold.co/40x40/png'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
