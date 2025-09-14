import React from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import teamworkAnimation from "../animations/teamwork.json";
import { FaRocket, FaSignInAlt } from "react-icons/fa";
// Icons
import { FaLightbulb, FaUsers, FaFolderOpen } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const Home = () => {
  return (
    <div
      className="relative min-h-screen text-white overflow-x-hidden"
      style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
    >
      {/* Welcome Section */}
      <section className="w-full px-4 md:px-8 py-20 flex justify-center">
        {/* Removed max-w-7xl to make it full width, adjusted padding */}
        <div className="rounded-xl bg-white/5 backdrop-blur-md shadow-2xl w-full p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div
              className="w-full md:w-1/2 flex justify-center items-center" // Centering Lottie horizontally on small screens
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Player
                autoplay
                loop
                src={teamworkAnimation}
                style={{ height: "300px", width: "100%", maxWidth: "400px" }} // Reduced height and added max-width for smaller screens
              />
            </motion.div>

            <motion.div
              className="w-full md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left" // Adjusted space-y for smaller screens
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={1}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight space-y-2">
                <motion.span
                  className="block animated-gradient-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  Welcome to
                </motion.span>
                <span
                  className="bg-clip-text text-transparent inline" // `inline` to keep on same line
                  style={{ backgroundColor: "rgb(255, 0, 179)" }}
                >
                  Uni
                </span>
                {/* Removed 'block' here to keep Uni and Collab on the same line */}
                <span
                  className="bg-clip-text text-transparent inline" // `inline` to keep on same line
                  style={{ backgroundColor: "#22d3ee" }}
                >
                  Collab
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300"> {/* Adjusted font size for smaller screens */}
                The ultimate platform for students to share innovative project
                ideas, find teammates, and bring those ideas to life!
              </p>

              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 w-full max-w-md mx-auto sm:mx-0 sm:max-w-none"> {/* Buttons stack on small, then row */}
                {/* Get Started Button */}
                <Link
                  to="/auth"
                  className="group relative inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-400 to-cyan-500 bg-size-200 bg-pos-0 transition-all duration-500 ease-out hover:bg-pos-100 shadow-md hover:shadow-emerald-400/40 hover:scale-105"
                >
                  <FaRocket className="text-white group-hover:-rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-white/10 rounded-full blur-sm opacity-20 group-hover:opacity-30 transition duration-300"></span>
                </Link>

                {/* Login Button */}
                <Link
                  to="/auth"
                  className="group relative inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 rounded-full font-semibold text-pink-400 border-2 border-pink-400 bg-white/5 backdrop-blur-sm hover:bg-pink-400 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <FaSignInAlt className="group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 rounded-full bg-pink-400 opacity-10 blur-md group-hover:opacity-20 transition duration-300"></span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose UniCollab */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10"> {/* Added px for smaller screens */}
        <motion.h2
          className="text-2xl sm:text-3xl font-bold mb-8 md:mb-12 text-center md:text-left animated-gradient-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400" // Center on small, left on medium+
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Why Choose UniCollab?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"> {/* Adjusted gap for smaller screens */}
          {[
            {
              icon: <FaLightbulb size={30} className="text-cyan-300 mx-auto" />,
              title: "Share Innovative Ideas",
              desc: "Post your unique project ideas and get feedback from the student community.",
            },
            {
              icon: <FaUsers size={30} className="text-yellow-300 mx-auto" />,
              title: "Find Teammates",
              desc: "Collaborate with like-minded students from your university or others.",
            },
            {
              icon: (
                <FaFolderOpen size={30} className="text-green-400 mx-auto" />
              ),
              title: "Build Your Portfolio",
              desc: "Work on real-world projects and showcase your skills to recruiters.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-6 text-center rounded-2xl backdrop-blur-md bg-white/5 border border-white/10"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={i}
              viewport={{ once: true }}
            >
              <div className="mb-3">{feature.icon}</div>
              <h5 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h5> {/* Adjusted title font size */}
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10"> {/* Added px for smaller screens */}
        <motion.h2
          className="text-2xl sm:text-3xl font-bold mb-8 md:mb-12 text-center md:text-left animated-gradient-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400" // Center on small, left on medium+
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center"> {/* Adjusted grid and gap for smaller screens */}
          {[
            {
              number: "1",
              color: "text-cyan-400",
              label: "Sign Up",
              desc: "Create your free UniCollab account.",
            },
            {
              number: "2",
              color: "text-yellow-400",
              label: "Explore Ideas",
              desc: "Share your ideas or browse existing ones.",
            },
            {
              number: "3",
              color: "text-green-400",
              label: "Connect",
              desc: "Request to join projects or find collaborators.",
            },
            {
              number: "4",
              color: "text-pink-400",
              label: "Launch",
              desc: "Turn your ideas into a successful project.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="rounded-xl py-8 px-5 backdrop-blur-md bg-white/5 border border-white/10"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={i}
              viewport={{ once: true }}
            >
              <h6 className="font-semibold text-base sm:text-lg mb-2"> {/* Adjusted text size */}
                <span className={`${item.color} font-bold text-xl mr-1`}>
                  {item.number}.
                </span>
                {item.label}
              </h6>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;