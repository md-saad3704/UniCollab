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
      <Route path="/ProjectDetails/:id" element={<ProjectDetails />} />
      <Route path="/post" element={<PostIdea />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
