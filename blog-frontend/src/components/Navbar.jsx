import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { usePinStore } from "../store/usePinStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { searchUsers, searchResults: userResults } = useUserStore();
  const { searchPins } = usePinStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [pinsResults, setPinsResults] = useState([]);
  const [resultsCount, setResultsCount] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPinsResults([]);
    setResultsCount(null);
    if (!query.trim()) return;

    try {
      await searchUsers(query);
      if (userResults.length > 0) {
        setResultsCount(userResults.length);
        setPinsResults([]);
        return;
      }

      const pins = await searchPins(query);
      if (pins.length > 0) {
        setPinsResults(pins);
        setResultsCount(pins.length);
      } else {
        setResultsCount(0);
      }
    } catch (err) {
      console.error(err);
      setResultsCount(0);
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="navbar px-6 py-3 flex flex-col lg:flex-row lg:justify-between items-center gap-4">
        
        {/* Logo */}
        <h1 
          className="text-3xl font-extrabold text-green-600 dark:text-green-400 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Sweety
        </h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative w-full lg:w-2/5">
          <input
            type="text"
            placeholder="Search users or pins..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-20 py-3 rounded-full border border-gray-300 dark:border-gray-700
                       focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300
                       bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 
                       shadow-sm transition-colors duration-300"
          />
          {/* Search icon */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </span>

          {/* Results count badge */}
          {resultsCount !== null && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
              {resultsCount} found
            </span>
          )}
        </form>

        {/* Profile / Login */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                className="avatar cursor-pointer"
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                <div className="w-10 h-10 rounded-full border-2 border-green-400 dark:border-green-500 overflow-hidden">
                  <img
                    src={user.profileImageUrl || "/default-avatar.png"}
                    alt={user.username || "Profile"}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-white dark:bg-gray-800 rounded-lg w-44 mt-2"
              >
                <li>
                  <a onClick={() => navigate(`/profile/${user.username}`)} className="hover:bg-green-100 dark:hover:bg-green-700">Profile</a>
                </li>
                <li>
                  <a onClick={logout} className="hover:bg-red-100 dark:hover:bg-red-700">Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="btn btn-sm bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-white shadow-md"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Pins search dropdown */}
      {pinsResults.length > 0 && (
        <div className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-2 max-w-xl w-full left-1/2 -translate-x-1/2 z-50 p-2">
          {pinsResults.map((pin) => (
            <div
              key={pin.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
              onClick={() => navigate(`/pin/${pin.id}`)}
            >
              {pin.fileType?.includes("image") ? (
                <img src={pin.fileUrl} alt={pin.title} className="w-12 h-12 object-cover rounded-md" />
              ) : (
                <video src={pin.fileUrl} className="w-12 h-12 object-cover rounded-md" />
              )}
              <span className="text-gray-900 dark:text-gray-100 truncate">{pin.title || "Untitled"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
