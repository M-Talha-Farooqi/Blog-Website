import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-6">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-2xl font-extrabold tracking-wide">Blog App</h3>
            <p className="text-gray-400 mt-2">
              Share your thoughts with the world
            </p>
          </div>
         
        </div>
        <div className="mt-6 flex justify-center space-x-6">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Blog App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
