import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import "./ProjectDetails.css"; // Removed: All styles are now in Tailwind
import Navbar from "../components/Navbar";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false); // State for custom alert modal
  const [alertMessage, setAlertMessage] = useState(""); // Message for custom alert modal

  // Inline CSS for custom animations and gradient text
  // This replaces the @keyframes and custom classes from ProjectDetails.css
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.7s ease-out forwards; }

    /* Custom glow for the join button */
    .btn-join-glow {
      transition: all 0.3s ease;
      box-shadow: 0 0 12px rgba(34, 211, 238, 0.6), 0 0 25px rgba(34, 211, 238, 0.4); /* Tailwind's cyan-400 */
    }
    .btn-join-glow:hover {
      transform: scale(1.05);
      box-shadow: 0 0 18px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.6);
    }
  `;

  // Custom alert function to replace window.alert
  const customAlert = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const fetchProject = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`);
      const data = await res.json();
      if (res.ok) {
        // Ensure tags are parsed if they come as a string
        const parsedProject = {
          ...data.project,
          tags: Array.isArray(data.project.tags)
            ? data.project.tags
            : typeof data.project.tags === "string"
            ? JSON.parse(data.project.tags || "[]")
            : [],
        };
        setProject(parsedProject);
      } else {
        console.error("Error fetching project:", data.error);
        customAlert(data.error || "Failed to load project details.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      customAlert("Network error. Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]); // Dependency array includes 'id' to refetch if ID changes

  const handleJoinRequest = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      customAlert("You need to be logged in to send a join request.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        customAlert("Join request sent successfully!");
      } else {
        customAlert(data.error || "Failed to send request.");
      }
    } catch (err) {
      customAlert("Network error: Could not send join request.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-white mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h4 className="text-xl font-semibold">Loading project...</h4>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Project Not Found</h3>
        <Link to="/home" className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:shadow-blue-500/50">
          ← Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <>
      <style>{animationStyles}</style> {/* Apply custom animation styles */}
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto"> {/* Adjusted max-w for content */}
          <Link to="/home" className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-white border border-gray-400 hover:bg-gray-700 transition-all duration-300 ease-out mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Feed
          </Link>

          <div className="bg-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-xl border border-white/15 shadow-2xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text mb-1">
                  {project.title}
                </h4>
                <div className="text-gray-300 text-sm">
                  by <span className="font-semibold text-white">{project.author}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">{project.description}</p>

            <div className="mb-4">
              <h6 className="text-cyan-400 font-semibold text-lg mb-1">Project Category</h6>
              <p className="text-white text-base">{project.category || "N/A"}</p>
            </div>

            <div className="mb-4">
              <h6 className="text-cyan-400 font-semibold text-lg mb-2">Tags</h6>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span key={index} className="bg-cyan-700/20 text-cyan-300 text-sm px-3 py-1 rounded-full border border-cyan-500/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h6 className="text-cyan-400 font-semibold text-lg mb-1">Posted On</h6>
              <p className="text-white text-base">{new Date(project.created_at).toLocaleString()}</p>
            </div>

            <div className="text-right">
              <button
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 ease-out shadow-lg btn-join-glow"
                onClick={handleJoinRequest}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Request to Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1100]">
          <div className="bg-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md border border-white/15 w-[90%] max-w-sm text-white text-center">
            <h5 className="text-xl font-bold mb-4">Notification</h5>
            <p className="mb-6">{alertMessage}</p>
            <button
              className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-out"
              onClick={() => setShowAlertModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetails;