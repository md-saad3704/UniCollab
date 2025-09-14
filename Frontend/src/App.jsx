import React from "react";
import { Routes, Route, Link, Router } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import MainHome from "./pages/MainHome";
import PostIdea from "./pages/PostIdea";
import Profile from "./pages/Profile";
import ProjectDetails from "./pages/ProjectDetails";

export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/home" element={<MainHome />} />
      <Route path="/post" element={<PostIdea />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/projectideas/:id" element={<ProjectDetails />} />
    </Routes>


    // <div className="min-h-screen flex flex-col">
    //   {/* <header className="bg-blue-800 text-white py-4 shadow-md">
    //     <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
    //       <h1 className="text-2xl font-bold">UniCollab</h1>
    //       <nav className="space-x-4">
    //         <Link to="/" className="hover:underline">Home</Link>
    //         <Link to="/login" className="hover:underline">Login</Link>
    //         <Link to="/register" className="hover:underline">Register</Link>
    //       </nav>
    //     </div>
    //   </header> */}

    //   <main className="flex-grow">
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/auth" element={<Auth />} />
    //     </Routes>
    //   </main>
    // </div>
  );
}
