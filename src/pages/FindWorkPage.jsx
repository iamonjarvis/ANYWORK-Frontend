import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import api from "./axios";

// Default Marker Icon Fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const FindWorkPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [sortOption, setSortOption] = useState("amount");
  const [comments, setComments] = useState({});
  const [userId, setUserId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set()); // Track applied jobs

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to access this page.");
      navigate("/");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserId(payload.id);
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    // Fetch applied jobs for the logged-in user
    const fetchAppliedJobs = async () => {
      try {
        const { data: appliedJobsData } = await api.get(`/users/${userId}/applied-jobs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const appliedJobIds = new Set(appliedJobsData.map((job) => job._id));
        setAppliedJobs(appliedJobIds);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchJobs = async () => {
      try {
        const { data: allJobs } = await api.get("/jobs/available", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const filteredJobs = allJobs.filter((job) => job.employer._id !== userId);
        setJobs(filteredJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [userId]);

  const handleSort = (option) => {
    setSortOption(option);
    const sortedJobs = [...jobs].sort((a, b) => {
      if (option === "amount") return a.amount - b.amount;
      if (option === "date") return new Date(a.date) - new Date(b.date);
      return 0;
    });
    setJobs(sortedJobs);
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to apply for a job.");
      navigate("/login");
      return;
    }

    // Disable the button immediately by adding the job to applied jobs
    setAppliedJobs((prev) => new Set(prev).add(jobId));

    try {
      const response = await api.post(
        `/jobs/${jobId}/apply`,
        { comments: comments[jobId] || "" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Successfully applied for the job!");
      setComments((prev) => ({ ...prev, [jobId]: "" }));
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for the job. Please try again.");
    }
  };

  const handleCommentChange = (e, jobId) => {
    const { value } = e.target;
    setComments((prev) => ({ ...prev, [jobId]: value }));
  };

  const createCustomIcon = (color) => {
    // Default color fallback if none is provided
    const markerColor = color || "#FF6347"; // Fallback to Tomato red
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${markerColor}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white; font-size: 12px; font-weight: bold; color: white;">!</div>`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-tl from-[#EAF8E7] to-[#C1E6BA]">
      {/* Header */}
      <div className="p-4 bg-[#023336] text-white flex items-center justify-between shadow-md rounded-t-lg">
        <button
          onClick={() => navigate("/welcome")}
          className="bg-[#4DA674] text-white px-4 py-2 rounded-md hover:bg-[#34840A3] transition"
        >
          Back
        </button>
        <h1 className="text-xl font-bold">Find Work</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#4DA674] text-white px-4 py-2 rounded-md hover:bg-[#34840A3] transition"
        >
          Dashboard
        </button>
      </div>

      {/* Job Listings */}
      <div className="flex flex-1">
        <div className="w-1/2 p-6 bg-[#C1E6BA] overflow-y-scroll rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-[#023336]">Available Works</h1>
          <div className="mb-4">
            <label className="block text-[#023336] font-semibold mb-2">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
            >
              <option value="amount">Amount</option>
              <option value="date">Date</option>
            </select>
          </div>
          {jobs.map((job) => {
            const applicant = job.applicants.find((applicant) => applicant.user === userId);
            const isApplied = applicant !== undefined;
            const isAccepted = applicant && applicant.status === "accepted";
            const isNotApplied = isApplied && applicant.status !== "applied";

            return (
              <div
                key={job._id}
                className="mb-4 p-4 rounded-lg shadow-lg bg-white border-l-8"
                style={{ borderColor: job.color }}
              >
                <h2 className="text-lg font-bold text-[#023336]">{job.title}</h2>
                <p className="text-[#023336]">Amount: Rs {job.amount}</p>
                <p className="text-[#023336]">Location: {job.location}</p>
                <p className="text-[#023336]">
                  Date: {new Date(job.date).toLocaleDateString()} | Time: {job.time}
                </p>
                <button
                  onClick={() => handleApply(job._id)}
                  disabled={appliedJobs.has(job._id)} // Disable if job is in appliedJobs set
                  className={`mt-2 ${appliedJobs.has(job._id) ? "bg-[#A3A3A3] cursor-not-allowed" : "bg-[#4DA674] hover:bg-[#34840A3]"} text-white font-bold py-1 px-3 rounded-lg`}
                >
                  {appliedJobs.has(job._id) ? "Applied" : "Apply"}
                </button>
                <div className="mt-4">
                  <label htmlFor={`comments-${job._id}`} className="block text-[#023336] font-semibold">Add a comment (optional)</label>
                  <textarea
                    id={`comments-${job._id}`}
                    name={`comments-${job._id}`}
                    value={comments[job._id] || ""}
                    onChange={(e) => handleCommentChange(e, job._id)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DA674]"
                    placeholder="Enter your comments"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Map */}
        <div className="w-1/2">
          <MapContainer center={[22.518, 88.3832]} zoom={4} className="h-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {jobs.map((job) => (
              <Marker
                key={job._id}
                position={[job.lat, job.lng]}
                icon={createCustomIcon(job.color)} // Unique color for each job
              >
                <Popup>
                  <strong>{job.title}</strong>
                  <br />
                  Amount: Rs {job.amount}
                  <br />
                  Location: {job.location}
                  <br />
                  Date: {job.date} | Time: {job.time}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default FindWorkPage;
