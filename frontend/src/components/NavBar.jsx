import React, { useState, useEffect } from "react";
import { LogIn, UserPlus, Menu, X } from "lucide-react";

const NavBar = ({ onLoginClick, onSignupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    onLoginClick && onLoginClick();
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    onSignupClick && onSignupClick();
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out 
      ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-gradient-to-r from-blue-500 to-purple-500"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <div className="flex items-center group transition-transform duration-300 hover:scale-105 cursor-pointer">
              <img
                src="/icon.png"
                alt="Project Icon"
                className="h-10 w-10 group-hover:rotate-6 transition-transform duration-300"
              />
              <span
                className={`ml-2 text-xl font-bold transition-colors duration-300 
                ${isScrolled ? "text-gray-800" : "text-white"}`}
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Trigger Tide
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={handleLogin}
              className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-300 
              transform hover:scale-105 hover:shadow-xl group
              ${
                isScrolled
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "border border-white text-white hover:bg-white hover:text-blue-500"
              }`}
            >
              <LogIn className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              LOGIN
            </button>
            <button
              onClick={handleSignup}
              className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-300 
              transform hover:scale-105 hover:shadow-xl group
              ${
                isScrolled
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-white text-blue-500 hover:bg-opacity-90"
              }`}
            >
              <UserPlus className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              SIGNUP
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform 
              transform hover:scale-110 
              ${isScrolled ? "text-gray-800" : "text-white"}`}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 animate-rotate-in" />
              ) : (
                <Menu className="h-6 w-6 animate-rotate-out" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out 
        ${
          isMenuOpen
            ? "max-h-40 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        } 
        ${
          isScrolled
            ? "bg-white shadow-lg"
            : "bg-gradient-to-r from-blue-500 to-purple-500"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            onClick={handleLogin}
            className={`w-full block px-3 py-2 rounded-md transition-all duration-300 
            transform hover:scale-105 
            ${
              isScrolled
                ? "text-blue-500 border border-blue-500 hover:bg-blue-50"
                : "text-white border border-white hover:bg-white hover:text-blue-500"
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={handleSignup}
            className={`w-full block px-3 py-2 rounded-md text-center transition-all duration-300 
            transform hover:scale-105 
            ${
              isScrolled
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-white text-blue-500 hover:bg-opacity-90"
            }`}
          >
            SIGNUP
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
