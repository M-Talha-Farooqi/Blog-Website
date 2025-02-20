import Navbar from "./components/Navbar";
import PostList from "./components/PostList";
import FeaturedPosts from "./components/FeaturedPosts";

const App = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      {/* NAVBAR */}
      <Navbar />
      {/* BREADCRUMB */}
      {/* INTRODUCTION */}
      {/* FEATURED POSTS */}
      <FeaturedPosts />
      {/* POST LIST */}
      <PostList />
    </div>
  );
};

export default App;
