import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-white flex items-center justify-between shadow-md">
      {/* Dashboard Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Dashboard
      </button>
    </div>
  );
};

export default Header;
