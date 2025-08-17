import { NavLink } from "react-router-dom";
import { AiOutlineHome, AiOutlineCompass, AiOutlineUpload, AiOutlineSetting } from "react-icons/ai";

const links = [
  { name: "Home", path: "/dashboard", icon: <AiOutlineHome size={22} /> },
  { name: "Explore", path: "/explore", icon: <AiOutlineCompass size={22} /> },
  { name: "Upload", path: "/upload", icon: <AiOutlineUpload size={22} /> },
  { name: "Settings", path: "/settings", icon: <AiOutlineSetting size={22} /> },
];

export default function Sidebar() {
  return (
    <div className="h-screen w-64 p-6 bg-gradient-to-b from-green-100 to-green-300 dark:from-gray-900 dark:to-gray-800 shadow-2xl flex flex-col transition-colors duration-500">
      
      {/* Logo / Brand */}
      <h1 className="text-4xl font-extrabold mb-10 text-green-700 dark:text-green-400 tracking-tight">
        Sweety
      </h1>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4">
        {links.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-2xl font-semibold text-lg transition-all
               ${isActive
                  ? "bg-gradient-to-r from-green-500 to-lime-400 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-200 hover:bg-green-200 dark:hover:bg-gray-700 hover:text-green-800 dark:hover:text-green-300"}`
            }
          >
            {icon}
            {name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
