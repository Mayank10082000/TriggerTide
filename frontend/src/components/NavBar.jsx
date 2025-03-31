import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, UserPlus } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg fixed top-0 left-0 w-full z-50 border-b-2 border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/icon.png" alt="Project Icon" className="h-10 w-10" />
              <span
                className="ml-2 text-xl font-bold text-white"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Trigger Tide
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/login"
              className="flex items-center px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-blue-500 transition transform hover:scale-105"
            >
              <LogIn className="h-5 w-5 mr-2" />
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="flex items-center px-4 py-2 bg-white text-blue-500 rounded-md shadow-md hover:shadow-lg transition transform hover:scale-105"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              SIGNUP
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-transform transform hover:scale-110"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-40 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-r from-blue-500 to-purple-500 border-t-2 border-white">
          <Link
            to="/login"
            className="block px-3 py-2 rounded-md text-white border border-white hover:bg-white hover:text-blue-500 transition transform hover:scale-105"
          >
            LOGIN
          </Link>
          <Link
            to="/signup"
            className="block px-3 py-2 rounded-md bg-white text-blue-500 text-center shadow-md hover:shadow-lg transition transform hover:scale-105"
          >
            SIGNUP
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
