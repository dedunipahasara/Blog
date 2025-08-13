import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaPlus, FaUser } from 'react-icons/fa'; // Updated to use react-icons
import { useStore } from '../store';

export default function Sidebar() {
  const { user } = useStore();
  const linkClass = "flex items-center p-3 my-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors";
  const activeLinkClass = "flex items-center p-3 my-2 rounded-lg bg-gray-200 text-red-600 font-semibold";

  return (
    <aside className="w-64 min-h-screen bg-white p-4 shadow-lg hidden md:block">
      <div className="text-2xl font-bold mb-8 text-red-600">Sweety</div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
              <FaHome className="w-5 h-5 mr-3" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/create" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
              <FaPlus className="w-5 h-5 mr-3" /> Create Pin
            </NavLink>
          </li>
          <li>
            <NavLink to={`/profile/${user?.username}`} className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
              <FaUser className="w-5 h-5 mr-3" /> Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
