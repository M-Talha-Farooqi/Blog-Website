import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginDialog from "./auth/LoginDialog";
import SignupDialog from "./auth/SignupDialog";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-white font-bold text-2xl"
          >
            <svg
              className="h-8 w-8 text-white mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
            BlogApp
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-white hover:text-gray-300">
                  <img
                    className="h-8 w-8 rounded-full border-2 border-white"
                    src={`https://ui-avatars.com/api/?name=${
                      user?.username || "User"
                    }&background=random`}
                    alt={user?.username}
                  />
                  <span className="hidden md:inline font-medium">
                    {user?.username}
                  </span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white text-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-white hover:text-gray-300 font-medium transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <SignupDialog
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </nav>
  );
};

export default Navbar;
