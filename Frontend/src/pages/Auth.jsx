import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import axios from "axios";

// Import both Lottie animations
import loginAnimation from "../animations/login.json";
import registerAnimation from "../animations/register.json";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const AuthPage = () => {
  const navigate = useNavigate();
  // State to toggle between login and registration forms
  const [isRegistering, setIsRegistering] = useState(false);

  // Form input states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Function to handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  // Function to handle registration submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: fullName,
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/home");
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8 sm:p-4 md:p-8 overflow-hidden"
      style={{ background: "linear-gradient(145deg, #0f172a, #1e293b)" }}
    >
      <div className="relative bg-slate-800 border border-white/20 backdrop-blur-xl text-white rounded-3xl w-full max-w-4xl shadow-2xl animate-fade-in-up overflow-hidden flex flex-col md:flex-row">
        {/* Left Image Side - Conditionally render Lottie animation */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
          <Player
            autoplay
            loop
            src={isRegistering ? registerAnimation : loginAnimation}
            style={{ height: isRegistering ? "500px" : "350px", width: "100%" }} // Adjust height based on animation
          />
        </div>

        {/* Right Form Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <div className="text-center mb-6">
            <motion.span
              className="block text-3xl font-extrabold animated-gradient-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 text-transparent bg-clip-text"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {isRegistering ? "Create an Account" : "Welcome back!"}
            </motion.span>
            <p className="text-gray-300 text-sm mt-2">
              {isRegistering
                ? "Join the platform to share and collaborate on university projects!"
                : "Log in to connect, collaborate, and innovate with your peers."}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Conditionally render Login or Register Form */}
          {isRegistering ? (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-input block w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-input block w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="form-input block w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-input block w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 rounded-full font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 ease-out shadow-md hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Register
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-input block w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="form-input block w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end mb-6">
                <Link
                  to="/forgot-password"
                  className="text-pink-400 text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-out shadow-md hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </form>
          )}

          {/* Toggle Link */}
          <p className="text-center mt-6 text-gray-300 text-sm">
            {isRegistering
              ? "Already have an account?"
              : "Don’t have an account?"}{" "}
            <Link
              to="#" // Using '#' as a placeholder, will be handled by onClick
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(""); // Clear error when switching forms
                // Optionally clear form fields when switching
                setFullName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-pink-400 hover:underline"
            >
              {isRegistering ? "Login" : "Register"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
