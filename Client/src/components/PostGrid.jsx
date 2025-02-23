import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { usePostsStore } from "../stores/usePostsStore";
import { useAuth } from "../hooks/useAuth";
import HandlePosts from "./HandlePosts";

const PostGrid = () => {
  const navigate = useNavigate();
  const { posts } = usePostsStore();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const allCategories = [
    "All",
    "Technology",
    "Programming",
    "Design",
    "Business",
    "Lifestyle",
    "Other",
  ];

  if (!Array.isArray(posts)) {
    console.error("Expected posts to be an array, but got:", posts);
    return <div>No posts available</div>; // Render a fallback UI
  }

  // Memoized filtered posts for performance optimization
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchTerm === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags &&
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  return (
    <div className="w-full bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search & Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-[180px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  {searchTerm
                    ? "No posts found matching your search."
                    : "No published posts yet."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <HandlePosts /> // Renders this if there are no posts in the store
        )}
      </div>
    </div>
  );
};

export default PostGrid;
