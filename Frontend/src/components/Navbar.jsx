import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handler for user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Helper function to check if a navigation link is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Effect to handle clicks outside the mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      // If the menu is open and the click is outside the menu itself AND not on the hamburger button, close the menu
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.hamburger')) {
        setMenuOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function: remove the event listener using the SAME function reference
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // <-- THIS LINE IS THE FIX
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    // Main navigation container
    <nav
      className="fixed top-0 left-0 w-full text-white py-4 px-6 shadow-2xl z-[999] backdrop-blur-sm"
      style={{ background: 'linear-gradient(145deg, #0f172a, #172554)' }} // Applied the gradient here
    >
      {/* Navbar content container */}
      <div className="flex items-center justify-between w-[95%] mx-auto max-w-7xl">
        {/* Brand Name/Logo */}
        <Link to="/home" className="text-4xl sm:text-5xl font-bold no-underline text-pink-500 mr-auto">
          <span className="bg-gradient-to-r from-sky-500 to-cyan-400 text-transparent bg-clip-text">
            Uni
          </span>
          Collab
        </Link>

        {/* Right section of the navbar (contains nav links and hamburger) */}
        <div className="flex items-center gap-5 relative" ref={menuRef}>
          {/* Navigation Links List */}
          <ul
            className={`
              list-none mt-0

              md:flex md:flex-row md:gap-8
              md:relative md:top-auto md:right-auto md:bg-transparent md:rounded-none md:shadow-none md:p-0
              md:max-h-full md:opacity-100 md:translate-y-0 md:pointer-events-auto

              flex flex-col gap-6 absolute top-5 right-6 bg-slate-800 rounded-lg shadow-lg p-4
              overflow-hidden transition-all duration-300 ease-in-out z-[1000]

              ${menuOpen
                ? 'max-h-96 opacity-100 translate-y-0 pointer-events-auto'
                : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
              }
            `}
          >
            {[
              { path: "/home", label: "Home" },
              { path: "/post", label: "Post Idea" },
              { path: "/profile", label: "Profile" },
            ].map((item) => (
              <li key={item.path} className="my-2 md:my-0 text-right md:text-left group">
                <Link
                  to={item.path}
                  className={`
                    text-white no-underline font-medium text-lg relative pb-1 block
                    ${isActive(item.path) ? "text-cyan-400" : "hover:text-cyan-400"}
                  `}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  <span
                    className={`
                      absolute inset-x-0 bottom-0 h-0.5 bg-cyan-400 origin-left transition-transform duration-300 ease-out
                      ${isActive(item.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                    `}
                  ></span>
                </Link>
              </li>
            ))}
            <li className="my-2 md:my-0 text-right md:text-left group">
              <span
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="text-white font-medium text-lg cursor-pointer relative pb-1 block hover:text-cyan-400"
              >
                Logout
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                ></span>
              </span>
            </li>
          </ul>

          {/* Hamburger Button (visible only on small screens) */}
          <button
            className={`md:hidden flex flex-col gap-2 cursor-pointer bg-transparent border-none outline-none shadow-none p-2 m-0 z-[1001] relative hamburger`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block h-0.5 w-6 bg-white rounded-sm transition-transform duration-300 ease-in-out
                ${menuOpen ? "rotate-45 translate-x-[4px] translate-y-[8px]" : ""}
              `}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-white rounded-sm transition-opacity duration-300 ease-in-out
                ${menuOpen ? "opacity-0" : ""}
              `}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-white rounded-sm transition-transform duration-300 ease-in-out
                ${menuOpen ? "-rotate-45 translate-x-[4px] -translate-y-[8px]" : ""}
              `}
            ></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;