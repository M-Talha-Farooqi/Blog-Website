import { create } from "zustand";

const usePostsStore = create((set, get) => ({
  posts: [],

  setPosts: (posts) => set({ posts }),

  getPublished: (id) => get().posts.find((post) => post._id === id),

  addPost: (post) =>
    set((state) => ({
      posts: [...state.posts, post],
    })),

  updatePost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      ),
    })),

  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
    })),
}));

export { usePostsStore };
