import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 hover:scale-105 hover:shadow-xl w-full h-96">
      {post.featuredImage && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition duration-300 hover:scale-110"
          />
        </div>
      )}
      <div className="p-4 flex flex-col justify-between h-[calc(100%-9rem)]">
        <div>
          <div className="flex items-center mb-2">
            <img
              className="h-10 w-10 rounded-full"
              src={
                post.author?.avatar ||
                `https://ui-avatars.com/api/?name=${
                  post.author?.name || "Anonymous"
                }&background=random`
              }
              alt={post.author?.name}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {post.author?.name || "Anonymous"}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.publishedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between">
          <Link
            to={`/post/${post._id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            Read more
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
          <div className="flex space-x-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    featuredImage: PropTypes.string,
    publishedDate: PropTypes.string.isRequired,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
};

export default PostCard;
