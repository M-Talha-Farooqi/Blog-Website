import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostsStore } from "../stores/usePostsStore";
import { useAuth } from "../hooks/useAuth";
import PostEdit from "./PostEdit";

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPublished, deletePost, setPosts } = usePostsStore();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all posts from the database
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setPosts]);

  // Fetch the post data
  useEffect(() => {
    const fetchedPost = getPublished(id);
    if (fetchedPost) {
      setPost(fetchedPost);
    }
  }, [id, getPublished]);

  // Check if user is the author of the post
  const canEdit = user && user.id === post?.authorId;
  const canDelete = user && user.id === post?.authorId;

  const handleDelete = async () => {
    if (!post) return;
    try {
      const response = await fetch(
        `http://localhost:5001/api/posts/${post._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      deletePost(post._id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
          <p className="mt-2 text-gray-600">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <svg
              className="w-4 h-4 mr-2 inline"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return <PostEdit post={post} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <svg
              className="w-4 h-4 mr-2 inline"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z"
                clipRule="evenodd"
              />
            </svg>
            Back to Posts
          </button>

          {(canEdit || canDelete) && (
            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <svg
                    className="w-4 h-4 mr-2 inline"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  <svg
                    className="w-4 h-4 mr-2 inline"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Featured Image */}
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-8">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-white/80 backdrop-blur-sm rounded">
              {post.category}
            </span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                post.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {post.status === "published" ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        {/* Title and Meta */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.publishedDate}</span>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="relative h-12 w-12 rounded-full bg-gray-200">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-full w-full rounded-full"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{post.author.name}</div>
            <div className="text-sm text-gray-600">Author</div>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
      </article>
    </div>
  );
};

export default PostView;
