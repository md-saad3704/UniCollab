import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const MainHome = () => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFeed(res.data.projects || []);
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error.message || error.response?.data?.error
        );
        setError(
          error.response?.data?.error ||
            "Unable to load projects. Please try again later."
        );
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    fetchProjects();
  }, [navigate]);

  const filteredFeed = feed.filter(
    (item) =>
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        )) &&
      (activeTag === "" || item.tags.includes(activeTag))
  );

  const allTags = [...new Set(feed.flatMap((item) => item.tags))];

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength);
  };

  const DESCRIPTION_MAX_LENGTH = 150; // You can adjust this value

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
        className="min-h-screen text-white pt-24 pb-8 px-4 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(145deg, #0f172a, #1e293b)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <motion.h2
              // Applied the custom class 'animated-gradient-heading'
              // The gradient colors and text clipping are still Tailwind classes
              className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 text-transparent bg-clip-text text-center sm:text-left animated-gradient-heading"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              🚀Student Project Feed
            </motion.h2>
            <Link
              to="/post"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 ease-out shadow-md hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto"
            >
              + Post New Idea
            </Link>
          </div>

          <input
            type="text"
            className="block w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out mb-6"
            placeholder="Search projects or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mb-6 flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200
                  ${activeTag === tag
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-700 text-cyan-200 hover:bg-slate-600"
                  }`}
                onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
              >
                {tag}
              </span>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeed.map((idea) => (
              <div key={idea.id}>
                <div className="bg-white/5 border border-white/15 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between h-full transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30">
                  <div>
                    <div className="flex items-center mb-3">
                      <div>
                        <h6 className="text-white text-base font-semibold">
                          {idea.author}
                        </h6>
                        <small className="text-gray-400 text-xs">
                          Project Owner
                        </small>
                      </div>
                    </div>

                    <h5 className="font-bold text-lg sm:text-xl mb-2 text-white">
                      {idea.title}
                    </h5>
                    <p className="text-gray-300 text-sm mb-3">
                      {truncateText(idea.description, DESCRIPTION_MAX_LENGTH)}
                      {idea.description.length > DESCRIPTION_MAX_LENGTH && (
                        <Link
                          to={`/ProjectDetails/${idea.id}`}
                          className="text-green-400 hover:underline ml-1"
                        >
                          ...Read More
                        </Link>
                      )}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-slate-700 text-cyan-200 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFeed.length === 0 && !error && (
            <div className="text-center mt-10 text-gray-300">
              <h5 className="text-lg font-medium">
                No matching projects found.
              </h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainHome;
