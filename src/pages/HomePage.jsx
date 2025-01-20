import React, { useState } from "react";
import axios from "./axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const endpoint =
        activeTab === "login" ? "/auth/login" : "/auth/register";
      const requestData =
        activeTab === "login"
          ? { email: formData.email, password: formData.password }
          : formData;

      const { data } = await axios.post(endpoint, requestData);

      localStorage.setItem("authToken", data.token);
      setMessage("Success! Redirecting...");
      setTimeout(() => navigate("/welcome"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setMessage("");
    setFormData({
      name: "",
      age: "",
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#EAF8E7] to-[#C1E6BA]">
      <header className="w-full bg-[#023336] py-6 shadow-sm">
        <h1 className="text-4xl font-extrabold text-center text-[#EAF8E7] tracking-wide uppercase">
          AnyWork
        </h1>
      </header>

      <div className="bg-white rounded-xl shadow-md mt-8 px-8 py-6 w-full max-w-lg">
        <div className="flex justify-center gap-6 mb-6">
          <button
            className={`flex-1 text-center font-semibold py-2 rounded-lg ${
              activeTab === "login"
                ? "text-white bg-[#4DA674]"
                : "text-gray-500 bg-gray-100"
            }`}
            onClick={() => handleTabSwitch("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 text-center font-semibold py-2 rounded-lg ${
              activeTab === "signup"
                ? "text-white bg-[#023336]"
                : "text-gray-500 bg-gray-100"
            }`}
            onClick={() => handleTabSwitch("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "signup" && (
            <>
              <div>
                <label className="block text-[#023336] mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-[#023336] mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
                  placeholder="Enter your age"
                  required
                />
              </div>
              <div>
                <label className="block text-[#023336] mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-[#023336] mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-[#023336] mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 font-semibold rounded-lg text-white ${
              isLoading ? "bg-gray-400" : "bg-[#4DA674] hover:bg-[#023336]"
            }`}
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : activeTab === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith("Success") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
