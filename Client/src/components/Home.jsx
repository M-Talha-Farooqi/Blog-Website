import React from "react";
import { useNavigate } from "react-router-dom";
import PostGrid from "./PostGrid";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              Share Your Stories with the World
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Start writing and sharing your thoughts with our growing community
              of readers and writers.
            </p>
            {isAuthenticated && (
              <button
                onClick={() => navigate("/create")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
                Create New Post
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostGrid />
      </div>
    </div>
  );
};

export default Home;
