import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [userProjects, setUserProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    email: "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [isClosingDetailModal, setIsClosingDetailModal] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const token = localStorage.getItem("token");

  const MODAL_ANIMATION_DURATION = 300;

  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideInFromTop {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideOutToTop {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(-50px); opacity: 0; }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }

    .fade-in { animation: fadeIn ${MODAL_ANIMATION_DURATION / 1000}s ease-out forwards; }
    .fade-out { animation: fadeOut ${MODAL_ANIMATION_DURATION / 1000}s ease-out forwards; }
    .slide-in-top { animation: slideInFromTop ${MODAL_ANIMATION_DURATION / 1000}s ease-out forwards; }
    .slide-out-top { animation: slideOutToTop ${MODAL_ANIMATION_DURATION / 1000}s ease-out forwards; }

    .btn-glow-edit {
      box-shadow: 0 0px 10px rgba(79, 70, 229, 0.4), 0 0px 20px rgba(79, 70, 229, 0.2);
      transition: box-shadow 0.3s ease-in-out;
    }
    .btn-glow-edit:hover {
      box-shadow: 0 0px 15px rgba(79, 70, 229, 0.6), 0 0px 30px rgba(79, 70, 229, 0.4);
    }
    .btn-glow-delete {
      box-shadow: 0 0px 10px rgba(239, 68, 68, 0.4), 0 0px 20px rgba(239, 68, 68, 0.2);
      transition: box-shadow 0.3s ease-in-out;
    }
    .btn-glow-delete:hover {
      box-shadow: 0 0px 15px rgba(239, 68, 68, 0.6), 0 0px 30px rgba(239, 68, 68, 0.4);
    }

    .read-more-profile-btn {
      color: #81C784 !important;
      cursor: pointer;
      text-decoration: none;
      font-weight: bold;
      position: relative;
      display: inline-block;
      transition: color 0.3s ease-in-out;
    }

    .read-more-profile-btn::after {
      content: '';
      position: absolute;
      width: 100%;
      transform: scaleX(0);
      height: 2px;
      bottom: -2px;
      left: 0;
      background-color: #81C784;
      transform-origin: bottom right;
      transition: transform 0.25s ease-out;
    }

    .read-more-profile-btn:hover::after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }

    .read-more-profile-btn:active {
      animation: pulse 0.3s ease-in-out;
    }
  `;

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else if (res.status === 401 || res.status === 403) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      if (err.message.includes("Failed to fetch")) {
         console.error("Network error. Please check your connection.");
      }
      navigate("/login");
    }
  };

  const fetchUserProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.projects)) {
        const parsedProjects = data.projects.map((p) => ({
          ...p,
          tags: Array.isArray(p.tags)
            ? p.tags
            : typeof p.tags === "string"
            ? JSON.parse(p.tags || "[]")
            : [],
        }));
        setUserProjects(parsedProjects);
      } else if (res.status === 401 || res.status === 403) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      if (err.message.includes("Failed to fetch")) {
        console.error("Network error. Could not load projects.");
     }
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserInfo();
    fetchUserProjects();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    const idToDelete = confirmDeleteId;
    setConfirmDeleteId(null);

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${idToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUserProjects(userProjects.filter((proj) => proj.id !== idToDelete));
      } else {
        console.error("Failed to delete project");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openEditModal = (project) => {
    setEditingProject({
      ...project,
      tagsString: Array.isArray(project.tags) ? project.tags.join(", ") : "",
    });
    setShowProjectModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditingProject((prev) => ({ ...prev, [field]: value }));
  };

  const saveProjectChanges = async () => {
    try {
      const updatedTags = editingProject.tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const updatedProject = {
        ...editingProject,
        tags: updatedTags,
      };
      delete updatedProject.tagsString;

      const res = await fetch(
        `http://localhost:5000/api/projects/${editingProject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProject),
        }
      );

      if (res.ok) {
        setUserProjects((prev) =>
          prev.map((proj) =>
            proj.id === editingProject.id ? updatedProject : proj
          )
        );
        setShowProjectModal(false);
      } else {
        console.error("Failed to save project changes");
      }
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const handleProfileEdit = () => {
    setUpdatedProfile({
      name: user?.name || "",
      email: user?.email || "",
    });
    setShowEditProfile(true);
  };

  const handleProfileSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await res.json();
      if (res.ok) {
        const updatedUser = {
          ...user,
          name: updatedProfile.name,
          email: updatedProfile.email,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setShowEditProfile(false);
      } else {
        console.error("Profile update failed:", data?.error);
      }
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword.length < 6) {
      return setPasswordError("New password must be at least 6 characters long.");
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      return setPasswordError("New passwords do not match");
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess("Password changed successfully!");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
          setPasswordSuccess("");
        }, 1500);
      } else {
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (err) {
      console.error("Password update error:", err);
      setPasswordError("Something went wrong");
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength);
  };

  const openDetailModal = (project) => {
    setSelectedProjectDetails(project);
    setIsClosingDetailModal(false);
    setShowDetailModal(true);
  };

  const startCloseDetailModal = () => {
    setIsClosingDetailModal(true);
    setTimeout(() => {
      setShowDetailModal(false);
      setSelectedProjectDetails(null);
      setIsClosingDetailModal(false);
    }, MODAL_ANIMATION_DURATION);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      if (showDetailModal) {
        startCloseDetailModal();
      } else if (showEditProfile) {
        setShowEditProfile(false);
      } else if (showPasswordModal) {
        setShowPasswordModal(false);
      } else if (showProjectModal) {
        setShowProjectModal(false);
      }
    }
  };

  const DESCRIPTION_MAX_LENGTH = 150;

  return (
    <>
      <style>{animationStyles}</style>

      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header (User Detail Card) */}
          <div className="bg-white/10 border border-white/20 rounded-2xl shadow-lg backdrop-blur-md mb-8 p-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text mb-3 flex items-center">
              Your Profile
            </h2>
            <p className="text-gray-300 mb-1">
              Name: <strong className="text-white">{user?.name || "User"}</strong>
            </p>
            <p className="text-gray-300 mb-4">Email: {user?.email || "N/A"}</p>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                className="px-5 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-[1.02] w-full sm:w-auto"
                onClick={handleProfileEdit}
              >
                <span className="inline-block mr-1">
                  {/* Edit Profile Button Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block align-middle" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </span> Edit Profile
              </button>
              <button
                className="px-5 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:shadow-red-500/50 hover:scale-[1.02] w-full sm:w-auto"
                onClick={() => setShowPasswordModal(true)}
              >
                <span className="inline-block mr-1">
                  {/* Change Password Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block align-middle" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </span> Change Password
              </button>
            </div>
          </div>

          {/* Projects Section Header */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text mb-6 flex items-center">
           
            Your Projects
          </h1>

          {/* Project Deletion Confirmation Message */}
          {confirmDeleteId && (
            <div className="bg-yellow-500/20 border border-yellow-400 text-yellow-300 px-4 py-3 rounded-md mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>Are you sure you want to delete this project?</span>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button className="px-4 py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold" onClick={confirmDelete}>Confirm</button>
                <button className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              </div>
            </div>
          )}

          {/* User Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.length > 0 ? (
              userProjects.map((project) => (
                <div className="relative" key={project.id}>
                  <div className="bg-white/10 border border-white/15 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between h-full transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30">
                    <div>
                      <h5 className="font-bold text-xl text-white mb-2">{project.title}</h5>
                      <p className="text-gray-300 text-sm mb-3">
                        {truncateText(project.description, DESCRIPTION_MAX_LENGTH)}
                        {project.description.length > DESCRIPTION_MAX_LENGTH && (
                          <span
                            className="read-more-profile-btn ml-1"
                            onClick={() => openDetailModal(project)}
                          >
                            ... Read More
                          </span>
                        )}
                      </p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {Array.isArray(project.tags) &&
                          project.tags.map((tag, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-full bg-gray-700 text-gray-200 text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        className="px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-[1.02]"
                        onClick={() => openEditModal(project)}
                      >
                        <span className="inline-block mr-1">
                          {/* Edit Project Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block align-middle" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </span> Edit
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:shadow-red-500/50 hover:scale-[1.02]"
                        onClick={() => handleDelete(project.id)}
                      >
                        <span className="inline-block mr-1">
                          {/* Delete Project Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block align-middle" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.17l2.12-2.12 1.41 1.41L13.41 13.5l2.12 2.12-1.41 1.41L12 14.83l-2.12 2.12-1.41-1.41L10.59 13.5l-2.12-2.12zM15.5 4l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6v2h12V4h-2.5z"/>
                          </svg>
                        </span> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-300 text-center col-span-full mt-8">
                No projects uploaded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1050] modal-overlay fade-in" onClick={handleOverlayClick}>
          <div className="bg-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md border border-white/15 w-[90%] max-w-lg text-white max-h-[80vh] overflow-y-auto modal-content slide-in-top" onClick={(e) => e.stopPropagation()}>
            <h5 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text mb-4 flex items-center">
              {/* Edit Profile Modal Heading Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block align-middle mr-2 bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Profile
            </h5>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Full Name"
              value={updatedProfile.name}
              onChange={(e) => setUpdatedProfile((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Email"
              value={updatedProfile.email}
              onChange={(e) => setUpdatedProfile((prev) => ({ ...prev, email: e.target.value }))}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 ease-out shadow-md hover:shadow-green-500/40" onClick={handleProfileSubmit}>
                Save
              </button>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-all duration-300 ease-out shadow-md hover:shadow-gray-500/40"
                onClick={() => setShowEditProfile(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1050] modal-overlay fade-in" onClick={handleOverlayClick}>
          <div className="bg-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md border border-white/15 w-[90%] max-w-lg text-white max-h-[80vh] overflow-y-auto modal-content slide-in-top" onClick={(e) => e.stopPropagation()}>
            <h5 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text mb-4 flex items-center">
              {/* Change Password Modal Heading Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block align-middle mr-2 bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
              </svg>
              Change Password
            </h5>
            {passwordError && <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded-md mb-4 text-sm">{passwordError}</div>}
            {passwordSuccess && <div className="bg-green-500/20 border border-green-400 text-green-300 px-4 py-2 rounded-md mb-4 text-sm">{passwordSuccess}</div>}
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
            />
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
            />
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Confirm New Password"
              value={passwordForm.confirmNewPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmNewPassword: e.target.value }))}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 ease-out shadow-md hover:shadow-green-500/40" onClick={handleChangePassword}>
                Save
              </button>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-all duration-300 ease-out shadow-md hover:shadow-gray-500/40"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showProjectModal && editingProject && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1050] modal-overlay fade-in" onClick={handleOverlayClick}>
          <div className="bg-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md border border-white/15 w-[90%] max-w-lg text-white max-h-[80vh] overflow-y-auto modal-content slide-in-top" onClick={(e) => e.stopPropagation()}>
            <h5 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text mb-4 flex items-center">
              {/* Edit Project Modal Heading Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block align-middle mr-2 bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Project
            </h5>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Title"
              value={editingProject.title}
              onChange={(e) => handleEditChange("title", e.target.value)}
            />
            <textarea
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 resize-y"
              placeholder="Description"
              rows="3"
              value={editingProject.description}
              onChange={(e) => handleEditChange("description", e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Tags (comma-separated)"
              value={editingProject.tagsString}
              onChange={(e) => handleEditChange("tagsString", e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Category"
              value={editingProject.category}
              onChange={(e) => handleEditChange("category", e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 ease-out shadow-md hover:shadow-green-500/40" onClick={saveProjectChanges}>
                Save
              </button>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-all duration-300 ease-out shadow-md hover:shadow-gray-500/40"
                onClick={() => setShowProjectModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal (for "Read More") */}
      {showDetailModal && selectedProjectDetails && (
        <div
          className={`fixed inset-0 bg-black/70 flex items-center justify-center z-[1050] modal-overlay ${isClosingDetailModal ? 'fade-out' : 'fade-in'}`}
          onClick={handleOverlayClick}
        >
          <div
            className={`bg-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md border border-white/15 w-[90%] max-w-lg text-white max-h-[80vh] overflow-y-auto modal-content ${isClosingDetailModal ? 'slide-out-top' : 'slide-in-top'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text mb-4 flex items-center">
              {/* Project Detail Modal Heading Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block align-middle mr-2 bg-gradient-to-r from-purple-600 to-sky-400 text-transparent bg-clip-text" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              {selectedProjectDetails.title}
            </h3>
            <p className="text-gray-300 mb-2">
              <strong className="text-white">Project Owner:</strong>{" "}
              <strong className="text-white">
                {selectedProjectDetails.author || user.name || "Unknown"}
              </strong>
            </p>
            <p className="text-gray-300 mb-4 whitespace-pre-wrap">
              {selectedProjectDetails.description}
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {Array.isArray(selectedProjectDetails.tags) &&
                selectedProjectDetails.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-gray-700 text-gray-200 text-xs font-medium">
                    {tag}
                  </span>
                ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-all duration-300 ease-out shadow-md hover:shadow-gray-500/40"
                onClick={startCloseDetailModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;