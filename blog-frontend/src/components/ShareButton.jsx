import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { FiShare2, FiCopy, FiFacebook, FiPhone } from "react-icons/fi";

export default function ShareButton({ pinId }) {
  const [links, setLinks] = useState({});
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(`/pins/${pinId}/share`);
        setLinks(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load share links");
      }
    };
    fetchLinks();
  }, [pinId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(links.copyLink);
    toast.success("Link copied!");
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Share button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-all duration-300"
      >
        <FiShare2 />
        Share
      </button>

      {/* Dropdown horizontal */}
      <div
        className={`
          absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2
          transition-all duration-300 transform origin-top ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex gap-3 justify-center">
          {/* Copy Link */}
          <button
            onClick={copyLink}
            className="flex flex-col items-center justify-center gap-1 p-2 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            <FiCopy size={20} className="text-gray-600 dark:text-gray-200" />
            <span className="text-xs text-gray-800 dark:text-gray-100 text-center">Copy</span>
          </button>

          {/* WhatsApp */}
          {links.whatsapp && (
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 p-2 w-20 h-20 bg-green-100 dark:bg-green-700 rounded-lg hover:bg-green-200 dark:hover:bg-green-600 transition-all"
            >
              <FiPhone size={20} className="text-green-700 dark:text-green-300" />
              <span className="text-xs text-green-700 dark:text-green-300 text-center">WhatsApp</span>
            </a>
          )}

          {/* Facebook */}
          {links.facebook && (
            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 p-2 w-20 h-20 bg-blue-100 dark:bg-blue-700 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-600 transition-all"
            >
              <FiFacebook size={20} className="text-blue-700 dark:text-blue-300" />
              <span className="text-xs text-blue-700 dark:text-blue-300 text-center">Facebook</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
