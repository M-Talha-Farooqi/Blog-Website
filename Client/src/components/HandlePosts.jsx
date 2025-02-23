import React, { useEffect } from "react";
import { usePostsStore } from "../stores/usePostsStore";
import PostGrid from "./PostGrid"; // Assuming you have a PostGrid component

const HandlePosts = () => {
  const { posts, setPosts } = usePostsStore();

  useEffect(() => {
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

    fetchPosts();
  }, [setPosts]);

  return (
    <div>
      <h1 className="text-2xl font-bold">All Posts</h1>
      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default HandlePosts;
