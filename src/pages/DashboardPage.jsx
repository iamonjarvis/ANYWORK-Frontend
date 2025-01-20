import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./axios";
import io from "socket.io-client";
import jwtDecode from "jwt-decode";

// Updated to use the Render backend URL
const socket = io("https://anywork-backend.onrender.com", {
  auth: {
    token: localStorage.getItem("authToken"),
  },
});

const DashboardPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [showApplicants, setShowApplicants] = useState({});
  const [newMessages, setNewMessages] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("authToken")
    ? jwtDecode(localStorage.getItem("authToken")).id
    : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsResponse = await api.get("/jobs/dashboard");
        setAppliedJobs(jobsResponse.data.appliedJobs);
        setPostedJobs(jobsResponse.data.postedJobs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    socket.on("new_message", () => {
      setNewMessages(true);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  const handleMessageClick = async (jobId, senderId, receiverId) => {
    setNewMessages(false);

    try {
      await api.post("/contacts/add", { receiverId });
      navigate("/messages", { state: { jobId, senderId, receiverId } });
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const toggleApplicants = (jobId) => {
    setShowApplicants((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const handleAcceptApplicant = async (jobId, applicantId) => {
    try {
      await api.post(`/jobs/${jobId}/applications/${applicantId}/accept`);
      setPostedJobs((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? {
                ...job,
                applicants: job.applicants.map((applicant) =>
                  applicant.user._id === applicantId
                    ? { ...applicant, status: "accepted" }
                    : applicant
                ),
              }
            : job
        )
      );
      alert("Applicant accepted successfully.");
    } catch (error) {
      console.error("Error accepting applicant:", error);
      alert("Failed to accept the applicant. Please try again.");
    }
  };

  const handleRejectApplicant = async (jobId, applicantId) => {
    try {
      await api.post(`/jobs/${jobId}/applications/${applicantId}/reject`);
      setPostedJobs((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? {
                ...job,
                applicants: job.applicants.map((applicant) =>
                  applicant.user._id === applicantId
                    ? { ...applicant, status: "rejected" }
                    : applicant
                ),
              }
            : job
        )
      );
      alert("Applicant rejected successfully.");
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      alert("Failed to reject the applicant. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-[#EAF8E7] to-[#C1E6BA] flex flex-col">
      <div className="p-6 bg-[#023336] text-white shadow-md flex justify-between items-center sticky top-0 z-10">
        <button
          onClick={handleLogout}
          className="bg-[#4DA674] text-white px-6 py-2 rounded-md hover:bg-[#34840A3] focus:ring-2 focus:ring-[#4DA674]"
        >
          Logout
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/find-work")}
            className="bg-[#4DA674] text-white px-6 py-2 rounded-md hover:bg-[#34840A3] focus:ring-2 focus:ring-[#4DA674]"
          >
            Find Work
          </button>
          <button
            onClick={() => navigate("/post-work")}
            className="bg-[#4DA674] text-white px-6 py-2 rounded-md hover:bg-[#34840A3] focus:ring-2 focus:ring-[#4DA674]"
          >
            Post Work
          </button>
          <button
            onClick={() => navigate("/messages")}
            className={`bg-[#9CBBFC] text-white px-6 py-2 rounded-md hover:bg-[#34840A3] focus:ring-2 focus:ring-[#34840A3] ${newMessages ? "animate-bounce" : ""}`}
          >
            {newMessages ? "New Messages" : "Messages"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 px-6 py-8 gap-6">
        {/* Applied Jobs */}
        <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-[#023336]">Applied Works</h2>
          {appliedJobs.map((job) => (
            <div key={job._id} className="p-6 mb-4 border-l-8 border-[#F9CD6A] rounded-lg bg-[#D8EFF7] shadow-sm hover:shadow-md">
              <h3 className="text-xl font-semibold text-[#023336]">{job.title}</h3>
              <p className="text-[#023336]">Amount: Rs{job.amount}</p>
              <p className="text-[#023336]">Date: {job.date} | Time: {job.time}</p>
              <p className="text-[#023336]">Location: {job.location}</p>
              {job.applicants
                .filter((a) => a.user === userId)
                .map((a) => (
                  <div key={a.user._id}>
                    <p className="text-[#023336]">Application Status: {a.status}</p>
                    {a.status === "accepted" && (
                      <button
                        onClick={() =>
                          handleMessageClick(job._id, userId, job.employer._id)
                        }
                        className="bg-[#4DA674] text-white px-6 py-2 rounded-md mt-4 hover:bg-[#34840A3] focus:ring-2 focus:ring-[#4DA674]"
                      >
                        Message
                      </button>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Posted Jobs */}
        <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-[#023336]">Posted Works</h2>
          {postedJobs.map((job) => (
            <div key={job._id} className="p-6 mb-4 border-l-8 border-[#F9CD6A] rounded-lg bg-[#D8EFF7] shadow-sm hover:shadow-md">
              <h3 className="text-xl font-semibold text-[#023336]">{job.title}</h3>
              <p className="text-[#023336]">Amount: Rs{job.amount}</p>
              <p className="text-[#023336]">Date: {job.date} | Time: {job.time}</p>
              <p className="text-[#023336]">Location: {job.location}</p>
              <button
                onClick={() => toggleApplicants(job._id)}
                className="mt-4 bg-[#F9CD6A] text-[#023336] px-6 py-2 rounded-md hover:bg-[#34840A3] focus:ring-2 focus:ring-[#4DA674]"
              >
                {showApplicants[job._id] ? "Hide Applicants" : "Show Applicants"}
              </button>
              {showApplicants[job._id] && (
                <div className="mt-4">
                  <h4 className="font-semibold text-[#023336]">Applicants:</h4>
                  {job.applicants.length > 0 ? (
                    job.applicants.map((applicant) => (
                      <div
                        key={applicant.user._id}
                        className="p-6 border-l-8 border-[#F9CD6A] rounded-lg mb-4 bg-white shadow-sm"
                      >
                        <p className="text-[#023336]"><strong>Name:</strong> {applicant.user.name}</p>
                        <p className="text-[#023336]"><strong>Age:</strong> {applicant.user.age}</p>
                        <p className="text-[#023336]"><strong>Email:</strong> {applicant.user.email}</p>
                        <p className="text-[#023336]"><strong>Status:</strong> {applicant.status}</p>
                        <div className="flex gap-4 mt-4">
                          {applicant.status !== "accepted" && (
                            <>
                              <button
                                onClick={() =>
                                  handleAcceptApplicant(job._id, applicant.user._id)
                                }
                                className="bg-[#4DA674] text-white px-6 py-2 rounded-md hover:bg-[#34840A3] focus:ring-2 focus:ring-[#4DA674]"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectApplicant(job._id, applicant.user._id)
                                }
                                className="bg-[#F9CD6A] text-white px-6 py-2 rounded-md hover:bg-[#34840A3] focus:ring-2 focus:ring-[#F9CD6A]"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {applicant.status === "accepted" && (
                            <button
                              onClick={() =>
                                handleMessageClick(job._id, job.employer._id, applicant.user._id)
                              }
                              className="bg-[#4DA674] text-white px-6 py-2 rounded-md hover:bg-[#34840A3] focus:ring-2 focus:ring-[#4DA674]"
                            >
                              Message
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#023336]">No applicants yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
