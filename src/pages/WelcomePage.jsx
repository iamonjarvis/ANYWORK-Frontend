import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  // Handle user logout and redirection to the homepage
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token from local storage
    navigate("/"); // Redirect to the homepage
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br"
      style={{
        background: "linear-gradient(to bottom right, #EAF8E7, #C1E6BA)", // Gradient background using Palette 2
      }}
    >
      {/* Header Section */}
      <header className="w-full bg-[#023336] py-4 px-6 flex justify-between items-center shadow-md">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-white tracking-wider">ANYWORK</h1>

        {/* Logout Button */}
        <button
          className="text-sm bg-[#4DA674] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#023336] hover:text-[#EAF8E7] transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-[#023336] flex-grow">
        {/* Welcome Title */}
        <h1
          className="text-5xl font-bold mb-8 text-center text-[#023336]"
          style={{
            fontFamily: "Maricle, sans-serif", // Custom font for elegance
          }}
        >
          Welcome !!
        </h1>

        {/* Button Container */}
        <div className="flex flex-col items-center gap-6 mb-10">
          {/* Post Work Button */}
          <button
            className="px-10 py-5 bg-[#4DA674] text-white font-semibold rounded-lg shadow-md text-2xl w-64 text-center hover:bg-[#023336] hover:text-[#EAF8E7] transition"
            onClick={() => navigate("/post-work")}
          >
            Post Work
          </button>

          {/* Find Work Button */}
          <button
            className="px-10 py-5 bg-[#023336] text-white font-semibold rounded-lg shadow-md text-2xl w-64 text-center hover:bg-[#4DA674] hover:text-[#EAF8E7] transition"
            onClick={() => navigate("/find-work")}
          >
            Find Work
          </button>
        </div>

        {/* Footer Section */}
       
      </div>
    </div>
  );
};

export default WelcomePage;
