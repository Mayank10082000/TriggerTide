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
    <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-md py-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and brand with custom project icon */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/icon.png" alt="Project Icon" className="h-10 w-10" />
              <span
                className="text-2xl font-bold text-white tracking-wider"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  textShadow: "1px 1px 0 rgba(0, 0, 0, 0.8)",
                }}
              >
                Trigger Tide
              </span>
            </Link>
          </div>

          {/* Auth buttons on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center bg-indigo-700 border-2 border-cyan-400 px-4 py-1 text-sm font-medium text-white shadow-[3px_3px_0px_0px_rgba(6,182,212,0.8)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(6,182,212,0.8)] transition-all duration-150"
            >
              <LogIn className="h-4 w-4 mr-1" />
              LOGIN
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center bg-cyan-700 border-2 border-yellow-400 px-4 py-1 text-sm font-medium text-white shadow-[3px_3px_0px_0px_rgba(250,204,21,0.8)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(250,204,21,0.8)] transition-all duration-150"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              SIGNUP
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-yellow-300 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-3 mt-2 mx-4 bg-gray-900 border-2 border-cyan-400 shadow-[4px_4px_0px_0px_rgba(6,182,212,0.5)]">
          {/* Mobile auth buttons */}
          <div className="pt-2 flex flex-col space-y-2">
            <Link
              to="/login"
              className="flex items-center bg-indigo-700 border-2 border-cyan-400 px-4 py-1 text-base font-medium text-white shadow-[3px_3px_0px_0px_rgba(6,182,212,0.8)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(6,182,212,0.8)] transition-all duration-150"
            >
              <LogIn className="h-4 w-4 mr-2" />
              LOGIN
            </Link>

            <Link
              to="/signup"
              className="flex items-center bg-cyan-700 border-2 border-yellow-400 px-4 py-1 text-base font-medium text-white shadow-[3px_3px_0px_0px_rgba(250,204,21,0.8)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(250,204,21,0.8)] transition-all duration-150 mb-2"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              SIGNUP
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
