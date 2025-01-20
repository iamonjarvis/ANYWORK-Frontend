import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import PostWorkPage from "./pages/PostWorkPage";
import FindWorkPage from "./pages/FindWorkPage";
import DashboardPage from "./pages/DashboardPage";
import MessagePage from "./pages/MessagePage";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token; // Returns true if token exists, false otherwise
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Protected Routes */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-work"
          element={
            <ProtectedRoute>
              <PostWorkPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-work"
          element={
            <ProtectedRoute>
              <FindWorkPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
