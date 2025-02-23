import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePostsStore } from "../stores/usePostsStore";
import { useAuth } from "../hooks/useAuth";

const CATEGORIES = [
  "Technology",
  "Programming",
  "Design",
  "Business",
  "Lifestyle",
  "Other",
];

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPost, getPublished, getDraft, updatePost } = usePostsStore();

  const existingPost = id ? getPublished(id) || getDraft(id) : null;

  const canEdit = user && (user.isAdmin || user.id === existingPost?.authorId);

  useEffect(() => {
    if (id && !canEdit) {
      navigate("/");
    }
  }, [id, canEdit, navigate]);

  const [title, setTitle] = useState(existingPost?.title || "");
  const [content, setContent] = useState(existingPost?.content || "");
  const [image, setImage] = useState(existingPost?.featuredImage || "");
  const [tags, setTags] = useState(existingPost?.tags || []);
  const [category, setCategory] = useState(
    existingPost?.category || "Technology"
  );
  const [status, setStatus] = useState(existingPost?.status || "draft");
  const [activeTab, setActiveTab] = useState("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async (publishStatus = "draft") => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      setStatus(publishStatus);

      const postData = {
        title,
        content,
        featuredImage: image,
        excerpt: content.slice(0, 150) + "...",
        tags,
        category,
        status: publishStatus,
        authorId: user.id,
        author: {
          name: user.username || "Anonymous",
          avatar: "https://avatar.iran.liara.run/public",
        },
        readingTime: Math.ceil(content.split(" ").length / 200),
        publishedDate: new Date(),
      };

      console.log("Post Data:", postData);

      const response = await fetch("http://localhost:5001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to publish post");
      }

      const newPost = await response.json();
      addPost(newPost);

      alert(
        `Post ${publishStatus === "published" ? "published" : ""} successfully.`
      );
      navigate("/");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertText = (tag) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);

    setContent(`${before}${tag}${after}`);
    textarea.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg p-6">
      <div className="space-y-4 pb-4">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Post Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tags (press Enter)"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="featured-image"
            className="block text-sm font-medium text-gray-700"
          >
            Featured Image URL
          </label>
          <input
            id="featured-image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {image && (
            <div className="relative h-48 w-full overflow-hidden rounded-md mt-2">
              <img
                src={image}
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === "edit"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === "preview"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Preview
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => insertText("**Bold**")}
              className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
            >
              B
            </button>
            <button
              onClick={() => insertText("*Italic*")}
              className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
            >
              I
            </button>
            <button
              onClick={() => insertText("__Underline__")}
              className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
            >
              U
            </button>
            <button
              onClick={() => insertText("\n- List item\n")}
              className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
            >
              •
            </button>
            <button
              onClick={() => insertText("\n1. Numbered item\n")}
              className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
            >
              1.
            </button>
            <button
              onClick={() => insertText("![Image alt text](image-url)")}
              className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
            >
              Img
            </button>
            <button
              onClick={() => insertText("[Link text](url)")}
              className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
            >
              Link
            </button>
          </div>
        </div>

        {activeTab === "edit" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post content here... (Supports Markdown)"
            className="block w-full min-h-[400px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
          />
        ) : (
          <div className="prose max-w-none min-h-[400px] p-4 border rounded-md">
            <h1>{title}</h1>
            {image && (
              <img
                src={image}
                alt="Featured"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-2 mt-6">
        <button
          onClick={() => handleSave("published")}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isSubmitting && status === "published" ? (
            <span className="animate-spin ">⏳</span>
          ) : (
            "Publish"
          )}
        </button>
      </div>
    </div>
  );
};

export default PostEditor;
