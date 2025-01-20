import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import api from "./axios"; // Import the axios instance

// Default Marker Icon Fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PostWorkPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    date: "",
    time: "",
    location: "",
    lat: null,
    lng: null,
  });

  const [userLocation, setUserLocation] = useState([22.518, 88.3832]); // Default to Kolkata
  const [message, setMessage] = useState("");

  // Detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setFormData({ ...formData, lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error detecting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty required fields
    if (!formData.title || !formData.description || !formData.amount || !formData.date || !formData.time) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      await api.post("/jobs", formData); // API request to post job

      setMessage("Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        amount: "",
        date: "",
        time: "",
        location: "",
        lat: null,
        lng: null,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error posting job:", error);
      setMessage(error.response?.data?.error || "An error occurred.");
    }
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData({ ...formData, lat, lng }); // Update form data with clicked lat, lng
      },
    });

    return formData.lat && formData.lng ? (
      <Marker position={[formData.lat, formData.lng]} />
    ) : null;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EAF8E7]">
      {/* Header Section */}
      <div className="p-4 bg-gradient-to-r from-[#023336] to-[#4DA674] text-white flex items-center justify-between shadow-md rounded-b-lg">
        <button
          onClick={() => navigate("/welcome")} // Navigate to Find Work page
          className="bg-[#C1E6BA] px-4 py-2 rounded-md hover:bg-[#9DCB95] transition"
        >
          Back
        </button>
        <h1 className="text-xl font-bold">Post a Job</h1>
        <button
          onClick={() => navigate("/dashboard")} // Navigate to Dashboard
          className="bg-[#023336] px-4 py-2 rounded-md hover:bg-[#4DA674] transition"
        >
          Dashboard
        </button>
        <button
          onClick={handleLogout} // Logout button
          className="bg-red-700 px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 text-center ${
            message.startsWith("Job posted") ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Job Posting Form */}
      <form
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 mx-auto mt-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-[#023336]">
          Post a Job
        </h1>

        {/* Job Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-[#023336] font-semibold">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
            placeholder="Enter job title"
            required
          />
        </div>

        {/* Job Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-[#023336] font-semibold"
          >
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
            placeholder="Enter job description"
            required
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="block text-[#023336] font-semibold">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
            placeholder="Enter amount"
            required
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label htmlFor="date" className="block text-[#023336] font-semibold">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
            required
          />
        </div>

        {/* Time */}
        <div className="mb-4">
          <label htmlFor="time" className="block text-[#023336] font-semibold">
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-[#023336] font-semibold">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
            placeholder="Enter location"
          />
        </div>

        {/* Map for Picking Location */}
        <div className="mb-6">
          <label className="block text-[#023336] font-semibold mb-2">
            Select Job Location
          </label>
          <div className="h-60 w-full rounded-lg overflow-hidden">
            <MapContainer
              center={userLocation} // Use user's detected location
              zoom={4}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker />
            </MapContainer>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#4DA674] text-white font-bold py-2 rounded-lg hover:bg-[#023336] transition"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostWorkPage;
