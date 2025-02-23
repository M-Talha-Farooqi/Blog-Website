import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostsStore } from "../stores/usePostsStore";
import { useAuth } from "../hooks/useAuth";

const PostEdit = ({ post }) => {
  const navigate = useNavigate();
  const { setPosts } = usePostsStore();
  const { user } = useAuth();

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [image, setImage] = useState(post?.featuredImage || "");
  const [tags, setTags] = useState(post?.tags.join(", ") || "");
  const [category, setCategory] = useState(post?.category || "Technology");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) {
      alert("You must be logged in to update a post.");
      return;
    }

    const updatedPost = {
      title,
      content,
      featuredImage: image,
      tags: tags.split(",").map((tag) => tag.trim()),
      category,
      authorId: user.id,
      author: {
        name: user.name || "Anonymous",
        avatar: "https://avatar.iran.liara.run/public",
      },
    };

    try {
      const response = await fetch(
        `http://localhost:5001/api/posts/${post._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPost),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedData = await response.json();
      setPosts((prevPosts) => {
        if (!Array.isArray(prevPosts)) {
          console.error(
            "Expected prevPosts to be an array, but got:",
            prevPosts
          );
          return [];
        }
        return prevPosts.map((p) =>
          p._id === updatedData._id ? updatedData : p
        );
      });

      const fetchPosts = async () => {
        try {
          const response = await fetch("http://localhost:5001/api/posts");
          if (!response.ok) {
            throw new Error("Failed to fetch posts");
          }
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      await fetchPosts();

      alert("Post updated successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            {[
              "Technology",
              "Programming",
              "Design",
              "Business",
              "Lifestyle",
              "Other",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Featured Image URL
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1  block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default PostEdit;
