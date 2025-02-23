import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PostView from "./components/PostView";
import PostEditor from "./components/PostEditor";
import HandlePosts from "./components/HandlePosts";
import Home from "./components/Home";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<HandlePosts />} />
          <Route path="/post/:id" element={<PostView />} />
          <Route path="/create" element={<PostEditor />} />
          <Route path="/edit/:id" element={<PostEditor />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
