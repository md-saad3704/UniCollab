import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion"; // Ensure motion is imported

// Framer Motion fadeUp variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const PostIdea = () => {
  const navigate = useNavigate();
  const [idea, setIdea] = useState({
    title: "",
    description: "",
    tags: "",
    category: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setIdea({ ...idea, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/projects",
        {
          title: idea.title,
          description: idea.description,
          tags: idea.tags.split(",").map((tag) => tag.trim()),
          category: idea.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Project submitted successfully:", response.data);
      setSubmitSuccess(true);
      setIdea({ title: "", description: "", tags: "", category: "" });
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error(
        "Failed to submit project:",
        error.response?.data || error.message
      );
      setSubmitError(
        error.response?.data?.error ||
          "Failed to post your project. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Define the custom keyframes and animation directly within a style tag */}
      <style>
        {`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-gradient-heading {
          background-size: 200% auto; /* Make the gradient larger than the text */
          animation: gradient-shift 4s ease infinite; /* Apply the animation */
        }
        `}
      </style>

      <Navbar />
      <div
        className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(145deg, #0f172a, #1e293b)" }}
      >
        <div className="relative bg-white/5 border border-white/15 backdrop-blur-xl rounded-3xl max-w-5xl w-full text-white shadow-2xl animate-fade-in-up overflow-hidden flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10">

            <motion.h2
              // Applied the custom class 'animated-gradient-heading'
              // The gradient colors and text clipping are still Tailwind classes
              className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-400 text-transparent bg-clip-text text-center sm:text-left animated-gradient-heading"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            💡Post a Project Idea
            </motion.h2>
            <p className="text-gray-300 text-sm mb-6">
              Share your innovative idea with the student community and start
              collaborating!
            </p>

            {submitError && (
              <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-md mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{submitError}</span>
              </div>
            )}
            {submitSuccess && (
              <div className="bg-green-500/20 border border-green-400 text-green-300 px-4 py-3 rounded-md mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Project submitted successfully! Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Form Group: Project Title */}
              <div className="relative mb-6">
                <input
                  type="text"
                  name="title"
                  className="peer block w-full px-4 pt-7 pb-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="Project Title"
                  value={idea.title}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <label
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 ease-in-out pointer-events-none
                                   peer-focus:top-0 peer-focus:text-indigo-400 peer-focus:text-sm peer-focus:bg-slate-800 peer-focus:px-1 peer-focus:-translate-y-1/2
                                   peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-indigo-400 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:bg-slate-800 peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:-translate-y-1/2"
                >
                  Project Title
                </label>
              </div>

              {/* Form Group: Project Description */}
              <div className="relative mb-6">
                <textarea
                  name="description"
                  className="peer block w-full px-4 pt-7 pb-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out resize-y min-h-[120px]"
                  placeholder="Project Description"
                  value={idea.description}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                ></textarea>
                <label
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 ease-in-out pointer-events-none
                                   peer-focus:top-0 peer-focus:text-indigo-400 peer-focus:text-sm peer-focus:bg-slate-800 peer-focus:px-1 peer-focus:-translate-y-1/2
                                   peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-indigo-400 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:bg-slate-800 peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:-translate-y-1/2"
                >
                  Project Description
                </label>
              </div>

              {/* Form Group: Tags */}
              <div className="relative mb-6">
                <input
                  type="text"
                  name="tags"
                  className="peer block w-full px-4 pt-7 pb-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="Tags (comma separated)"
                  value={idea.tags}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <label
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 ease-in-out pointer-events-none
                                   peer-focus:top-0 peer-focus:text-indigo-400 peer-focus:text-sm peer-focus:bg-slate-800 peer-focus:px-1 peer-focus:-translate-y-1/2
                                   peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-indigo-400 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:bg-slate-800 peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:-translate-y-1/2"
                >
                  Tags (comma separated)
                </label>
              </div>

              {/* Form Group: Category */}
              <div className="relative mb-8">
                <select
                  name="category"
                  className="peer block w-full px-4 pt-7 pb-2 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out appearance-none"
                  value={idea.category}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="" disabled hidden>
                    Select a category
                  </option>
                  <option>Web App</option>
                  <option>Mobile App</option>
                  <option>AI/ML</option>
                  <option>IoT</option>
                  <option>Tool</option>
                  <option>Academic</option>
                  <option>Others</option>
                </select>
                {/* Custom arrow for select */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
                <label
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 ease-in-out pointer-events-none
                                   peer-focus:top-0 peer-focus:text-indigo-400 peer-focus:text-sm peer-focus:bg-slate-800 peer-focus:px-1 peer-focus:-translate-y-1/2
                                   peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-indigo-400 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:bg-slate-800 peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:-translate-y-1/2"
                >
                  Project Category
                </label>
              </div>

              {/* Submit Button */}
              <button
                className="w-full px-6 py-3 rounded-full font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 ease-out shadow-md hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  "Publish Idea"
                )}
              </button>
            </form>
          </div>

          {/* Right: Live Preview Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 hidden lg:block lg:border-l lg:border-white/10">
            <h5 className="text-white text-lg font-semibold mb-4">
              🔍 Live Preview
            </h5>
            <div className="bg-slate-800 p-6 rounded-xl shadow-inner shadow-white/10 h-full">
              <h4 className="text-cyan-400 text-xl font-bold mb-2">
                {idea.title || "Project Title"}
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                {idea.description || "Project description will appear here."}
              </p>

              {idea.tags && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {idea.tags.split(",").map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-slate-700 text-cyan-200 text-xs font-medium"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-400 text-xs mt-4">
                <strong>Category:</strong> {idea.category || "Not selected"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostIdea;
