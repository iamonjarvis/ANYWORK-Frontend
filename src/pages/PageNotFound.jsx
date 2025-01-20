import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#EAF8E7] to-[#C1E6BA]">
      <h1 className="text-6xl font-bold text-[#023336] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-[#023336] mb-6">
        Page Not Found
      </h2>
      <p className="text-lg text-[#023336] mb-8">
        The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")} // Redirect to the homepage
        className="bg-[#4DA674] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#023336] hover:text-[#EAF8E7] transition"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default PageNotFound;
